/* 宫门上的签只写一个事由。等戏散了，才知道是谁替它写背面。 */
(() => {
  'use strict';

  const chapters = [
    { title: '谁在摇我的桥', short: '桥上少年', start: 'bridge', place: '山间吊桥', role: '少年仁薰', date: '少年至创炉年间', art: 1, intro: '一座摇晃的桥，一张接反的图，一桌只点了三份的早点。' },
    { title: '旧袍盖不住新折子', short: '旧袍新折', start: 'robe', place: '庆功殿', role: '黄仁薰', date: '十月廿九至十一月初八', art: 2, intro: '满殿都认得薰妃的庆功袍，只有洛璃认得信末那个字。' },
    { title: '薰妃，三印请交齐', short: '三印离宫', start: 'nightgate', place: '交印房', role: '仁薰与珂莱特', date: '十一月十一至十二', art: 3, intro: '一把钥匙能带出宫，一炉明早交的货可带不走。' },
    { title: '太医，保哪一胎', short: '听炉问脉', start: 'pulse', place: '青炉夜坊', role: '珂莱特', date: '十一月十二至十六', art: 4, intro: '太医赶到，贵妃的椅子摸不出脉，炉壁里倒有动静。' },
    { title: '本宫没有宣布复位', short: '三折同日', start: 'accounts', place: '账房讲席', role: '珂莱特', date: '十一月十七', art: 5, intro: '愿归的、数钱的、管椅子的，偏都挑了同一天开口。' },
    { title: '谁把一句谢谢剪成拥立', short: '四家讲席', start: 'forum', place: '纽城时报', role: '黄仁薰', date: '十一月十八至十九', art: 6, intro: '四张名签上了同一个标题，有人连请愿纸都没摸过。' },
    { title: '甘露庵等到半句话', short: '甘露听旨', start: 'abbey', place: '甘露庵', role: '黄仁薰', date: '照海宴前后至十一月二十', art: 7, intro: '三次开金口，一辆末班车，车上空着的位子只够一封信。' },
    { title: '长案会，把自己的话翻过来', short: '长案翻卷', start: 'vote', place: '长案会', role: '乔恩思', date: '十一月廿二至廿三', art: 8, intro: '乔恩思坐上首席，把自己五天前说的话端正地摆在案中间。' },
    { title: '滴墨验单', short: '滴墨验单', start: 'trial', place: '长案堂', role: '验单席', date: '复位当晚 · 虚构堂审', art: 9, intro: '两张单子一样红。照这套断法，掌炉人还欠面馆六碗汤。' }
  ];

  const scenes = {};
  function add(id, chapter, place, speaker, text, options) {
    scenes[id] = { chapter, place, speaker, text, art: chapter, ...options };
  }
  const choice = (label, to, set, reply, speaker) => ({ label, to, set, reply, speaker });
  const item = (id, label, detail, target) => ({ id, label, detail, target });

  add('gate', 0, '青炉局 · 宫门', '守门人', '恭迎薰妃回宫。劳驾，往右，访客那队。', {
    stage: '锣鼓敲得震天响。守门人行了个大礼，用脚踩平门口那块松木板。',
    next: 'mygate'
  });
  add('mygate', 0, '青炉局 · 宫门', '黄仁薰', '这门还是我画的。', {
    stage: '他指了指门楣。右下角那个歪歪扭扭的小钩，还是当年的笔迹。',
    next: 'visitorslip'
  });
  add('visitorslip', 0, '青炉局 · 门房', '守门人', '认得您的笔迹。尤其是「来访事由，必须填写」这八个字。', {
    stage: '来访者姓名已填。纸签往前一送，空着最后一栏。',
    choices: [
      choice('上工', 'bridge', { pass: 'work' }, '早班记在簿上。您这一趟迟了十一天，先算出勤。', '守门人'),
      choice('讨说法', 'bridge', { pass: 'answers' }, '一张签想讨两天的说法？且留着背面，我给您找地方夹。', '守门人'),
      choice('取饭盒', 'bridge', { pass: 'lunch' }, '那个凹了角的？门房认得盒，人归不归我管，可不好说。', '守门人')
    ]
  });

  add('bridge', 1, '山间吊桥 · 多年前', '旁白', '脚下木板一晃，宫门忽然远了。九岁的仁薰背着书包，站在一座摇摇欲坠的吊桥上。对岸几个孩子正攥着桥绳等他。', {
    stage: '肯州山间。书包侧袋里滚出半截铅笔。',
    task: { type: 'hold', prompt: '握紧桥绳，等桥身稳住。', items: [item('rope', '抓紧桥绳')], success: '桥身摆回来。他腾出一只手，捞住铅笔，走完了剩下的几步。' },
    next: 'lab'
  });
  add('lab', 1, '电机学堂 · 实验台', '洛璃', '你要替我接线？好。你先看清楚，红线是谁画到负极上去的。', {
    stage: '多年后。蓝铅笔轻轻一圈，圈在仁薰自己的名字旁边。',
    choices: [
      choice('请洛璃也署名', 'breakfast', { blueprint: 'signed' }, '改图的人也有名字。洛璃拿蓝笔在他旁边写下两个字，墨线干了才把纸折好。', '旁白'),
      choice('把背面留作草图', 'breakfast', { blueprint: 'sketch' }, '洛璃把纸翻过来，画下两人各自接的那半条线。折过两回，线头还对得上。', '旁白')
    ]
  });
  add('breakfast', 1, '早点铺 · 临窗桌', '黄仁薰', '三个碟子往旁边挪挪。要是我们凑得出第一座算炉，往后这顿，我请。', {
    stage: '两个伙计让出桌面。洛璃收好旧图，柜上那张三份早点的账单一直没扔。',
    next: 'medal'
  });
  add('medal', 1, '庆功殿 · 三十三年后', '唐普帝', '给创炉人别上功牌。扣紧些，今儿满朝都要瞧。', {
    stage: '戏班唱到「薰妃受赏」，满殿喝彩。槿秋捡起别人塞进戏单的一张小像，背面的年月比功牌早得多。',
    next: 'robe'
  });

  add('robe', 2, '庆功殿 · 廊下', '碧禾', '他们把小像登得这么大，把底下一行裁得这么干净。那行是谁画的，您还记得么？', {
    stage: '记者把新炉图推到一边。仁薰拢紧旧袍，内衬的金线绣着上一季的股价。碧禾让碎纸从袖中滑出来。',
    task: {
      type: 'order', prompt: '按「画中人、场合、署名」拼回三截图注。',
      items: [item('faces', '仁薰与艾梨丝'), item('occasion', '旧席同框小像'), item('credit', '绘者 · 碧禾')],
      success: '三截纸一齐贴回去，小像终于有了绘者。旁边那份货单的签收栏，画上看不见。'
    },
    next: 'admit'
  });
  add('admit', 2, '庆功殿 · 阶前', '黄仁薰', '我跟艾梨丝有过婚外情。这件事我认。给同僚的道歉，我也自己署名。', {
    stage: '纽城时报换了一支笔。有人又递上商行的货单，槿秋接下来，另装进一卷。',
    next: 'letter'
  });
  add('letter', 2, '黄宅 · 书桌', '洛璃', '你写错的线，我能替你改。写给我的这封信，你自己来。', {
    stage: '阿禾收起旧作业，阿穗把饭盒带出屋。桌上的信纸预留了两个落款。',
    choices: [
      choice('另封家信，只落自己的款', 'nightgate', { family: true }, '我会读。今晚别问我读到哪儿。', '洛璃'),
      choice('将联署的信递给洛璃', 'nightgate', { jointLetter: true }, '你道歉，怎么还要我签字？', '洛璃')
    ]
  });

  add('nightgate', 3, '交印房 · 夜门', '朱小满', '他们说过了落闩时辰，外人进不得。我拿自己的夜行牌给他，换这本簿子进来。人能在外头睡，交接簿不能。', {
    stage: '小满把簿子从门底推进来，打了个哈欠。帘后的椅子一把把摆开。',
    next: 'threeSeals'
  });
  add('threeSeals', 3, '交印房 · 长案', '乔恩思', '请薰妃交三印。总办、掌炉、议席，各有去处。少一枚，明早三道公文就得喊您回来重盖。', {
    stage: '十一日议决，十二日对外张榜。仁薰把袖口卷起来。',
    task: {
      type: 'collect', prompt: '从案头收齐三印，逐一交还。',
      items: [item('president', '总办印', '诰令与日常公文，收入总办匣。'), item('ceo', '掌炉印', '珂莱特接过临时掌炉印。'), item('board', '议席印', '旧席暂空。乔恩思首次入座议长席。')],
      success: '三只印匣落扣。珂莱特一手拿临印，一手还攥着原来的账印。'
    },
    next: 'handoff'
  });
  add('handoff', 3, '交印房 · 落闩前', '珂莱特', '门马上落闩。交接簿还有一行要签，全坊也都等您一句话。您先把手给哪边？', {
    choices: [
      choice('先签交接，把副钥交给夜班', 'oldPass', { key: true, handoff: true }, '钥匙收讫。往后夜班开炉，先敲我的钟。', '珂莱特'),
      choice('先给全坊留一句口信', 'oldPass', { voice: true }, '今夜炉壁要凉，大家再候一候。亏欠各位的，我回头亲口讲。', '黄仁薰')
    ]
  });
  add('oldPass', 3, '宫门 · 外侧', '守门人', '牙牌认得您。您再往下看一行。', {
    stage: '仁薰把旧牙牌往门上一贴。机括响了一声，吐出一张崭新的空白访客签。墙根的小满已经睡着了。',
    next: 'pulse'
  });

  add('pulse', 4, '青炉夜坊 · 值房', '珂莱特', '太医请来了，脉枕也有了。谁先告诉我，这一殿人究竟要我保哪一胎？', {
    stage: state => state.flags.voice ? '熟悉的口信在坊内响起。一个工友听出薰妃的声音，跑去喊住最后一个要走的师傅。' : '夜班师傅拿副钥开了炉门。外边八百里催件，上面只四个大字「快请保胎」。',
    choices: [
      choice('给薰妃的空椅号脉', 'pulse', {}, '椅背冰凉。太医等了半晌，给椅子开了一剂「少坐多动」。', '旁白'),
      choice('把听筒贴到炉壁上', 'dispatch', {}, '听见了？下一炉，明早交。', '珂莱特')
    ]
  });
  add('dispatch', 4, '青炉夜坊 · 排班案', '朱小满', '炉班等钥匙，百一灯楼的信箱也满了。娘娘，您有几双手？', {
    stage: '纸市急报滚下台阶。有的算票跌，隔壁一埠反倒一度涨了。先跑来报丧的又折回去捡漏下的那张。',
    choices: [
      choice('先排夜班，把副钥交到手', 'lantern', { key: true, roster: true }, state => state.flags.handoff ? '钥匙上折已交。小满盖过排班簿，还有空把灯楼署名也抄全了。' : '珂莱特新配副钥。夜班自己开了炉，小满抱着空下来的夜牌回家补觉。', '旁白'),
      choice('先打开灯楼的信箱', 'lantern', { lamps: true }, state => state.flags.handoff ? '夜班早有钥匙。小满把班排好，跟你一起念完了每张捐灯人的名签。' : '灯楼信箱一开，尽是炉户的亲笔名签。炉门还得等那位带正钥的人来开。', '旁白')
    ]
  });
  add('lantern', 4, '甘露庵 · 临窗', '槿秋', '娘娘，哪一盏有董事票？', {
    stage: state => state.flags.lamps || state.flags.handoff ? '百一灯楼亮起。署名的是出钱的海峡炉户，仁薰趴在窗边把灯数了三遍。' : '远处百一灯楼亮起。仁薰只看见一片光，连谁出的灯钱都还没来得及问。',
    next: 'accounts'
  });

  add('accounts', 5, '账房讲席 · 开门前', '乔恩思', '三个信封同日送到。若拿我的落款去盖他的愿望，我可就亲自在报上登上自己没说过的话了。', {
    stage: '愿归的信、封过的账、长案会的答复摞在一起。珂莱特把印泥挪远了一寸。',
    task: {
      type: 'match', prompt: '把三份文书分送给各自的出件人。',
      items: [item('wish', '愿意回任', '创炉人亲笔。', 'founder'), item('sales', '上季营收翻倍', '封账日早于离任日。', 'ledger'), item('intent', '眼下无意复位', '业绩会上回答人事问题。', 'council')],
      targets: [{ id: 'ledger', label: '青炉账房' }, { id: 'council', label: '长案会' }, { id: 'founder', label: '仁薰' }],
      success: '三张文书归了位。记者手快，已经把明日头版的天窗挖好了。'
    },
    next: 'headline'
  });
  add('headline', 5, '账房讲席 · 前排', '珂莱特', '季度截至十月廿五，营收一千一百五十八亿美元，同比增了一倍还多三分。数得清钱的坐左边，急着数椅子的坐右边。头版谁先说？', {
    choices: [
      choice('先让账房亮封账日', 'ledgerLine', { leadStory: 'sales' }, '《青炉上季营收翻倍》占了头版。旁边另开小栏，照录议长的答复。', '旁白'),
      choice('先登长案会的回话', 'ledgerLine', { leadStory: 'position' }, '《议长称眼下无意复位》先上街。卖报童不得不背第二句，讲清是谁的意思。', '旁白')
    ]
  });
  add('ledgerLine', 5, '账房讲席 · 散席', '珂莱特', '十月的账。您教教我，十一月那把椅子，该往哪一栏填？', {
    stage: '最后一位记者还在向账本打听复位。她合上算盘，把封账日转给他看。',
    next: 'forum'
  });

  add('forum', 6, '纽城时报 · 讲席后场', '安绫音', '四张脸排开，铜锣一响，把「四家拥立」四个字往上一放。您看，哪一张脸像会自己跳下来驳我？', {
    stage: state => state.flags.leadStory === 'sales' ? '昨日头版还在讲营收。今天的字号更大，四个字就占了半幅版。' : '昨日「无意复位」的油墨还没干。今日清样已在隔壁排出四张笑脸。',
    task: {
      type: 'inspect', prompt: '翻开四张名签，听各人究竟肯在哪儿落款。',
      items: [
        item('musk', '马思克 · 驰车侯', '他把请愿册推远，看了看自己的大印。「留一格就够。我签大点。」'),
        item('altman', '奥尔特满 · 开言馆', '他抽出一封谢帖。「当年我的门要关，是他来撑的。我感念他。今儿该谁掌炉，我知道的还不够。」'),
        item('dario', '达礼奥 · 司天馆', '桌上两张纸，只有一张盖了章。「算芯那张我签过了。掌炉人的那张，劳驾送回长案会。」'),
        item('su', '苏姿枫 · 绯炉', '此前访谈的留影。她一壶茶分作两盏，「一盏敬创炉，一盏敬守炉。喝完我还得回去催自家的货。」')
      ],
      success: '请愿、谢帖、订单、两盏茶。一张版上，原来装了四种意思。'
    },
    next: 'print'
  });
  add('print', 6, '纽城时报 · 刻字房', '安绫音', '门口的报童等着喊。咱们给四个人留够说话的地方，还是赌一声全城都响的喝彩？', {
    stage: '整版底页背面，恰有南汀行货单的影印。若把版心裁窄，签收一栏就要跟着断开。',
    choices: [
      choice('留整版，收好原话与底页', 'thanks', { draft: true, fullPage: true }, '刻字工退掉半版大字，四张名签各归各位。安绫音把完整货单连底页一起交给你。', '旁白'),
      choice('先上大标题「四家拥立」', 'thanks', { bigHeadline: true }, '百一灯楼当即喝彩。报童连喊六遍，到第七遍时，有个拿谢帖的挤进来了。', '旁白')
    ]
  });
  add('thanks', 6, '纽城时报 · 散场', '奥尔特满', '我来道个谢，怎么出门就成了从龙之臣？', {
    stage: state => state.flags.fullPage ? '奥尔特满端详作废的大字清样。见整页已重排，他把那张谢帖仔仔细细抚平。' : '奥尔特满把刚买的报纸翻到正面。边角裁得太齐，他拿指甲点着那四个大字。',
    next: 'abbey'
  });

  add('abbey', 7, '甘露庵 · 偏门', '槿秋', '我跟万思讨来一刻钟，您自己进去。他肯传一句话，您可别替他再添半句。', {
    stage: '偏门留下一条缝。槿秋按住将要落地的门环，留在门外掐着点。',
    next: 'words'
  });
  add('words', 7, '甘露庵 · 传话廊', '万思', '南草坪、照海宴、回銮后，各是各的一句。末一句里有「盼」字，别剪着了。', {
    task: {
      type: 'order', prompt: '照启程、会期、返程的次序排好口风。',
      items: [item('before', '出访前 · 回任无妨'), item('during', '席间 · 只略略提过'), item('after', '返程后 · 盼他道歉回去')],
      success: '启程时不介意，问起席间说只略提，返程后盼他道歉回去。三张签上只有外朝的款。'
    },
    next: 'doorOrder'
  });
  add('doorOrder', 7, '甘露庵 · 传话廊', '黄仁薰', '念到第三句，总能推推宫门了吧？', {
    choices: [
      choice('将三张纸合做一道任命', 'mailCoach', {}, '门认得三张纸上同一个人的字。敢问长案会的落款，您藏在哪一张背后了？', '守门人'),
      choice('将三次口风各记一笔', 'mailCoach', {}, '抄本三份，另留一格，等门里有权开门的人自己填。', '槿秋')
    ]
  });
  add('mailCoach', 7, '甘露庵 · 夜驿', '驿丞', '车上最后一个位置。家书还是底页，请选一样。替第二样腾地方？行啊，您去劝那匹马少带一条腿。', {
    stage: state => state.flags.family && state.flags.draft ? '家笺、底稿都已送达。这一趟再送一份，可多得一张盖着驿印的回执。' : '家书投黄宅，底页送长案堂。最后一辆驿车的车夫抖了抖缰绳。',
    choices: [
      choice('把驿位留给亲笔家信', 'receipt', { family: true, mail: 'family' }, '封口只有自己的名字。车轮声响，家书进了黄宅的门。', '旁白'),
      choice('把驿位留给整版底页', 'receipt', { draft: true, mail: 'draft' }, '整张清样重新誊印。边角那格签收栏也在，一笔不添，一寸不裁。', '旁白')
    ]
  });
  add('receipt', 7, '甘露庵 · 夜驿', '黄仁薰', '我等到更鼓都敲哑了，就这四个字？', {
    stage: state => (state.flags.mail === 'family' ? '给黄宅的回执' : '给长案堂的回执') + '上写着「包裹已收」。纸市报算股大盘一周跌去一成。卖饼人翻过行情纸，把刚出炉的饼仔细包好。',
    next: 'vote'
  });

  add('vote', 8, '长案会 · 首席', '乔恩思', '五天前，在这张案上，我说眼下无意复位。把日期留在前面。今天改主意的人，也得坐在同一把椅子上签。', {
    stage: '你坐到首席。帘后圆桌上，各席看过外朝递来的意见，一一投下票。乔恩思把旧批复压在掌下。',
    choices: [
      choice('翻过旧批复，保留原日期', 'voteSeal', {}, '旧纸背面，十一月廿二日的新议决开了头。两次落款相隔五天。', '旁白'),
      choice('把旧批复另装一封并列归档', 'voteSeal', {}, '书吏留出两个日期格。旧话与新议决各有封口，两份都得经得起翻。', '旁白')
    ]
  });
  add('voteSeal', 8, '长案会 · 宫闸', '守门人', '灯牌、口谕、请愿簿，都听见响了。您说，让这三方印归位，门上的锁究竟认哪一样？', {
    choices: [
      choice('呈上百一灯牌', 'voteSeal', {}, '够亮，够热闹。夜里看门很合用，票数还是零。', '守门人'),
      choice('呈上唐普帝的口风', 'voteSeal', {}, '外朝确实递过意见。门闩还等着本局的落款。', '守门人'),
      choice('呈上驰车侯的请愿簿', 'voteSeal', {}, '嗬，这一个名字盖得比门锁还大！等里面的诸席签齐再来。', '守门人'),
      choice('递交长案会的一致议决书', 'returned', {}, '廿二日议决，廿三日公告。总办、掌炉、议席三印一齐交还。宫门开。', '守门人')
    ]
  });
  add('returned', 8, '青炉局 · 正殿', '珂莱特', '临印交还。账印我自个儿带着，夜里谁再请我算一遍掌炉人的座次，照加班算。', {
    stage: '仁薰重掌三印，乔恩思仍坐首席。唐普帝说曾亲自递话，长案会把议决书落了款。收市时，青炉算票一日涨逾三成。',
    next: 'worker'
  });
  add('worker', 8, '正殿 · 后排', '旁白', state => state.flags.key ? '夜班自己点得着炉。那位工师赶上了末席，他摊开攥热了的纸条，当着掌炉人的面念出第一行。「下回，谁敢当面拦掌炉人？」' : '工师在炉边走不开。他把写着「下回谁敢当面拦掌炉人」的纸条折小了，压在交接簿底下。堂上最后一个空位一直留着。', {
    stage: '前排的锣一面接一面地响。后排的凳子少摆了一把。',
    choices: [
      choice('跟着三方印回殿', 'summons'),
      choice('留下，听完两台的追问', 'questions')
    ]
  });
  add('questions', 8, '正殿 · 问事廊', '槿秋', '您回来掌炉，外头倒一下多了三份问件。一个问人，一个问规矩，另一个问来问去只问到了三个字。', {
    stage: '书吏拨开贺喜帖子，将两道当日问件和一张先前的剪报摆在旁边。',
    task: {
      type: 'inspect', prompt: '翻开问件，看各处究竟答过什么。',
      items: [
        item('red', '朱台 · 续问帖', '三位督办请掌炉人照约来做笔录。戏班唱「圣意盼归」，他们问自己的问题。'),
        item('blue', '靛台 · 货禁折', '一位议员请两边一道修订货禁规矩。折子开头讲的是货怎么管，落款上并没有任命谁。'),
        item('east', '东埠 · 旧剪报', '此前有人追问艾梨丝身在何处，问事厅答「不了解」。三个字说完，下面没有第四个。')
      ],
      success: '三份都夹入备询册。外边锣声正响，里边书吏的笔也还没搁下。'
    },
    next: 'summons'
  });
  add('summons', 8, '青炉局 · 正殿', '黄仁薰', '这个也得我签收？', {
    stage: '仁薰把「访客」翻成「掌炉」，背面却粘着候问帖。案头人事卷已经封口，旁边的货案仍摊着。',
    next: 'trial'
  });

  add('trial', 9, '长案堂 · 验单席', '乔恩思', '她账上一枚，你账上一枚，连红色都一样。收货人，我可填她了？', {
    stage: '虚构演练。两张新盖的单子分开，红泥还黏着丝。仁薰坐在对面，回宫袍熨得笔挺，胸前还别着那张访客签。',
    next: 'soup'
  });
  add('soup', 9, '长案堂 · 验单席', '黄仁薰', '且慢。我的任命书也是这个红。照您这么记，我还欠隔壁面馆六碗汤。', {
    choices: [
      choice('当堂结案', 'soup', {}, '大印啪地盖下去，偏偏压中面馆的账单。老板伸手来收钱，乔恩思默默把印拔起来。', '旁白'),
      choice('请面馆先上样单', 'noodle', {}, '面馆老板把豆腐票递进来。票还有些烫，纸角一星葱花。', '旁白'),
      choice('请艾梨丝自己开账', 'alice', { aliceFirst: true }, '镜头移到南汀行。艾梨丝把压在账上的小像推到一旁，给你让出一只手的位置。', '旁白')
    ]
  });
  add('alice', 9, '南汀行 · 旧柜台', '艾梨丝', '我做过掌柜，卸任那行也请念全。要问这批货，翻背面。收货的是谁？', {
    stage: '你替艾梨丝翻开这一摞纸。卸任记录与货物签收各在一张。',
    task: {
      type: 'inspect', prompt: '移开小像，分别检查卸任记录与签收栏。',
      items: [item('resignation', '掌柜卸任记录', '这行写她曾任掌柜，旁边另有卸任记录。'), item('recipient', '货物签收栏', '书吏把纸举到灯下。「……这一格空着。」')],
      success: '两张纸摊开了。私人关系、人事身份与这一张单子的收货人，要各找各的凭证。'
    },
    next: 'ink'
  });
  add('noodle', 9, '长案堂 · 面馆样单', '面馆老板', '豆腐是早市进的货，印泥是街对面买的。你们说这红能认亲，我整间铺子岂不全是皇亲？', {
    stage: '旁边的书吏掀开商行单据，掌柜卸任是一张，货物签收是另一张。最后那一格空着。',
    next: 'ink'
  });
  add('ink', 9, '长案堂 · 净纸案', '安绫音', '好一盒认亲的印泥。借我一晚，明儿我也去认个有钱的姨母。', {
    stage: state => state.flags.aliceFirst ? '艾梨丝的原单在手。面馆老板也送来豆腐票，撇净纸面上的葱花，等你复印。' : '面馆的票先到。书吏转来两张商行单，留白的那一栏正对灯芯。',
    task: {
      type: 'collect', prompt: '换净纸，将堂上两单和面馆样单各印一遍。',
      items: [item('one', '商行留底', '第一枚红印。'), item('two', '调阅副单', '第二枚红印。'), item('three', '面馆豆腐票', '第三枚红印，连豆腐也认作一家人了。')],
      success: '三枚印一模一样地红，三张单子的用处却各有不同。'
    },
    next: 'finding'
  });
  add('finding', 9, '长案堂 · 验单席', '书吏', '小的笔尖已经蘸好了。这一行检验所见，该记下哪句话？', {
    choices: [
      choice('三张纸的印泥同色', 'record', {}, '书吏照实写下。隔壁面馆听说保住了六碗汤，端着空托盘回去了。', '旁白'),
      choice('三张纸都是同一人收货', 'finding', {}, '书吏把那一格空白签收栏举得老高，又将笔递了回来。', '旁白')
    ]
  });
  add('record', 9, '长案堂 · 卷柜前', '旁白', state => {
    if (state.flags.draft && state.flags.bigHeadline) return '奥尔特满来讨那半句被剪掉的话。安绫音展开从驿站补来的整页，把谢帖念完。完整的货单影印随卷，签收栏仍为空。';
    if (state.flags.draft) return '安绫音把谢帖一字不漏地念完，连自己差点用了哪四个大字也说了。完整的货单影印随卷，签收栏仍为空。';
    return '奥尔特满来讨那半句被剪掉的话。安绫音翻遍稿夹，缺了底页。碧禾只替亲眼见过的那行图注落款，书吏另开一张补件单。';
  }, {
    stage: '乔恩思把三只匣子一只只打开。朱台送来续问帖，靛台另呈货禁折。两台问卷都留在案上。',
    task: {
      type: 'match', prompt: '把私情、人事与货向，分别归入对应的卷匣。',
      items: [item('private', '堂前已认的私情', '仁薰自己认下的事。', 'acknowledged'), item('office', '长案会人事议决', '三印已经交还。', 'decided'), item('cargo', '南汀行货单', '签收栏尚待查证。', 'open')],
      targets: [{ id: 'open', label: '待查' }, { id: 'acknowledged', label: '已认' }, { id: 'decided', label: '已定' }],
      success: '私情已认。掌炉已定。货向待查。'
    },
    next: 'curtain'
  });
  add('curtain', 9, '长案堂 · 门外', '朱小满', '回宫的戏都散了，这张访客签，您当真不打算翻过来看一眼？', {
    stage: '新贴的货禁告示压住回宫戏单一角。两张候问帖还在，约掌炉人下月初一，局中律官初二。没有人替尚未来到的日子落款。',
    next: '@ending'
  });

  const cast = [
    { mark: '薰', name: '黄仁薰', role: '青炉局创炉人 · 薰妃', prototype: '黄仁勋 × 甄嬛', detail: '早年在山间寄宿，后来在餐馆与两位伙计商议创炉。握得住桥绳，也习惯把钥匙攥在自己手里。戏班喊他薰妃，任免书上写的仍是掌炉。' },
    { mark: '璃', name: '洛璃', role: '电机工师 · 仁薰的夫人', prototype: 'Lori Huang × 沈眉庄', detail: '仁薰实验课的搭档。现实原型在创办公司期间照料家庭，也主持基金会。戏里她有一支蓝笔，肯给自己改过的图署名。至于道歉信上的字，她自己决定。' },
    { mark: '艾', name: '艾梨丝', role: '南汀行前掌柜', prototype: 'Alice Huang × 果郡王允礼', detail: '原型曾任 Megaspeed 高管，媒体报道其与黄的婚外关系。戏里她把卸任记录和货物签收单分别摊开。私人关系、商行所受调查与个人身份分别取证。' },
    { mark: '珂', name: '珂莱特', role: '账房总管 · 临时掌炉', prototype: 'Colette Kress × 敬妃', detail: '账印已经捧了十多年，又接过临时掌炉印。敬妃照看胧月，她照看夜班和明早要交的一炉货。掌炉交回去，她照旧掌账。' },
    { mark: '乔', name: '乔恩思', role: '长案会首任议长', prototype: 'Harvey C. Jones × 皇后宜修', detail: '坐了三十三年长案才当上首席。他既讲过眼下无意复位，又出面迎人回宫，案上的镇纸压得住两张日子不同的批复。' },
    { mark: '议', name: '帘后诸席', role: '长案会 · 共掌任免', prototype: '董事会合议 × 太后', detail: '帘后坐着一圈人，每一席各投一票。人事卷合上，独董调查卷仍摊在案头。' },
    { mark: '唐', name: '唐普帝', role: '外朝天子 · 授功牌', prototype: '唐纳德·特朗普 × 雍正', detail: '能授功牌，也能向长案会递话。出访前说无妨，席间略提，回程后盼人道歉回去。复位后又自述介入沟通，四次开口各有出处。' },
    { mark: '万', name: '万思', role: '外朝副相 · 传话人', prototype: 'J. D. Vance × 苏培盛的传话位置', detail: '外朝与长案会之间的递话人。槿秋向他讨了一刻钟，门和时辰都属戏中虚构。' },
    { mark: '槿', name: '槿秋', role: '薰妃近侍 · 宫规通', prototype: '原创人物 × 崔槿汐', detail: '会给娘娘找门路，也会把「非要给灯数董事票」的娘娘从窗子边领回来。' },
    { mark: '碧', name: '碧禾', role: '宫中绘手', prototype: '原创人物 × 浣碧', detail: '留好小像边角，只想让绘者那一格终于见到自己的名。旁人未见的事情，她不代人落款。' },
    { mark: '朱', name: '朱小满', role: '值夜传簿人', prototype: '原创人物 × 流朱', detail: '用自己的夜牌换交接簿进门，睡在门房墙根。坊里多一把钥匙，她就能少跑几回夜路。' },
    { mark: '绫', name: '安绫音', role: '邸报读稿人', prototype: '原创人物 × 安陵容', detail: '从替人念稿到独自登台，知道半句话能换多少喝彩。给她留够版面，她也能把别人的整句话念完。' },
    { mark: '马', name: '马思克', role: '驰车侯 · 请愿联署人', prototype: 'Elon Musk × 华妃', detail: '鼓比人先到，签名格嫌小。原型曾为黄的回归联署，戏里的请愿大印只盖他自己这一格。' },
    { mark: '奥', name: '奥尔特满', role: '开言馆馆主', prototype: 'Sam Altman × 温实初', detail: '自己也经历过离任、回任。谢的是双方早年的相扶，对于眼前的人事，他说自己掌握的信息有限。' },
    { mark: '达', name: '达礼奥', role: '司天馆掌算', prototype: 'Dario Amodei × 钦天监职能', detail: '与妹妹一道受访，把人事留给青炉局决定。桌上算芯订单和联署册两张纸，他分得清该签哪一张。' },
    { mark: '苏', name: '苏姿枫', role: '绯炉掌柜 · 苏妈', prototype: 'Lisa Su × 端妃', detail: '掌着自家的算炉，与仁薰是远亲。她在此前访谈中都肯定过创炉人与临时接任者，讲席借旧影给两人各斟一盏茶。' },
    { mark: '门', name: '守门人', role: '宫门门房', prototype: '原创人物', detail: '认笔迹，认落款，也认那只凹了角的饭盒。满宫只有他听见「恭迎薰妃」还记得查证件。' }
  ];

  const sources = [
    { title: '本人致员工信 · 11 月 8 日', url: 'https://nvidianews.nvidia.com/news/a-message-to-our-company', note: '公开信承认对妻子不忠，表示配合独立调查。该信未写对方姓名。' },
    { title: '美联社 · 复位经过', url: 'https://apnews.com/article/39d4b34ffaa867b4e669893b5fd5028f', note: '报道私人关系与复职经过。二者与尚待查证的个人身份和货物流向，在游戏中各自归卷。' },
    { title: 'SEC · 离任与临时任命', url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000082/nvda-20261111.htm', note: '11 月 11 日接受辞去三职，12 日对外公布，Kress 兼任临时 CEO，Jones 任董事长。' },
    { title: '季度财报 · 11 月 17 日', url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Third-Quarter-Fiscal-2027/default.aspx', note: '季度截至 10 月 25 日，营收 1,158 亿美元，同比增长 103%。' },
    { title: '业绩会实录 · 11 月 17 日', url: 'https://s201.q4cdn.com/141608511/files/content_files/NVDA-3Q27-Earnings-Transcript.pdf', note: 'Jones 在业绩会上表示，董事会当时无意复位。' },
    { title: '美联社 · 本人表明回任意愿', url: 'https://apnews.com/article/jensen-huang-return-nvidia-0f6d83fc6d97a30fc54bd66b5ac42eda', note: '第五折将此人与董事会、公司财报分作三件文书。' },
    { title: 'SEC · 11 月 22 日回任议决', url: 'https://www.sec.gov/Archives/edgar/data/1045810/000104581026000090/nvda-20261122.htm', note: '恢复总裁、CEO 和董事职务，23 日公告。' },
    { title: '董事会的回任公告', url: 'https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Board-Reinstates-Jensen-Huang-as-President-CEO-and-Board-Director/default.aspx', note: '各席一致同意，并听取政府高层意见。独立调查继续。' },
    { title: '报馆的原报道 · 10 月 29 日', url: 'https://www.nytimes.com/2026/10/29/us/politics/nvidia-china-jensen-huang-trump.html', note: '新闻调查与后来论坛上的行业发言出自不同场合。报馆人物与剪报过程均为虚构。' },
    { title: '美联社 · 行业领袖各自表态', url: 'https://apnews.com/article/nvidia-jensen-huang-tech-ceo-reactions-063310aae44182e67e55c04c5b1e29e4', note: '行业声音各有立场。第六折把不同场合合成一场讲席，席间戏词均为原创。' },
    { title: 'DealBook 现场报道 · Altman', url: 'https://techcrunch.com/2026/11/18/openai-ceo-sam-altman-says-its-hard-to-imagine-the-ai-industry-without-jensen/', note: '旧日合作与有关回任问题的回答分开记录。' },
    { title: '请愿与回任后的发言 · Musk', url: 'https://techcrunch.com/2026/11/23/elon-musk-and-others-rejoice-as-jensen-huang-is-reinstated-at-nvidia-amid-scandal/', note: '请愿情节取材于公开声援。' },
    { title: 'CNBC · Amodei 兄妹访谈', url: 'https://pressroom.versantmedia.com/cnbc/press-releases/cnbc-exclusive-transcript-anthropic-co-founders-dario-and-daniela-amodei-speak', note: '上市日受访时将人事决定留给英伟达。' },
    { title: '此前论坛记录 · Lisa Su', url: 'https://www.benzinga.com/markets/tech/26/11/63375938/the-noise-will-work-itself-out-in-time-amd-ceo-lisa-su-says-nvidia-a-phenomenal-company-after-jensen-huang-exits', note: '绯炉的两盏茶取材于她对创炉者与临时接任者的评价。' },
    { title: '亚太市况与交易时段', url: 'https://www.itv.com/news/2026-11-13/asian-shares-decline-as-investors-assess-impact-of-nvidias-fallout', note: '11 月 13 日亚洲各地交易表现不一，第四折的行情纸有涨有跌。' },
    { title: '美联社 · 11 月 20 日收市', url: 'https://apnews.com/article/wall-street-stocks-dow-nasdaq-c10b797a17c2acf37924d834efebe135', note: '当周纳指跌 10%，标普 500 跌 8.6%。市场对出口政策与 AI 投资也有疑虑。' },
    { title: '美联社 · 11 月 23 日反弹', url: 'https://apnews.com/article/nvidia-jensen-huang-chips-return-trump-china-01ba8c83e7d7d4fa79c22ca5dbc47d22', note: '当天英伟达股价收涨 31.5%。' },
    { title: '中央社 · 台北 101 点灯', url: 'https://www.cna.com.tw/news/afe/202611160228.aspx', note: '百一灯楼取材自科技界人士出资声援。' },
    { title: '美国总统记者团 · 11 月 16 日', url: 'https://www.presidency.ucsb.edu/documents/pool-reports-november-16-2026', note: '出访前称不介意黄回任。' },
    { title: '照海宴的原型 · 会期报道', url: 'https://www.marketscreener.com/news/trump-says-he-discussed-ai-with-xi-barely-mentioned-jensen-huang-ce785eddde8ff42d', note: '总统受访复述 APEC 期间谈 AI、只简短提及黄。' },
    { title: 'CBS · 11 月 20 日记者会', url: 'https://www.cbsnews.com/live-updates/trump-press-conference-live-stream-2026-11-20/', note: '明确表达希望黄道歉并重返工作。' },
    { title: 'CNBC · 11 月 23 日总统访谈', url: 'https://pressroom.versantmedia.com/cnbc/press-releases/cnbc-transcript-president-donald-trump-speaks-cnbcs-eamon-javers-and-squawk', note: '总统自述直接及间接与董事会沟通。' },
    { title: '美国司法部与商务部联合声明', url: 'https://www.justice.gov/opa/pr/joint-statement-department-commerce-and-department-justice-megaspeed-investigation', note: '企业调查与个人指控应分别举证。滴墨验单、面馆票据和签收栏属于剧本道具。' },
    { title: '国会访谈排期', url: 'https://intelligence.house.gov/2026/11/17/jensen-huang-and-nvidia-agree-to-appear-before-congress/', note: '片尾所见为 12 月 1 日、2 日的预定安排。' },
    { title: '三位众院主席的联合声明', url: 'https://foreignaffairs.house.gov/news/press-releases/chairmen-mast-moolenaar-and-crawford-release-statement-on-jensen-huang-s-reinstatement', note: '朱台的续问帖借共和党国会监督派的公开表态。' },
    { title: '参院银行委员会 · 沃伦声明', url: 'https://www.banking.senate.gov/newsroom/minority/senator-warren-statement-on-jensen-huang-reinstatement-as-nvidia-ceo', note: '靛台的货禁折取材于民主党议员对跨党派出口管制立法的呼吁。' },
    { title: '外交部例行记者会 · 11 月 12 日', url: 'https://sg.china-embassy.gov.cn/fyrth/202611/t20261112_12058185.htm', note: '东埠剪报取材于发言人回应有关当事人所在地的提问。' },
    { title: '《纽约客》· 少年经历访谈', url: 'https://www.newyorker.com/magazine/2023/12/04/how-jensen-huangs-nvidia-is-powering-the-ai-revolution', note: '少年寄宿与吊桥经历的来源。' },
    { title: '俄勒冈州立大学 · 黄氏夫妇', url: 'https://news.oregonstate.edu/news/50-million-gift-nvidia-founder-and-spouse-helps-launch-oregon-state-university-research-center', note: '实验课相识及夫妇背景。蓝铅笔、署名与家书均为原创戏拟。' },
    { title: '创始餐馆的记录', url: 'https://blogs.nvidia.com/blog/nvidia-dennys-trillion/', note: '取材于三位创始人在餐馆商议创业。结尾的第四把椅子由编剧虚构。' },
    { title: '《后宫甄嬛传》分集梗概', url: 'https://www.gtv.com.tw/Program/P2015020401/story.html', note: '借原剧的故衣、离宫、回宫、错指与验亲等戏剧关系。宫廷对白、人物动作与庭审均重新创作。' }
  ];

  function ending(state) {
    const f = state.flags;
    const title = f.family && f.key && f.draft ? '早点铺的第四把椅子'
      : f.family && f.key ? '灯熄了，留一页空白'
      : f.family && f.draft ? '信进了门，炉还等人'
      : f.key && f.draft ? '交完夜班，再等家信'
      : f.family ? '蓝笔回到手里' : '卷宗里的整页';
    const panels = [
      { title: '黄宅 · 那只饭盒', text: f.family
        ? '洛璃把蓝笔推回来，让仁薰自己写饭盒上的名字。她肯收信。下次何时谈，由她定。'
        : '凹了角的饭盒留在门房，垫着那封退回的联署信。另一格该写下次见面的时辰，洛璃先把它空着。' },
      { title: '炉坊 · 今夜谁来开门', text: f.key
        ? '珂莱特准点下工。夜班师傅自己转动副钥，朱小满终于一觉睡到天亮。'
        : '小满半夜敲门三次。薰妃第三回穿好靴子，才想起来干脆把正钥交出去。' },
      { title: '报馆 · 谁在底页上署名', text: f.draft
        ? '安绫音在整段原话下面写上自己的名字。货单整页随卷，签收一格原样留白。'
        : '碧禾只替亲见的图注落款。旁边那块空白留给待补的原页，货案仍待查。' }
    ];
    if (f.family && f.key && f.draft) {
      const drawing = f.blueprint === 'signed' ? '蓝铅笔留下的两个人名还并排站着' : '背面那半条草图还跟正面的线接得上';
      panels.push({ title: '彩蛋 · 三十三年后的早点', text: '洛璃拉过第四把椅子，摊开旧图，' + drawing + '。她拿蓝笔敲敲账单。「三十三年了。四个人吃饭，你们还只算三份。」仁薰接过笔。' });
    }
    const replies = {
      work: '来访事由「上工」。朱小满翻过纸签，提笔补上一行。「已到，记你一个早班。」',
      answers: '来访事由「讨说法」。乔恩思夹上两份批复，一份写无意复位，一份写一致通过。日期不同，两张落款都是他的字。',
      lunch: '来访事由「取饭盒」。凹角饭盒放在门边，盒盖上贴着一张极小的便条。「记得洗碗。」'
    };
    const receipt = f.mail === 'family' ? '黄宅' : '长案堂';
    const extra = f.mail === 'family' && !f.jointLetter || f.mail === 'draft' && f.fullPage;
    return { title, lead: '创炉三十三年，离宫十一日。三方印都还了回来。散场以后，各家门口还留着几件小事。', panels,
      postscript: (extra ? '另一张标着「' + receipt + '已收」的驿印回执，夹在纸签背面。' : '') + (replies[f.pass] || replies.work) };
  }

  window.PALACE_STORY = { chapters, scenes, cast, sources, ending };
})();
