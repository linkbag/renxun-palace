(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const story = window.PALACE_STORY;
  const game = window.PalaceGame;
  const chapterNumbers = [...'一二三四五六七八九'];
  const portraits = ['黄仁薰', '洛璃', '艾梨丝', '珂莱特', '乔恩思', '唐普帝', '马思克', '奥尔特满', '苏姿枫', '达礼奥', '帘后诸席', '万思', '槿秋', '碧禾', '朱小满', '安绫音', '守门人'];
  window.palaceArt = number => number ? `assets/chapter-${number}.webp` : 'assets/cover.webp';
  window.palacePortrait = name => portraits.includes(name) ? `assets/cast-${portraits.indexOf(name) + 1}.webp` : null;
  const dialog = byId('folio');
  const body = byId('folio-body');
  const rail = byId('chapter-rail');
  const stage = byId('play-screen');
  let lastScene = '';
  let soundOn = false;
  let audio = null;
  let returnFocus = null;
  let scrollPending = false;
  const effectKey = 'renxun-palace.sound.v1';
  try { soundOn = localStorage.getItem(effectKey) === 'on'; } catch { /* Sound can still be toggled within a visit. */ }
  window.palaceSoundEnabled = () => soundOn;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function button(text, className, action) {
    const node = element('button', className, text);
    node.type = 'button';
    node.addEventListener('click', action);
    return node;
  }

  function picture(url, className, alt = '') {
    const img = element('img', className);
    img.src = url;
    img.alt = alt;
    return img;
  }

  function act(n) { return '第' + chapterNumbers[n - 1] + '折'; }

  async function chime(chord = false) {
    if (!soundOn) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      if (!audio) audio = new Audio();
      if (audio.state === 'suspended') await audio.resume();
      if (!soundOn) return;
      const now = audio.currentTime;
      const notes = chord ? [293.66, 440, 587.33] : [440];
      notes.forEach((hz, i) => {
        const carrier = audio.createOscillator();
        const gain = audio.createGain();
        const start = now + i * .085;
        const tail = chord ? .58 : .25;
        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(hz * 1.006, start);
        carrier.frequency.exponentialRampToValueAtTime(hz, start + .075);
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.exponentialRampToValueAtTime(chord ? .06 : .033, start + .012);
        gain.gain.exponentialRampToValueAtTime(.0001, start + tail);
        carrier.connect(gain).connect(audio.destination);
        carrier.onended = () => { carrier.disconnect(); gain.disconnect(); };
        carrier.start(start);
        carrier.stop(start + tail + .025);
      });
    } catch { /* Silent mode remains playable when the browser blocks audio. */ }
  }

  function paintSoundButton() {
    const control = byId('sound');
    control.setAttribute('aria-pressed', String(soundOn));
    control.setAttribute('aria-label', soundOn ? '关闭声效' : '开启声效');
    control.querySelector('span').textContent = soundOn ? '声效开' : '声效关';
    control.querySelector('use').setAttribute('href', soundOn ? '#i-sound' : '#i-muted');
    window.dispatchEvent(new CustomEvent('palace:soundstate', {detail:soundOn}));
  }

  function toggleSound() {
    soundOn = !soundOn;
    try { localStorage.setItem(effectKey, soundOn ? 'on' : 'off'); } catch { /* Session-only preference. */ }
    paintSoundButton();
    if (soundOn) chime(true);
  }

  function openFolio(title) {
    if (!dialog.open) returnFocus = document.activeElement;
    byId('folio-title').textContent = title;
    body.replaceChildren();
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    byId('folio-close').focus({preventScroll:true});
  }

  function closeFolio() { if (dialog.open) dialog.close(); }

  function goOnStage(action) {
    returnFocus = null;
    closeFolio();
    byId('home-screen').hidden = true;
    stage.hidden = false;
    document.body.classList.add('stage-mode');
    action();
    window.scrollTo({top:0, behavior:'instant'});
  }

  function runFromSave() { goOnStage(() => game.hasSave() ? game.resume() : game.fresh()); }

  function setHomeNav(dest) {
    document.querySelectorAll('.main-nav [data-nav]').forEach(node => {
      const active = node.dataset.nav === dest;
      node.classList.toggle('current', active);
      if (active) node.setAttribute('aria-current','location');
      else node.removeAttribute('aria-current');
    });
  }

  function home(scroll = true) {
    closeFolio();
    stage.hidden = true;
    byId('home-screen').hidden = false;
    document.body.classList.remove('stage-mode');
    setHomeNav('home');
    updateSave();
    if (scroll) {
      window.scrollTo({top:0, behavior:'instant'});
      byId('begin').focus({preventScroll:true});
    }
    requestAnimationFrame(updateRail);
  }

  function updateSave() {
    const save = game.snapshot();
    byId('begin').querySelector('span').textContent = save?.completed ? '重温结局' : save ? '接着上回' : '入宫开戏';
    byId('save-caption').textContent = save?.completed ? '本轮已落幕' : save ? '已存至' + (save.chapter ? act(save.chapter) : '序幕') : '自动存档';
  }

  function makeCard(chapter, index) {
    const n = index + 1;
    const card = button('', 'chapter-card', () => chapterFolio(n));
    card.setAttribute('aria-label', act(n) + '，' + chapter.title + '，查看戏目');
    const art = element('span', 'card-art');
    const thumbnail = picture(window.palaceArt(n));
    thumbnail.loading = n < 5 ? 'eager' : 'lazy';
    art.append(thumbnail, element('span', 'act-tag', act(n)));
    const copy = element('span','card-content');
    copy.append(element('strong','card-title',chapter.title),element('span','card-place',chapter.place));
    card.append(art,copy);
    return card;
  }

  function updateRail() {
    scrollPending = false;
    if (!rail.clientWidth || !rail.children.length) return;
    const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
    const first = Math.round(rail.scrollLeft / step) + 1;
    byId('rail-count').replaceChildren(document.createTextNode(String(first).padStart(2,'0') + ' '),element('i','','/ 09'));
    byId('prev-card').disabled = rail.scrollLeft < 2;
    byId('next-card').disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 3;
  }

  function moveRail(direction) {
    const step = rail.children[1].offsetLeft - rail.children[0].offsetLeft;
    const count = Math.max(1, Math.floor((rail.clientWidth + 3) / step));
    rail.scrollBy({left:direction * count * step, behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  }

  function confirmReplay(n) {
    const save = game.snapshot();
    openFolio(n ? '重演' + act(n) : '从宫门重新开戏');
    body.append(element('p','',n ? '这一折会从原先入场时的信物开始。往后的选择会写进当前存档。' : '这会以一张空白访客签开启新一局，并替换这台设备上的本轮进度。'));
    if (save) body.append(element('p','ctx','当前存档 · ' + (save.completed ? '本轮已落幕' : save.chapter ? act(save.chapter) : '序幕')));
    const actions = element('div','folio-actions');
    actions.append(button(n ? '从本折开演' : '重新开戏','btn btn-vermilion',() => goOnStage(() => n ? game.restartChapter(n) : game.fresh())),button('保留当前进度','btn btn-paper',closeFolio));
    body.append(actions);
  }

  function chapterFolio(n) {
    const c = story.chapters[n-1];
    const save = game.snapshot();
    openFolio(c.title);
    body.append(picture(window.palaceArt(n),'folio-visual'),element('div','folio-kicker',act(n) + '　／　' + c.place),element('h3','',c.role + ' · ' + c.date),element('p','',c.intro));
    const actions = element('div','folio-actions');
    if (save?.checkpoints?.[n]) {
      if (save.chapter === n && !save.completed) actions.append(button('接着上回','btn btn-vermilion',runFromSave));
      actions.append(button('从本折重演',actions.children.length ? 'btn btn-paper' : 'btn btn-vermilion',() => confirmReplay(n)));
    } else {
      body.append(element('p','ctx',n === 1 ? '从宫门的序幕填签入场。' : '按戏目顺序开演，走到这一折即可回看。'));
      actions.append(button(save ? '接着上回' : '从序幕开演','btn btn-vermilion',runFromSave));
    }
    actions.append(button('全剧戏目','btn btn-paper',chapterIndex));
    body.append(actions);
  }

  function chapterIndex() {
    openFolio('九折戏目');
    const save = game.snapshot();
    const grid = element('div','chapter-index');
    story.chapters.forEach((c,i) => {
      const n = i+1;
      const row = button('','chapter-entry',() => chapterFolio(n));
      const copy = element('span');
      copy.append(element('small','',act(n) + ' · ' + (save?.checkpoints?.[n] ? '可重演' : '戏目预览')),element('strong','',c.title));
      row.append(picture(window.palaceArt(n)),copy);
      grid.append(row);
    });
    body.append(grid);
    if (save) {
      const actions = element('div','folio-actions');
      actions.append(button('从序幕重新开戏','btn btn-paper',() => confirmReplay(0)));
      body.append(actions);
    }
  }

  function castBook() {
    openFolio('人物簿');
    const grid = element('div','cast-grid');
    story.cast.forEach(person => {
      const cell = button('','cast-cell',() => castProfile(person.name));
      const url = window.palacePortrait(person.name);
      cell.append(url ? picture(url,'cast-portrait') : element('span','cast-seal',person.mark));
      const copy = element('span');
      copy.append(element('strong','',person.name),element('small','',person.role));
      cell.append(copy);
      grid.append(cell);
    });
    body.append(grid);
  }

  function castProfile(name) {
    const person = story.cast.find(c => c.name === name);
    if (!person) return castBook();
    openFolio(person.name);
    const panel = element('div','cast-profile');
    const url = window.palacePortrait(person.name);
    if (url) panel.append(picture(url,'',person.name + '的戏中立绘'));
    const profile = element('div');
    profile.append(element('h3','',person.role),element('p','',person.detail));
    const real = element('details','prototype');
    real.append(element('summary','','人物原型与借戏'),element('p','',person.prototype));
    profile.append(real);
    panel.append(profile);
    const actions = element('div','folio-actions');
    actions.append(button('返回人物簿','btn btn-paper',castBook));
    body.append(panel,actions);
  }

  function notes() {
    openFolio('片尾与取材');
    body.append(element('h3','','《后宫仁薰传 · 十一日回宫》'),element('p','','一出免费的非官方互动短剧。时间线取材截至 2026 年 11 月 24 日。宫门、家书、验单及人物对白均为戏拟创作。官宣复位之后，独立调查仍在进行。'),element('p','notes-copy','美术使用 AI 辅助创作。讲席戏词由安绫音以普通话合成声代读，提示音由浏览器合成。题字采用马善政楷书，戏目与对白采用 Noto Serif SC，两款字体均依 SIL Open Font License 使用。'),element('hr','folio-divider'),element('h3','','戏外资料'));
    const list = element('ol','source-list');
    story.sources.forEach(source => {
      const li = element('li');
      const link = element('a','',source.title);
      link.href = source.url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      li.append(link,element('small','',source.note));
      list.append(li);
    });
    body.append(list);
  }

  byId('begin').addEventListener('click',runFromSave);
  byId('brand').addEventListener('click',() => home());
  byId('sound').addEventListener('click',toggleSound);
  byId('hero-cast').addEventListener('click',castBook);
  byId('notes').addEventListener('click',notes);
  byId('prev-card').addEventListener('click',() => moveRail(-1));
  byId('next-card').addEventListener('click',() => moveRail(1));
  byId('folio-close').addEventListener('click',closeFolio);
  dialog.addEventListener('click',event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) closeFolio();
  });
  dialog.addEventListener('close',() => {
    if (returnFocus?.isConnected && returnFocus.getClientRects().length) returnFocus.focus({preventScroll:true});
    returnFocus = null;
  });
  document.querySelector('[data-nav="home"]').addEventListener('click',() => home());
  document.querySelector('[data-nav="cast"]').addEventListener('click',castBook);
  document.querySelector('[data-nav="chapters"]').addEventListener('click',chapterIndex);
  rail.append(...story.chapters.map(makeCard));
  rail.addEventListener('scroll',() => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateRail); } },{passive:true});
  window.addEventListener('resize',updateRail);
  window.addEventListener('palace:home',() => home());
  window.addEventListener('palace:chapters',chapterIndex);
  window.addEventListener('palace:cast',e => castProfile(e.detail));
  window.addEventListener('palace:notes',notes);
  window.addEventListener('palace:sound',toggleSound);
  window.addEventListener('palace:change',e => {
    const s = e.detail;
    if (!stage.hidden && s.scene !== lastScene) chime(s.completed || story.chapters.some(c => c.start === s.scene));
    lastScene = s.scene;
  });
  paintSoundButton();
  updateSave();
  updateRail();
})();
