(() => {
  "use strict";

  const SAVE_KEY = "renxun-palace.play.v1";
  const actNumbers = ["序幕", "第一折", "第二折", "第三折", "第四折", "第五折", "第六折", "第七折", "第八折", "第九折"];
  const keepsakes = [["family", "家笺", "笺"], ["key", "副钥", "钥"], ["draft", "底稿", "稿"]];
  const art = index => window.palaceArt(index);
  const story = () => window.PALACE_STORY;
  const screen = () => document.getElementById("play-screen");
  const clone = value => JSON.parse(JSON.stringify(value));
  const tell = (name, detail) => window.dispatchEvent(new CustomEvent("palace:" + name, {detail}));
  let state = null;
  let loaded = false;
  let storageAvailable = true;
  let cancelHold = () => {};
  let reading = null;

  function updateReadingHint(fallback) {
    const hint = screen()?.querySelector(".play-reading-hint");
    if (!hint) return;
    hint.textContent = fallback || (window.palaceSoundEnabled?.()
      ? "安绫音代读戏词 · 点名签可重听" : "安绫音代读戏词 · 开启声效可听");
  }

  function stopReading() {
    if (!reading) return;
    reading.pause();
    reading = null;
  }

  function readNameCard(item) {
    stopReading();
    if (!window.palaceSoundEnabled?.()) return;
    const clip = new Audio("assets/voice-" + item.id + ".mp3");
    reading = clip;
    clip.addEventListener("ended", () => {
      if (reading !== clip) return;
      reading = null;
      updateReadingHint();
    }, {once:true});
    updateReadingHint("安绫音正在代读 · " + item.label.split(" · ")[0]);
    clip.play().catch(() => {
      if (reading !== clip) return;
      reading = null;
      updateReadingHint("代读暂时无法播放，戏词见名签下方。");
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { stopReading(); updateReadingHint(); }
  });

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function button(label, className, handler) {
    const node = el("button", className, label);
    node.type = "button";
    node.addEventListener("click", handler);
    return node;
  }

  // All icons share a stroke and remain decorative beside their text labels.
  const paths = {
    door: "M13.5 4H5v16h8.5 M10 12h10m-4-4 4 4-4 4",
    book: "M3.5 4.5c3-.6 5.8-.1 8.5 1.7 2.7-1.8 5.5-2.3 8.5-1.7v14c-3-.6-5.8-.1-8.5 1.7-2.7-1.8-5.5-2.3-8.5-1.7z M12 6.2v14",
    pin: "M18.5 10c0 5-6.5 10.5-6.5 10.5S5.5 15 5.5 10a6.5 6.5 0 1 1 13 0z M14 10a2 2 0 1 1-4 0 2 2 0 1 1 4 0z",
    check: "m5 12 4.2 4.2L19 6.5",
    seal: "M8 13h8l1.5 3H6.5z M9.5 12V9a2.5 2.5 0 0 1 5 0v3 M5 19h14",
    mask: "M4 7.5 12 4l8 3.5v4.9c0 3.4-3.2 6-8 8-4.8-2-8-4.6-8-8z M8 11l2-.3m4 0 2 .3 M10 15c1.3.9 2.7.9 4 0",
    sound: "M11 5 6 9H3v6h3l5 4z M15 8a6 6 0 0 1 0 8 M18 5a10 10 0 0 1 0 14",
    quiet: "M11 5 6 9H3v6h3l5 4z M15 9l5 6m0-6-5 6"
  };

  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("class", "play-icon");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.55");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    const p = document.createElementNS(svg.namespaceURI, "path");
    p.setAttribute("d", paths[name]);
    svg.append(p);
    return svg;
  }

  function compose(text) {
    return typeof text === "function" ? text(state) : text;
  }

  function read() {
    if (loaded) return;
    loaded = true;
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return;
      const candidate = JSON.parse(raw);
      if (candidate?.version !== 1 || !candidate.checkpoints || !candidate.flags) return;
      if (candidate.scene !== "@ending" && !story().scenes[candidate.scene]) return;
      state = candidate;
    } catch {
      // A blocked storage area still permits a full playthrough in memory.
      storageAvailable = false;
    }
  }

  function snapshot() {
    read();
    return state ? clone(state) : null;
  }

  function save() {
    state.updated = Date.now();
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      storageAvailable = true;
    } catch {
      storageAvailable = false;
    }
    tell("change", clone(state));
  }

  function fresh() {
    loaded = true;
    state = {version:1, scene:"gate", chapter:0, maxChapter:0, completed:false,
      flags:{}, checkpoints:{0:{scene:"gate",flags:{}}}, response:null, task:null, updated:0};
    save();
    render(true);
    return true;
  }

  function resume() {
    read();
    if (!state) return fresh();
    render(true);
    return true;
  }

  function pause() {
    cancelHold();
    stopReading();
    tell("home");
  }

  function restartChapter(n) {
    read();
    const point = state?.checkpoints[n];
    if (!point) return false;
    Object.assign(state, {scene:point.scene, chapter:Number(n), completed:false, flags:clone(point.flags), response:null, task:null});
    save();
    render(true);
    return true;
  }

  function go(id) {
    cancelHold();
    if (!id || (id !== "@ending" && !story().scenes[id])) {
      throw new Error("Missing story scene: " + id);
    }
    state.scene = id;
    state.response = null;
    state.task = null;
    if (id === "@ending") {
      state.completed = true;
    } else {
      const number = story().scenes[id].chapter;
      if (number !== state.chapter) {
        state.chapter = number;
        state.maxChapter = Math.max(state.maxChapter, number);
        state.checkpoints[number] = {scene:id, flags:clone(state.flags)};
      }
    }
    save();
    render(true);
  }

  function choose(choice) {
    if (state.response) return;
    if (choice.set) Object.assign(state.flags, choice.set);
    const target = compose(choice.to);
    if (choice.reply) {
      state.response = {text:compose(choice.reply), speaker:choice.speaker || "", to:target, label:choice.label};
      save();
      render(true);
    } else {
      go(target);
    }
  }

  function castFor(name) {
    if (!name) return null;
    const cast = story().cast || [];
    const found = cast.find(c => c.name === name);
    if (found) return found;
    return cast.find(c => name.length > 1 && c.name.includes(name));
  }

  function toolbar(number, ending) {
    const line = el("div", "play-toolbar");
    const leave = button("回剧场", "play-ghost", pause);
    leave.prepend(icon("door"));
    const mid = el("span", "play-running", ending ? "落　幕" : actNumbers[number] + "　·　" + (number ? story().chapters[number-1].short : "叩宫门"));
    const chapters = button("戏目", "play-ghost", () => tell("chapters"));
    chapters.prepend(icon("book"));
    const tools = el("div", "play-toolbar-tools");
    const sound = button("", "play-ghost play-sound", () => tell("sound"));
    updateSoundButton(sound, !!window.palaceSoundEnabled?.());
    tools.append(sound, chapters);
    line.append(leave, mid, tools);
    return line;
  }

  function updateSoundButton(node, enabled) {
    node.setAttribute("aria-pressed", String(enabled));
    node.setAttribute("aria-label", enabled ? "关闭声效" : "开启声效");
    node.replaceChildren(icon(enabled ? "sound" : "quiet"), el("span","play-sound-text",enabled ? "声效开" : "声效关"));
  }
  window.addEventListener("palace:soundstate", e => {
    const sound = screen()?.querySelector(".play-sound");
    if (sound) updateSoundButton(sound, !!e.detail);
    if (!e.detail) stopReading();
    updateReadingHint();
  });

  function backdrop(number) {
    const box = el("div", "play-backdrop");
    const pic = el("img", "play-backdrop-img");
    pic.alt = "";
    pic.src = art(number);
    box.append(pic);
    return box;
  }

  function progress(number) {
    const line = el("div", "play-progress");
    line.setAttribute("aria-label", number ? actNumbers[number] + "，共九折" : "序幕，共九折");
    for (let i = 1; i <= 9; i++) {
      const part = el("span", "play-segment" + (i < number ? " passed" : i === number ? " current" : ""));
      line.append(part);
    }
    return line;
  }

  function locationLine(scene) {
    const line = el("div", "play-scene-place");
    line.append(icon("pin"), document.createTextNode(scene.place || (state.chapter ? story().chapters[state.chapter-1].place : "宫门")));
    return line;
  }

  function voice(speaker) {
    const row = el("div", "play-voice");
    const entry = castFor(speaker);
    const name = speaker || "旁白";
    const mark = entry?.mark || (name === "旁白" ? "戏" : name.slice(-1));
    const imageUrl = entry && window.palacePortrait?.(entry.name);
    const stamp = imageUrl ? el("img", "play-name-portrait") : el("span", "play-name-mark", mark);
    if (imageUrl) {
      stamp.src = imageUrl;
      stamp.alt = "";
      stamp.addEventListener("error", () => {
        const fallback = el("span", "play-name-mark", mark);
        fallback.setAttribute("aria-hidden", "true");
        stamp.replaceWith(fallback);
      }, {once:true});
    } else {
      stamp.setAttribute("aria-hidden", "true");
    }
    const who = entry ? button(name, "play-name play-name-button", () => tell("cast", entry.name)) : el("span", "play-name", name);
    if (entry) who.title = "查看" + entry.name + "的小传";
    who.prepend(stamp);
    row.append(who);
    if (entry) row.append(el("span", "play-person-role", entry.role));
    return row;
  }

  function foot() {
    const line = el("div", "play-foot");
    const items = el("div", "play-inventory");
    const selected = keepsakes.filter(([f]) => state.flags[f]);
    if (selected.length) {
      items.append(el("span", "play-foot-label", "随身"));
      for (const [,label] of selected) items.append(el("span", "play-keepsake", label));
    } else {
      const moment = state.chapter ? story().chapters[state.chapter-1].date : "宫门清晨";
      items.append(icon("mask"), el("span", "play-foot-label", moment));
    }
    const saving = el("span", "play-saved", storageAvailable ? "进度已存" : "进度仅存本页");
    saving.prepend(icon(storageAvailable ? "check" : "seal"));
    line.append(items, saving);
    return line;
  }

  function sceneHeading(scene) {
    const chap = state.chapter ? story().chapters[state.chapter - 1] : null;
    const top = el("div", "play-scene-heading");
    const caption = el("div", "play-scene-kicker");
    caption.append(el("span", "play-act-label", actNumbers[state.chapter]), locationLine(scene));
    const title = el("h1", "play-scene-title", chap ? chap.title : "访客请走侧门");
    const pointOfView = el("div", "play-perspective", "视角 · " + (chap ? chap.role : "黄仁薰"));
    top.append(caption, title, pointOfView, progress(state.chapter));
    return top;
  }

  function primary(label, handler) {
    const btn = button(label, "play-primary", handler);
    const petal = el("span", "play-diamond");
    petal.setAttribute("aria-hidden", "true");
    btn.append(petal);
    return btn;
  }

  function render(focusBeat = false) {
    cancelHold();
    stopReading();
    cancelHold = () => {};
    const host = screen();
    if (!host) return;
    const lastY = window.scrollY;
    host.replaceChildren();
    if (state.completed) {
      drawEnding(host);
    } else {
      const scene = story().scenes[state.scene];
      const chapter = state.chapter ? story().chapters[state.chapter-1] : null;
      const frame = el("article", "play-frame");
      const artNumber = scene.art ?? chapter?.art ?? 0;
      frame.dataset.art = artNumber;
      frame.append(backdrop(artNumber), toolbar(state.chapter), sceneHeading(scene));
      const sheets = el("div", "play-sheets");
      const script = el("section", "play-script");
      const response = state.response;
      if (response) script.append(el("div", "play-response-label", "你选了「" + response.label + "」"));
      else if (scene.stage) script.append(el("div", "play-stage", compose(scene.stage)));
      script.append(voice(response ? response.speaker : scene.speaker));
      const line = el("p", "play-line", response ? response.text : compose(scene.text));
      line.tabIndex = -1;
      script.append(line);
      if (response) {
        const actions = el("div", "play-actions");
        actions.append(primary("继续", () => go(response.to)));
        script.append(actions);
      } else if (scene.task) {
        drawTask(script, scene);
      } else if (scene.choices?.length) {
        const options = el("div", "play-choices");
        for (const choice of scene.choices) {
          const opt = button(choice.label, "play-option", () => choose(choice));
          opt.prepend(el("span", "play-choice-petal", "◇"));
          options.append(opt);
        }
        script.append(options);
      } else {
        const actions = el("div", "play-actions");
        actions.append(primary(scene.next === "@ending" ? "收卷看结局" : "继续", () => go(compose(scene.next))));
        script.append(actions);
      }
      script.append(foot());
      sheets.append(script);
      frame.append(sheets);
      host.append(frame);
    }
    if (focusBeat && !host.hidden) {
      host.querySelector(".play-line, .play-ending-title")?.focus({preventScroll:true});
      window.scrollTo({top:0,behavior:"instant"});
    } else if (!host.hidden && lastY) {
      window.scrollTo({top:lastY,behavior:"instant"});
    }
  }

  function drawEnding(host) {
    const end = story().ending(state);
    const frame = el("article", "play-frame play-end-frame");
    frame.append(backdrop(0), toolbar(9,true));
    const panel = el("div", "play-ending");
    const heading = el("div", "play-ending-heading");
    heading.append(el("span", "play-act-label", "终　折"));
    const title = el("h1", "play-ending-title", end.title);
    title.tabIndex = -1;
    heading.append(title, el("p", "play-ending-lead", end.lead));
    panel.append(heading);
    const grid = el("div", "play-results");
    for (const item of end.panels) {
      const section = el("section", "play-result");
      section.append(el("h2", "", item.title), el("p", "", item.text));
      grid.append(section);
    }
    panel.append(grid);
    if (end.postscript) {
      const last = el("div", "play-postscript");
      last.append(el("span", "play-ticket-mark", "回执"), el("p","",end.postscript));
      panel.append(last);
    }
    const actions = el("div", "play-ending-actions");
    actions.append(primary("返回剧场", pause), button("重看一折", "play-option", () => tell("chapters")),
      button("取材与片尾", "play-option", () => tell("notes")));
    panel.append(actions);
    frame.append(panel);
    host.append(frame);
  }

  function taskState() {
    if (!state.task) state.task = {read:[],matched:[],ordered:[],selected:"",detail:"",message:"",ready:false};
    return state.task;
  }

  // Rotation leaves the sequence puzzle unsolved on every visit and stable on reload.
  function displayOrder(items) {
    if (items.length < 2) return items;
    const seed = [...state.scene].reduce((sum, c) => sum + c.charCodeAt(0), 0);
    const cut = 1 + seed % (items.length-1);
    return items.slice(cut).concat(items.slice(0,cut));
  }

  function taskComplete(task, taskData) {
    if (task.type === "hold") return taskData.ready;
    if (task.type === "match") return taskData.matched.length === task.items.length;
    if (task.type === "order") return taskData.ordered.length === task.items.length;
    return taskData.read.length === task.items.length;
  }

  function drawTask(script, scene) {
    const task = scene.task;
    const taskData = taskState();
    const box = el("div", "play-task");
    const actionArea = el("div", "play-task-body");
    const note = el("div", "play-task-note");
    note.setAttribute("role","status");
    const hint = el("div", "play-task-prompt", task.prompt);
    hint.prepend(icon("seal"));
    const footer = el("div", "play-task-footer");
    box.append(hint, actionArea, note, footer);
    script.append(box);

    function update() {
      save();
      refresh();
    }

    function taskButton(label, id, fn, className = "") {
      const node = button(label, "play-piece " + className, fn);
      node.dataset.control = id;
      return node;
    }

    function browseItems() {
      const inspected = task.type === "inspect";
      const pieces = el("div","play-pieces");
      const forum = state.scene === "forum";
      const inking = state.scene === "ink";
      if (forum) pieces.classList.add("play-name-cards");
      if (inking) pieces.classList.add("play-paper-sheets");
      for (const item of task.items) {
        const done = taskData.read.includes(item.id);
        const node = taskButton(item.label, item.id, () => {
          if (!taskData.read.includes(item.id)) taskData.read.push(item.id);
          taskData.detail = item.id;
          taskData.message = compose(item.detail) || (inspected ? "已看过这页。" : "已收下「" + item.label + "」。");
          update();
          if (forum) readNameCard(item);
        }, (done ? "is-marked" : "") + (taskData.detail === item.id ? " is-current" : ""));
        if (forum) {
          const [name, office] = item.label.split(" · ");
          const portraitUrl = window.palacePortrait?.(name);
          const portrait = portraitUrl ? el("img", "play-card-portrait") : el("span","play-card-mark",name[0]);
          if (portraitUrl) {
            portrait.src = portraitUrl;
            portrait.alt = "";
            portrait.addEventListener("error", () => {
              const mark = el("span", "play-card-mark", name[0]);
              mark.setAttribute("aria-hidden", "true");
              portrait.replaceWith(mark);
            }, {once:true});
          }
          const title = el("span", "play-card-name", name);
          const caption = el("span", "play-card-office", office);
          const tag = el("span", "play-card-hear", done ? "重听" : "听");
          tag.prepend(icon("sound"));
          node.replaceChildren(portrait, title, caption, tag);
          node.setAttribute("aria-label", item.label);
          node.setAttribute("aria-description", done ? "再听名签" : "翻听名签");
        } else if (inking) {
          const stamp = el("span", "play-sheet-seal", done ? "印" : "待印");
          stamp.setAttribute("aria-hidden", "true");
          node.append(stamp);
          node.setAttribute("aria-label", item.label);
          node.setAttribute("aria-pressed", String(done));
        } else if (done) {
          node.prepend(icon("check"));
        }
        if (inspected) node.setAttribute("aria-pressed", String(taskData.detail === item.id));
        pieces.append(node);
      }
      actionArea.append(pieces);
      if (forum) {
        const hint = el("div", "play-reading-hint", window.palaceSoundEnabled?.()
          ? "安绫音代读戏词 · 点名签可重听" : "安绫音代读戏词 · 开启声效可听");
        actionArea.append(hint);
      }
    }

    function match() {
      const pieces = el("div","play-pieces");
      for (const item of task.items) {
        const done = taskData.matched.includes(item.id);
        const node = taskButton(item.label, item.id, () => {
          taskData.selected = item.id;
          taskData.message = compose(item.detail) || "已选「" + item.label + "」，请定去处。";
          update();
        }, done ? "is-marked" : item.id === taskData.selected ? "is-current" : "");
        if (done) {node.disabled = true; node.prepend(icon("check"));}
        node.setAttribute("aria-pressed", String(item.id === taskData.selected));
        pieces.append(node);
      }
      actionArea.append(pieces);
      if (taskComplete(task, taskData)) return;
      const targets = el("div", "play-targets");
      targets.append(el("span", "play-target-label", "归到"));
      for (const target of displayOrder(task.targets)) {
        const node = taskButton(target.label, "target-" + target.id, () => {
          const item = task.items.find(i => i.id === taskData.selected);
          if (!item) return;
          if (item.target === target.id) {
            taskData.matched.push(item.id);
            taskData.selected = "";
            taskData.message = "「" + item.label + "」已归到「" + target.label + "」。";
          } else {
            taskData.message = "「" + target.label + "」把「" + item.label + "」退了回来。再认一眼落款。";
          }
          update();
        }, "play-target");
        node.disabled = !taskData.selected;
        targets.append(node);
      }
      actionArea.append(targets);
    }

    function order() {
      const row = el("div","play-pieces");
      for (const item of displayOrder(task.items)) {
        const index = taskData.ordered.indexOf(item.id);
        const node = taskButton(index >= 0 ? (index + 1) + " · " + item.label : item.label, item.id, () => {
          if (task.items[taskData.ordered.length].id === item.id) {
            taskData.ordered.push(item.id);
            taskData.message = compose(item.detail) || "「" + item.label + "」已排入。";
          } else {
            taskData.message = "「" + item.label + "」还不在这里。看看前一张应当写什么。";
          }
          update();
        }, index >= 0 ? "is-marked" : "");
        if (index >= 0) node.disabled = true;
        row.append(node);
      }
      actionArea.append(row);
    }

    function hold() {
      if (taskData.ready) return;
      const holdBox = el("div", "play-hold");
      const press = el("button", "play-hold-button");
      press.type = "button";
      press.dataset.control = "hold";
      const meter = el("span", "play-hold-meter");
      const label = el("span", "play-hold-label", "按住桥绳");
      press.append(meter, label);
      const alternate = el("button", "play-hold-tap", "分两次点按过桥");
      alternate.type = "button";
      let startAt = null;
      let frame = 0;
      let tapped = false;
      const wait = 680;

      function stop() {
        cancelAnimationFrame(frame);
        frame = 0;
        startAt = null;
      }
      cancelHold = stop;

      function tick() {
        if (startAt === null) return;
        const fraction = Math.min(1, (performance.now() - startAt) / wait);
        meter.style.transform = "scaleX(" + fraction + ")";
        if (fraction >= 1) {
          label.textContent = tapped ? "桥稳了" : "桥稳了，松手！";
          note.textContent = tapped ? "再点一下「松开桥绳」，走到对岸。" : "此时松手，走到对岸。";
          if (tapped) alternate.textContent = "松开桥绳";
        } else {
          frame = requestAnimationFrame(tick);
        }
      }
      function start() {
        if (startAt !== null) return;
        startAt = performance.now();
        label.textContent = "抓紧……";
        note.textContent = "脚下的木板晃动，等它摆回来。";
        tick();
      }
      function release() {
        if (startAt === null) return;
        const ready = performance.now() - startAt >= wait;
        stop();
        if (ready) {
          taskData.ready = true;
          taskData.message = "";
          update();
        } else {
          meter.style.transform = "scaleX(0)";
          label.textContent = "按住桥绳";
          alternate.textContent = "分两次点按过桥";
          note.textContent = "桥还在晃。再抓一次，等木板摆正。";
          tapped = false;
        }
      }
      press.addEventListener("pointerdown", event => {
        if (!event.isPrimary || event.button !== 0 || tapped) return;
        press.setPointerCapture?.(event.pointerId);
        start();
      });
      press.addEventListener("pointerup", () => { if (!tapped) release(); });
      press.addEventListener("pointercancel", () => {
        stop(); label.textContent = "按住桥绳"; meter.style.transform = "scaleX(0)";
      });
      press.addEventListener("keydown", event => {
        if (tapped || (event.key !== " " && event.key !== "Enter")) return;
        event.preventDefault();
        if (!event.repeat) start();
      });
      press.addEventListener("keyup", event => {
        if (tapped || (event.key !== " " && event.key !== "Enter")) return;
        event.preventDefault(); release();
      });
      alternate.addEventListener("click", () => {
        if (tapped) return release();
        tapped = true; alternate.textContent = "等桥稳后松手"; start();
      });
      holdBox.append(press, alternate);
      actionArea.append(holdBox);
    }

    function refresh() {
      const active = actionArea.contains(document.activeElement) ? document.activeElement.dataset.control : "";
      actionArea.replaceChildren();
      footer.replaceChildren();
      if (task.type === "hold") hold();
      else if (task.type === "match") match();
      else if (task.type === "order") order();
      else browseItems();
      const done = taskComplete(task, taskData);
      note.textContent = taskData.message || "";
      if (done) {
        const outcome = compose(task.success);
        if (outcome) footer.append(el("p", "play-task-success", outcome));
        footer.append(primary(scene.next === "@ending" ? "收卷看结局" : "继续", () => go(compose(scene.next))));
      }
      if (active) {
        const controls = [...actionArea.querySelectorAll("[data-control]")];
        const next = controls.find(n => n.dataset.control === active && !n.disabled);
        (next || (done ? footer.querySelector("button") : controls.find(n => !n.disabled)))?.focus({preventScroll:true});
      }
    }
    refresh();
  }

  window.PalaceGame = Object.freeze({fresh, resume, pause, snapshot, restartChapter,
    hasSave: () => { read(); return !!state; }
  });
})();
