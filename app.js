(() => {
  const $ = (selector) => document.querySelector(selector);

  const liveDate = $("#liveDate");
  const liveTime = $("#liveTime");
  const liveBranch = $("#liveBranch");
  const methodClock = $("#methodClock");
  const questionInput = $("#question");
  const locationInput = $("#location");
  const locateBtn = $("#locateBtn");
  const modeButtons = [...document.querySelectorAll(".mode-button")];
  const timePanel = $("#timePanel");
  const coinPanel = $("#coinPanel");
  const timeCastBtn = $("#timeCastBtn");
  const tossBtn = $("#tossBtn");
  const autoTossBtn = $("#autoTossBtn");
  const resetCoinBtn = $("#resetCoinBtn");
  const coinBoard = $("#coinBoard");
  const statusLine = $("#statusLine");
  const emptyState = $("#emptyState");
  const readingContent = $("#readingContent");
  const castMeta = $("#castMeta");
  const readingTitle = $("#readingTitle");
  const verdictPill = $("#verdictPill");
  const verdictText = $("#verdictText");
  const hexagramGrid = $("#hexagramGrid");
  const reasonText = $("#reasonText");
  const actionList = $("#actionList");
  const movingLines = $("#movingLines");
  const trigramText = $("#trigramText");

  const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const LINE_POSITIONS = [
    "基础条件",
    "配合与资源",
    "风险临界点",
    "外部环境",
    "主导决策",
    "后续收尾",
  ];
  const LINE_ADVICE = [
    "先核实基础信息、预算、时间和真实需求。",
    "看支持者、资源和对方配合是否到位。",
    "不要硬冲，先把最明显的风险点拆掉。",
    "外部变量会影响结果，适合先试探和观察反馈。",
    "关键在你的选择与主导权，决定前要把边界说清。",
    "事情容易过头或进入尾声，宜收束，不宜再加码。",
  ];

  const TRIGRAMS = [
    { name: "乾", symbol: "☰", bits: [1, 1, 1], image: "天", nature: "主动、强势、开局", advice: "把方向和规则先立起来" },
    { name: "兑", symbol: "☱", bits: [1, 1, 0], image: "泽", nature: "沟通、交换、喜悦", advice: "先把话说明白，别只凭感觉" },
    { name: "离", symbol: "☲", bits: [1, 0, 1], image: "火", nature: "看见、判断、依附", advice: "先确认事实和证据" },
    { name: "震", symbol: "☳", bits: [1, 0, 0], image: "雷", nature: "启动、变化、惊动", advice: "可以行动，但步子要小" },
    { name: "巽", symbol: "☴", bits: [0, 1, 1], image: "风", nature: "渗透、协调、细节", advice: "慢慢推进，重视细节" },
    { name: "坎", symbol: "☵", bits: [0, 1, 0], image: "水", nature: "风险、压力、隐情", advice: "先控风险，再谈突破" },
    { name: "艮", symbol: "☶", bits: [0, 0, 1], image: "山", nature: "停止、边界、等待", advice: "知道哪里该停" },
    { name: "坤", symbol: "☷", bits: [0, 0, 0], image: "地", nature: "承接、配合、积累", advice: "顺势承接，别单打独斗" },
  ];

  const MEIHUA_REMAINDER = {
    0: TRIGRAMS[7],
    1: TRIGRAMS[0],
    2: TRIGRAMS[1],
    3: TRIGRAMS[2],
    4: TRIGRAMS[3],
    5: TRIGRAMS[4],
    6: TRIGRAMS[5],
    7: TRIGRAMS[6],
  };

  const TRIGRAM_BY_BITS = new Map(TRIGRAMS.map((item) => [item.bits.join(""), item]));

  const HEX_BY_TRIGRAM = {
    乾: { 乾: 1, 兑: 10, 离: 13, 震: 25, 巽: 44, 坎: 6, 艮: 33, 坤: 12 },
    兑: { 乾: 43, 兑: 58, 离: 49, 震: 17, 巽: 28, 坎: 47, 艮: 31, 坤: 45 },
    离: { 乾: 14, 兑: 38, 离: 30, 震: 21, 巽: 50, 坎: 64, 艮: 56, 坤: 35 },
    震: { 乾: 34, 兑: 54, 离: 55, 震: 51, 巽: 32, 坎: 40, 艮: 62, 坤: 16 },
    巽: { 乾: 9, 兑: 61, 离: 37, 震: 42, 巽: 57, 坎: 59, 艮: 53, 坤: 20 },
    坎: { 乾: 5, 兑: 60, 离: 63, 震: 3, 巽: 48, 坎: 29, 艮: 39, 坤: 8 },
    艮: { 乾: 26, 兑: 41, 离: 22, 震: 27, 巽: 18, 坎: 4, 艮: 52, 坤: 23 },
    坤: { 乾: 11, 兑: 19, 离: 36, 震: 24, 巽: 46, 坎: 7, 艮: 15, 坤: 2 },
  };

  const HEXAGRAMS = {
    1: { name: "乾为天", keys: "主动、开创、主导", brief: "气势强，适合开局和争取主动，但不宜只靠强推。" },
    2: { name: "坤为地", keys: "承接、配合、积累", brief: "适合稳扎稳打、借助团队和环境，不适合孤军冒进。" },
    3: { name: "水雷屯", keys: "初难、蓄势、破土", brief: "刚开始阻力较多，先定规则、聚资源，再求进展。" },
    4: { name: "山水蒙", keys: "不明、学习、求证", brief: "信息不够清楚，先请教和核实，不宜凭猜测决定。" },
    5: { name: "水天需", keys: "等待、蓄养、时机", brief: "时机未熟，先准备条件，等关键节点出现。" },
    6: { name: "天水讼", keys: "争执、边界、证据", brief: "容易有分歧或规则冲突，必须先把边界和证据摆清。" },
    7: { name: "地水师", keys: "组织、纪律、统筹", brief: "要靠组织和分工推进，缺少秩序就容易散。" },
    8: { name: "水地比", keys: "靠近、合作、选择", brief: "利于结盟，但要选可信的人，关系稳事情才稳。" },
    9: { name: "风天小畜", keys: "小蓄、克制、微调", brief: "力量已有但还不够大，适合小步调整、积少成多。" },
    10: { name: "天泽履", keys: "谨慎、礼法、分寸", brief: "脚下有风险，照规矩走、把分寸拿好就能过关。" },
    11: { name: "地天泰", keys: "通顺、交融、上升", brief: "上下相通，局面较顺，适合趁势推进并守住平衡。" },
    12: { name: "天地否", keys: "不通、闭塞、守正", brief: "沟通和环境不顺，先保核心，不宜硬求结果。" },
    13: { name: "天火同人", keys: "同道、公开、协作", brief: "适合找共同立场，越公开透明越能聚合力量。" },
    14: { name: "火天大有", keys: "资源、掌握、责任", brief: "资源和机会较足，但要善用资源，避免过度自信。" },
    15: { name: "地山谦", keys: "谦逊、收敛、得助", brief: "低姿态更容易得助，不争一时反而更稳。" },
    16: { name: "雷地豫", keys: "预备、动员、乐观", brief: "人心可动，适合预热和调动，但要防松懈。" },
    17: { name: "泽雷随", keys: "顺应、跟随、转换", brief: "顺势比硬拗更有效，关键是看清该随谁、借什么势。" },
    18: { name: "山风蛊", keys: "整顿、旧弊、修复", brief: "旧问题需要清理，先修补漏洞，再谈推进。" },
    19: { name: "地泽临", keys: "靠近、扶持、推进", brief: "机会正在靠近，适合主动推进，但盛势中要有远虑。" },
    20: { name: "风地观", keys: "观察、审势、示范", brief: "先观察再行动，你的态度也会影响别人对你的判断。" },
    21: { name: "火雷噬嗑", keys: "清障、决断、规则", brief: "中间有阻碍，要靠清晰规则和果断处理破局。" },
    22: { name: "山火贲", keys: "呈现、包装、修饰", brief: "表达和外观有帮助，但不能只有包装，内容要实。" },
    23: { name: "山地剥", keys: "削弱、减损、保底", brief: "局面有被削弱的迹象，先保底线，不宜恋战。" },
    24: { name: "地雷复", keys: "回返、修正、重启", brief: "低处有回升机会，适合修正方向、从小处重新开始。" },
    25: { name: "天雷无妄", keys: "真实、正当、少算计", brief: "以真实和正当为先，过度谋算反而容易误伤。" },
    26: { name: "山天大畜", keys: "蓄力、培养、约束", brief: "力量需要先收束和培养，先蓄后发更稳。" },
    27: { name: "山雷颐", keys: "滋养、输入、供给", brief: "先看输入是否健康，资源、话语和信息都会影响结果。" },
    28: { name: "泽风大过", keys: "过载、压力、非常", brief: "压力超过常态，需要减负和非常处理，不能硬扛。" },
    29: { name: "坎为水", keys: "重险、试炼、隐忧", brief: "风险反复，不能靠侥幸，要一步一验。" },
    30: { name: "离为火", keys: "明辨、依托、看见", brief: "事情需要证据和依托，看清事实后再站位。" },
    31: { name: "泽山咸", keys: "感应、吸引、互通", brief: "双方有感应，真诚沟通有用，急迫会削弱吸引。" },
    32: { name: "雷风恒", keys: "长期、节律、承诺", brief: "贵在稳定持续，守住节奏比短期冲刺更重要。" },
    33: { name: "天山遁", keys: "退避、保全、远害", brief: "退一步是保存主动权，离开消耗场更有利。" },
    34: { name: "雷天大壮", keys: "强势、推进、守礼", brief: "力量正盛，可以推进，但越强越要守分寸。" },
    35: { name: "火地晋", keys: "晋升、显现、进展", brief: "有上升和被看见的机会，保持正向输出可得认可。" },
    36: { name: "地火明夷", keys: "藏明、受伤、低调", brief: "光被遮住，不宜锋芒外露，先保护自己。" },
    37: { name: "风火家人", keys: "内治、角色、秩序", brief: "先整理内部关系和角色，内部顺了外部才顺。" },
    38: { name: "火泽睽", keys: "分歧、异见、求同", brief: "观点不同并非全坏，小事求同，大事先缓。" },
    39: { name: "水山蹇", keys: "艰阻、绕行、求援", brief: "路被阻住，硬闯不利，转向或求助更好。" },
    40: { name: "雷水解", keys: "化解、松动、释放", brief: "压力有松动，适合抓住窗口化解旧结。" },
    41: { name: "山泽损", keys: "减损、节制、换益", brief: "先减后得，舍掉无效消耗，重要的才会显出来。" },
    42: { name: "风雷益", keys: "增益、助力、成长", brief: "有增长和助益，适合投入，但要让利益流动起来。" },
    43: { name: "泽天夬", keys: "决断、切除、公开", brief: "需要明确表态和切除隐患，但不要带着怒气处理。" },
    44: { name: "天风姤", keys: "相遇、诱因、外来变量", brief: "有突然变量，可以接触，但先辨别性质。" },
    45: { name: "泽地萃", keys: "聚集、人气、资源", brief: "资源和人气汇聚，要有中心与秩序，聚而不乱。" },
    46: { name: "地风升", keys: "上升、培植、渐进", brief: "有上升机会，靠持续培植，慢慢来更稳。" },
    47: { name: "泽水困", keys: "受限、困顿、守心", brief: "外部受限，先减少消耗，保住信心和底盘。" },
    48: { name: "水风井", keys: "根源、供给、制度", brief: "回到基础和长期供给系统，把底层问题修好。" },
    49: { name: "泽火革", keys: "变革、去旧、定时", brief: "旧局可改，但变革要看时机和共识。" },
    50: { name: "火风鼎", keys: "更新、重组、成器", brief: "适合重组资源、升级形态，把散料炼成器。" },
    51: { name: "震为雷", keys: "震动、惊醒、行动", brief: "突发刺激带来觉醒，先稳住，再转成行动力。" },
    52: { name: "艮为山", keys: "停止、边界、定住", brief: "当止则止，停下来是让局面归位，不是浪费。" },
    53: { name: "风山渐", keys: "渐进、礼序、长期", brief: "循序渐进最吉，关系或事业都不可跳级。" },
    54: { name: "雷泽归妹", keys: "错位、名分、情势", brief: "位置或名分未必正，先看结构，再谈投入。" },
    55: { name: "雷火丰", keys: "丰盛、显现、盛极", brief: "局面热烈丰盛，适合呈现成果，但要防过满。" },
    56: { name: "火山旅", keys: "暂居、过渡、谨慎", brief: "身在过渡期，不宜重承诺，轻装观察更好。" },
    57: { name: "巽为风", keys: "柔入、协调、细密", brief: "适合谈判、铺陈和渗透，不宜急攻。" },
    58: { name: "兑为泽", keys: "沟通、兑现、喜悦", brief: "沟通有利，承诺能兑现时才会真正聚人。" },
    59: { name: "风水涣", keys: "疏通、散结、离散", brief: "僵局可松，先疏通人心，再疏通事务。" },
    60: { name: "水泽节", keys: "节制、规则、限度", brief: "限制不是坏事，定边界和节律反而能长久。" },
    61: { name: "风泽中孚", keys: "诚信、感通、内实", brief: "诚信是关键，内心真实，外部才会回应。" },
    62: { name: "雷山小过", keys: "谨微、小事、低飞", brief: "小事可过，大事宜谨，放低姿态、重视细节。" },
    63: { name: "水火既济", keys: "已成、平衡、防乱", brief: "事情接近完成，成后最怕松懈，善后要细。" },
    64: { name: "火水未济", keys: "未成、过渡、再调", brief: "尚未完成，仍在转换，最后一步最要稳。" },
  };

  const GOOD_HEX = new Set([1, 2, 11, 13, 14, 16, 19, 24, 31, 32, 35, 37, 40, 42, 45, 46, 50, 53, 55, 58, 61, 63]);
  const HARD_HEX = new Set([12, 23, 28, 29, 33, 36, 39, 41, 43, 44, 47, 52, 54]);

  const DOMAINS = [
    {
      id: "cooperation",
      name: "合作/项目",
      words: ["合作", "项目", "客户", "合同", "签约", "伙伴", "公司", "生意", "创业", "谈判", "推进", "投资人"],
      subject: "这次合作",
      positive: "可以推进，但先从低风险版本开始。",
      cautious: "适合继续谈，但不适合马上重投入或签死条款。",
      hold: "暂时不宜急着推进，先把条件查清楚。",
      actions: ["把分工、费用、交付、退出条件写成文字。", "先做一次小范围试单或阶段性合作。", "如果对方回避关键条款，就先停下来。"],
    },
    {
      id: "career",
      name: "工作/职业",
      words: ["工作", "跳槽", "换工作", "面试", "offer", "升职", "岗位", "离职", "转行", "职业", "薪资"],
      subject: "这件职业选择",
      positive: "可以争取，但要确认条件后再行动。",
      cautious: "有机会，但别因一时情绪做决定。",
      hold: "不适合立刻做不可逆选择，先稳住手上的局面。",
      actions: ["把薪资、职责、汇报对象和试用期确认到文字。", "拿到明确 offer 或备选方案后，再考虑离职。", "用一次深入沟通判断团队和上级是否可靠。"],
    },
    {
      id: "relationship",
      name: "感情/关系",
      words: ["感情", "恋爱", "复合", "婚姻", "喜欢", "对象", "伴侣", "分手", "暧昧", "表白", "结婚"],
      subject: "这段关系",
      positive: "可以继续靠近，但要看对方行动是否稳定。",
      cautious: "可以沟通，但不适合逼对方马上给承诺。",
      hold: "先别急着投入更多，保护自己的边界。",
      actions: ["先把真实感受说清楚，不用试探和猜。", "观察对方是否持续行动，而不是只听承诺。", "若反复失信或回避关系定位，就先拉开距离。"],
    },
    {
      id: "money",
      name: "钱财/投资",
      words: ["投资", "理财", "钱", "财", "买房", "卖房", "股票", "基金", "借款", "收入", "回款", "贷款"],
      subject: "这笔钱或投资",
      positive: "可以研究，但必须控制本金和风险。",
      cautious: "不适合大额投入，先小额验证。",
      hold: "暂时不宜冒险投入，先保住现金和底线。",
      actions: ["不要加杠杆，不把急用钱投进去。", "把合同、收益来源、退出方式逐条核实。", "先用小金额或模拟方式验证判断。"],
    },
    {
      id: "study",
      name: "学习/考试",
      words: ["考试", "学习", "升学", "论文", "证书", "课程", "考研", "留学", "培训"],
      subject: "这件学习或考试计划",
      positive: "可以推进，关键是持续节奏。",
      cautious: "有机会，但要先补短板，不宜盲目冲刺。",
      hold: "先别急着加码，调整方法比硬熬更重要。",
      actions: ["列出最弱的 2 个环节，先补短板。", "把计划拆到每周可检查的任务。", "用一次模拟测试验证当前方法是否有效。"],
    },
    {
      id: "health",
      name: "健康/身体",
      words: ["健康", "身体", "病", "手术", "怀孕", "体检", "治疗", "失眠", "焦虑", "疼"],
      subject: "这件健康问题",
      positive: "有改善空间，但不能只靠卦象判断。",
      cautious: "要重视，不要拖延观察太久。",
      hold: "先把身体安全放第一位，尽快求证。",
      actions: ["身体不适请及时咨询医生或做检查。", "记录症状、时间和诱因，方便判断。", "先调整睡眠、饮食和压力源，别自行冒险处理。"],
    },
    {
      id: "move",
      name: "出行/搬迁",
      words: ["搬家", "出行", "旅游", "迁移", "城市", "远行", "搬迁", "租房", "买房"],
      subject: "这次移动或居住选择",
      positive: "可以推进，但路线和后勤要先定稳。",
      cautious: "可以准备，不宜仓促出发或签约。",
      hold: "暂时先缓，等条件清楚后再动。",
      actions: ["先确认费用、交通、合同和备选方案。", "提前看清目的地真实环境，不只听介绍。", "留出退路，避免把选择做死。"],
    },
    {
      id: "general",
      name: "综合问题",
      words: [],
      subject: "这件事",
      positive: "可以推进，但要保持节奏。",
      cautious: "可以继续看，但别急着做大决定。",
      hold: "先缓一缓，把事实和风险查清楚。",
      actions: ["先收集关键事实，不靠猜测决定。", "从小范围试探开始，不要一次押太多。", "把最坏情况写出来，确认自己能承受再行动。"],
    },
  ];

  let coinLines = [];

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function getHourBranch(date) {
    const index = Math.floor((date.getHours() + 1) / 2) % 12;
    return {
      index,
      number: index + 1,
      name: BRANCHES[index],
    };
  }

  function updateClock() {
    const now = new Date();
    const branch = getHourBranch(now);
    const dateText = `${now.getFullYear()}年${pad(now.getMonth() + 1)}月${pad(now.getDate())}日`;
    const timeText = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    liveDate.textContent = dateText;
    liveTime.textContent = timeText;
    liveBranch.textContent = `${branch.name}时`;
    methodClock.textContent = `${dateText} ${timeText} · ${branch.name}时`;
  }

  function setStatus(message, tone = "normal") {
    statusLine.textContent = message;
    statusLine.dataset.tone = tone;
  }

  function readContext() {
    const question = questionInput.value.trim();
    const location = locationInput.value.trim();

    if (!question || !location) {
      setStatus(!question && !location ? "请先写下问题与所在地区。" : !question ? "请先写下你想问的问题。" : "请先填写所在地区。", "warn");
      (!question ? questionInput : locationInput).focus();
      return null;
    }

    setStatus("");
    return { question, location };
  }

  function getHexagram(lines) {
    const lower = TRIGRAM_BY_BITS.get(lines.slice(0, 3).map((line) => Number(line.yang)).join(""));
    const upper = TRIGRAM_BY_BITS.get(lines.slice(3, 6).map((line) => Number(line.yang)).join(""));
    const number = HEX_BY_TRIGRAM[upper.name][lower.name];
    return {
      number,
      upper,
      lower,
      ...HEXAGRAMS[number],
    };
  }

  function changedLines(lines) {
    return lines.map((line) => ({
      ...line,
      yang: line.changing ? !line.yang : line.yang,
      changing: false,
    }));
  }

  function makeLine(yang, changing, source, value, extra = {}) {
    const oldLabel = yang ? "老阳" : "老阴";
    const youngLabel = yang ? "少阳" : "少阴";
    return {
      yang,
      changing,
      source,
      value,
      label: changing ? oldLabel : youngLabel,
      ...extra,
    };
  }

  function castByTime(context) {
    const date = new Date();
    const branch = getHourBranch(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const upper = MEIHUA_REMAINDER[(year + month + day) % 8];
    const lower = MEIHUA_REMAINDER[(year + month + day + branch.number) % 8];
    const movingNumber = (year + month + day + branch.number) % 6 || 6;
    const lines = [...lower.bits, ...upper.bits].map((bit, index) =>
      makeLine(Boolean(bit), index === movingNumber - 1, "time", index === movingNumber - 1 ? (bit ? 9 : 6) : bit ? 7 : 8)
    );

    return {
      method: "时间起卦",
      question: context.question,
      location: context.location,
      castAt: date,
      seedText: `年${year} 月${month} 日${day} ${branch.name}时`,
      lines,
    };
  }

  function secureCoinValue() {
    if (window.crypto?.getRandomValues) {
      const values = new Uint32Array(1);
      window.crypto.getRandomValues(values);
      return values[0] % 2 === 0 ? 2 : 3;
    }
    return Math.random() < 0.5 ? 2 : 3;
  }

  function tossCoinLine() {
    const coins = [secureCoinValue(), secureCoinValue(), secureCoinValue()];
    const value = coins.reduce((sum, item) => sum + item, 0);
    const yang = value === 7 || value === 9;
    const changing = value === 6 || value === 9;
    return makeLine(yang, changing, "coin", value, {
      coins: coins.map((coin) => ({
        value: coin,
        face: coin === 3 ? "正" : "背",
      })),
    });
  }

  function lineName(line, index) {
    const yangName = line.yang ? "九" : "六";
    const positions = ["初", "二", "三", "四", "五", "上"];
    if (index === 0) return `初${yangName}`;
    if (index === 5) return `上${yangName}`;
    return `${yangName}${positions[index]}`;
  }

  function renderYaoRows(lines, showMoving) {
    return lines
      .map((line, index) => ({ line, index }))
      .reverse()
      .map(({ line, index }) => {
        const moving = showMoving && line.changing;
        return `
          <div class="yao-row${moving ? " is-moving" : ""}">
            <span class="yao-label">${lineName(line, index)}</span>
            <span class="yao ${line.yang ? "yang" : "yin"}" aria-label="${line.yang ? "阳爻" : "阴爻"}"></span>
            <span class="yao-note">${moving ? "动" : ""}</span>
          </div>
        `;
      })
      .join("");
  }

  function renderHexCard(label, hexagram, lines, showMoving) {
    return `
      <article class="hexagram-card">
        <header>
          <h3>${label} · ${hexagram.name}</h3>
          <span class="hexagram-number">第 ${hexagram.number} 卦</span>
        </header>
        <div class="yao-stack">${renderYaoRows(lines, showMoving)}</div>
        <p class="trigram-pair">${hexagram.upper.symbol} ${hexagram.upper.name}${hexagram.upper.image}在上 · ${hexagram.lower.symbol} ${hexagram.lower.name}${hexagram.lower.image}在下</p>
      </article>
    `;
  }

  function getDomain(question) {
    return DOMAINS.find((domain) => domain.words.some((word) => question.includes(word))) || DOMAINS[DOMAINS.length - 1];
  }

  function scoreHex(hexagram) {
    if (GOOD_HEX.has(hexagram.number)) return 72;
    if (HARD_HEX.has(hexagram.number)) return 34;
    return 54;
  }

  function getVerdictLevel(score) {
    if (score >= 70) return { label: "偏吉", tone: "go", key: "positive", title: "可以推进" };
    if (score >= 56) return { label: "小吉", tone: "caution", key: "cautious", title: "谨慎推进" };
    if (score >= 42) return { label: "平", tone: "caution", key: "cautious", title: "先试探" };
    return { label: "宜缓", tone: "hold", key: "hold", title: "先缓一缓" };
  }

  function analyzeReading(cast, original, changed, movingCount) {
    const domain = getDomain(cast.question);
    const movingPenalty = Math.max(0, movingCount - 2) * 4;
    const score = Math.max(10, Math.min(90, Math.round(scoreHex(original) * 0.62 + scoreHex(changed) * 0.38 - movingPenalty)));
    const level = getVerdictLevel(score);
    const yesNo = /是否|能不能|可不可以|要不要|会不会|适不适合|适合|有没有|能否|该不该/.test(cast.question);
    const mainMoving = cast.lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.changing)
      .at(-1);
    const focus = mainMoving ? LINE_POSITIONS[mainMoving.index] : original.lower.nature;
    const directPrefix = yesNo ? "答案是：" : "这件事的判断是：";
    const verdict =
      `${directPrefix}${level.title}。就你问的“${escapeHtml(cast.question)}”来看，${domain[`${level.key}`]} ` +
      `现在最该盯住的是“${focus}”，不要只看愿望，要看条件是否真的到位。`;

    const changeText =
      movingCount === 0
        ? "本卦没有动爻，表示局势短期内不容易大幅变化，重点是按当前条件判断。"
        : movingCount === 1
          ? `一爻发动，变化点集中，事情会从“${original.name}”走向“${changed.name}”。`
          : `${movingCount}爻发动，说明变量较多，不能按单一乐观或悲观理解，要边走边校验。`;

    const reason =
      `本卦为“${original.name}”，核心是${original.keys}：${original.brief}` +
      `变卦为“${changed.name}”，后续会转向${changed.keys}：${changed.brief}` +
      `${changeText} 所以对“${domain.subject}”的建议不是玄乎地说吉凶，而是先把现实条件、边界和可承受风险落到纸面上。`;

    const extraAction =
      movingCount >= 3
        ? "变量偏多，任何承诺都要留复盘点和退出口。"
        : movingCount === 0
          ? "短期先按原计划观察，不要频繁改方向。"
          : mainMoving
            ? LINE_ADVICE[mainMoving.index]
            : "先做低成本验证，再扩大投入。";

    return {
      domain,
      level,
      score,
      verdict,
      reason,
      actions: [...domain.actions, extraAction].slice(0, 4),
    };
  }

  function movementTone(line) {
    return line.yang ? "阳动化阴：从强转柔，别硬推到底。" : "阴动化阳：从静转动，可以把准备转成行动。";
  }

  function renderMovingLines(lines) {
    const moving = lines
      .map((line, index) => ({ line, index }))
      .filter(({ line }) => line.changing);

    if (!moving.length) {
      movingLines.innerHTML = "<li><strong>无动爻</strong><span>短期变化不大，以本卦判断为主。先观察现有条件，不要频繁改变策略。</span></li>";
      return;
    }

    movingLines.innerHTML = moving
      .map(({ line, index }) => {
        return `<li><strong>${lineName(line, index)}</strong><span>${LINE_POSITIONS[index]}是焦点。${LINE_ADVICE[index]} ${movementTone(line)}</span></li>`;
      })
      .join("");
  }

  function composeTrigramText(original) {
    return `内卦为${original.lower.name}${original.lower.image}，代表事情内部偏“${original.lower.nature}”；外卦为${original.upper.name}${original.upper.image}，代表外部环境偏“${original.upper.nature}”。简单说：内部要${original.lower.advice}，对外要${original.upper.advice}。`;
  }

  function renderReading(cast) {
    const original = getHexagram(cast.lines);
    const transformedLines = changedLines(cast.lines);
    const changed = getHexagram(transformedLines);
    const movingCount = cast.lines.filter((line) => line.changing).length;
    const analysis = analyzeReading(cast, original, changed, movingCount);
    const date = cast.castAt;

    emptyState.hidden = true;
    readingContent.hidden = false;
    castMeta.textContent = `${cast.method} · ${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} · ${cast.seedText}`;
    readingTitle.textContent = `${original.name} ${movingCount ? "之" : "守"} ${changed.name}`;
    verdictPill.textContent = `${analysis.level.label} · ${analysis.score}`;
    verdictPill.dataset.tone = analysis.level.tone;
    verdictText.innerHTML = analysis.verdict;
    reasonText.textContent = analysis.reason;
    actionList.innerHTML = analysis.actions.map((action, index) => `<li><strong>${index + 1}</strong><span>${escapeHtml(action)}</span></li>`).join("");
    hexagramGrid.innerHTML = renderHexCard("本卦", original, cast.lines, true) + renderHexCard("变卦", changed, transformedLines, false);
    trigramText.textContent = composeTrigramText(original);
    renderMovingLines(cast.lines);
  }

  function renderCoinBoard() {
    if (!coinLines.length) {
      coinBoard.innerHTML = '<span class="coin-placeholder">六爻未定</span>';
    } else {
      coinBoard.innerHTML = coinLines
        .map((line, index) => {
          const faces = line.coins
            .map((coin) => `<span class="coin ${coin.value === 2 ? "is-tail" : ""}">${coin.face}</span>`)
            .join("");
          return `
            <div class="coin-row">
              <span>第${index + 1}爻</span>
              <span class="coin-faces">${faces}</span>
              <strong>${line.value} · ${line.label}</strong>
            </div>
          `;
        })
        .reverse()
        .join("");
    }

    tossBtn.textContent = coinLines.length >= 6 ? "六爻已成" : `摇第 ${coinLines.length + 1} 爻`;
    tossBtn.disabled = coinLines.length >= 6;
    autoTossBtn.disabled = coinLines.length >= 6;
  }

  function finishCoinCast(context) {
    renderReading({
      method: "摇硬币",
      question: context.question,
      location: context.location,
      castAt: new Date(),
      seedText: "三枚硬币六次",
      lines: coinLines,
    });
  }

  function setMode(mode) {
    modeButtons.forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
    timePanel.classList.toggle("is-active", mode === "time");
    coinPanel.classList.toggle("is-active", mode === "coin");
    setStatus(mode === "time" ? "已切换至时间起卦。" : "已切换至摇硬币起卦。");
  }

  timeCastBtn.addEventListener("click", () => {
    const context = readContext();
    if (!context) return;
    renderReading(castByTime(context));
    setStatus("已按当前时间成卦。");
  });

  tossBtn.addEventListener("click", () => {
    const context = readContext();
    if (!context || coinLines.length >= 6) return;
    coinLines.push(tossCoinLine());
    renderCoinBoard();
    if (coinLines.length === 6) {
      finishCoinCast(context);
      setStatus("六爻已成。");
    } else {
      setStatus(`已成第 ${coinLines.length} 爻。`);
    }
  });

  autoTossBtn.addEventListener("click", () => {
    const context = readContext();
    if (!context) return;
    while (coinLines.length < 6) {
      coinLines.push(tossCoinLine());
    }
    renderCoinBoard();
    finishCoinCast(context);
    setStatus("六爻已成。");
  });

  resetCoinBtn.addEventListener("click", () => {
    coinLines = [];
    renderCoinBoard();
    setStatus("硬币卦已清空。");
  });

  locateBtn.addEventListener("click", () => {
    if (!navigator.geolocation) {
      setStatus("当前浏览器无法取得定位。", "warn");
      return;
    }

    setStatus("正在取得当前位置...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        locationInput.value = `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        setStatus("已写入当前位置坐标。");
      },
      () => setStatus("定位未完成，可手动填写地区。", "warn"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  });

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.mode));
  });

  updateClock();
  renderCoinBoard();
  setInterval(updateClock, 1000);
})();
