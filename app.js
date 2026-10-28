"use strict";

const screen = document.querySelector("#screen");
const homeButton = document.querySelector("#homeButton");
const headerProgress = document.querySelector("#headerProgress");
const headerLevel = document.querySelector("#headerLevel");
const headerCount = document.querySelector("#headerCount");
const progressFill = document.querySelector("#progressFill");
const dragLayer = document.querySelector("#dragLayer");

const Z = (z, p) => ({ z, p });
const token = (z, p) => ({ z, p });
const shuffle = items => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
const sample = (items, count) => shuffle(items).slice(0, count);
const escapeHTML = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function pairHTML(pair, extraClass = "") {
  return `<span class="zh-pair ${extraClass}"><span class="hanzi">${escapeHTML(pair.z)}</span><span class="pinyin">${escapeHTML(pair.p)}</span></span>`;
}

const vocabPool = [
  ["介绍", "jièshào", "introduce", ["practise", "live", "finish school"]],
  ["自己", "zìjǐ", "oneself", ["friend", "habit", "school grade"]],
  ["年级", "niánjí", "school grade", ["age", "quarter hour", "weekend"]],
  ["爱好", "àihào", "hobby / interest", ["homework", "morning", "habitual action"]],
  ["以前", "yǐqián", "before / in the past", ["after", "recently", "finally"]],
  ["现在", "xiànzài", "now", ["before", "weekend", "after school"]],
  ["最近", "zuìjìn", "recently / these days", ["every day", "first", "at once"]],
  ["喜欢", "xǐhuan", "like", ["can", "introduce", "return home"]],
  ["会", "huì", "can / know how to", ["like", "want", "only then"]],
  ["不太会", "bú tài huì", "cannot do very well", ["do not like", "have not done yet", "do not often do"]],
  ["画画", "huàhuà", "draw / paint", ["read", "sing", "dance"]],
  ["唱歌", "chàng gē", "sing", ["draw", "swim", "exercise"]],
  ["跳舞", "tiào wǔ", "dance", ["sing", "play table tennis", "take a shower"]],
  ["游泳", "yóuyǒng", "swim", ["draw", "read", "go to school"]],
  ["打乒乓球", "dǎ pīngpāngqiú", "play table tennis", ["do homework", "eat breakfast", "go to sleep"]],
  ["看书", "kàn shū", "read", ["draw", "practise Chinese", "go out"]],
  ["朋友", "péngyou", "friend", ["oneself", "family", "classmate"]],
  ["练习", "liànxí", "practise", ["introduce", "finish", "relax"]],
  ["起床", "qǐchuáng", "get up", ["go to sleep", "go to school", "go home"]],
  ["刷牙", "shuāyá", "brush teeth", ["take a shower", "eat breakfast", "do homework"]],
  ["吃早饭", "chī zǎofàn", "eat breakfast", ["eat dinner", "get up", "go out"]],
  ["上学", "shàngxué", "go to school", ["finish school", "go home", "get up"]],
  ["放学", "fàngxué", "finish school", ["go to school", "start class", "do homework"]],
  ["回家", "huí jiā", "go home", ["go out", "go to school", "sleep"]],
  ["做作业", "zuò zuòyè", "do homework", ["read a book", "practise singing", "eat breakfast"]],
  ["洗澡", "xǐzǎo", "take a bath / shower", ["brush teeth", "get up", "swim"]],
  ["睡觉", "shuìjiào", "go to sleep", ["get up", "relax", "finish school"]],
  ["一刻", "yí kè", "a quarter hour", ["one minute", "one o'clock", "half an hour"]],
  ["习惯", "xíguàn", "habit", ["hobby", "homework", "weekend"]],
  ["周末", "zhōumò", "weekend", ["weekday", "evening", "recently"]],
  ["平日", "píngrì", "weekday / ordinary day", ["weekend", "today", "every morning"]],
  ["先", "xiān", "first", ["then", "finally", "before"]],
  ["然后", "ránhòu", "then / after that", ["before", "recently", "first"]],
  ["最后", "zuìhòu", "finally / last", ["first", "immediately", "after"]],
  ["闹钟", "nàozhōng", "alarm clock", ["school bell", "watch", "quarter hour"]],
  ["马上", "mǎshàng", "immediately", ["recently", "slowly", "finally"]],
  ["轻松", "qīngsōng", "relaxed / easy", ["busy", "early", "late"]],
  ["才", "cái", "only then / not until", ["already", "first", "also"]]
].map((item, index) => ({ id: `v${index + 1}`, type: 1, word: Z(item[0], item[1]), en: item[2], foils: item[3] }));

const R = (z, p) => Z(z, p);
const dialoguePool = [
  { q: R("你叫什么名字？", "Nǐ jiào shénme míngzi?"), a: [R("我叫小美。", "Wǒ jiào Xiǎoměi."), R("我今年十二岁。", "Wǒ jīnnián shí'èr suì."), R("我住在北京。", "Wǒ zhù zài Běijīng."), R("我上六年级。", "Wǒ shàng liù niánjí.")], c: 0 },
  { q: R("你今年几岁？", "Nǐ jīnnián jǐ suì?"), a: [R("我叫安娜。", "Wǒ jiào Ānnà."), R("我今年十二岁。", "Wǒ jīnnián shí'èr suì."), R("我上六年级。", "Wǒ shàng liù niánjí."), R("我住在上海。", "Wǒ zhù zài Shànghǎi.")], c: 1 },
  { q: R("你住在哪里？", "Nǐ zhù zài nǎlǐ?"), a: [R("我在看书。", "Wǒ zài kàn shū."), R("我去上学。", "Wǒ qù shàngxué."), R("我住在北京。", "Wǒ zhù zài Běijīng."), R("我跟朋友一起。", "Wǒ gēn péngyou yìqǐ.")], c: 2 },
  { q: R("你上几年级？", "Nǐ shàng jǐ niánjí?"), a: [R("我上六年级。", "Wǒ shàng liù niánjí."), R("我十二岁。", "Wǒ shí'èr suì."), R("我八点上学。", "Wǒ bā diǎn shàngxué."), R("我最近上学。", "Wǒ zuìjìn shàngxué.")], c: 0 },
  { q: R("你的爱好是什么？", "Nǐ de àihào shì shénme?"), a: [R("我会游泳。", "Wǒ huì yóuyǒng."), R("我的爱好是画画。", "Wǒ de àihào shì huàhuà."), R("我最近十二岁。", "Wǒ zuìjìn shí'èr suì."), R("我先做作业。", "Wǒ xiān zuò zuòyè.")], c: 1 },
  { q: R("你会游泳吗？", "Nǐ huì yóuyǒng ma?"), a: [R("会，但是我游得不太好。", "Huì, dànshì wǒ yóu de bú tài hǎo."), R("喜欢，我每天七点。", "Xǐhuan, wǒ měitiān qī diǎn."), R("以前，我叫小美。", "Yǐqián, wǒ jiào Xiǎoměi."), R("会，我的爱好是什么？", "Huì, wǒ de àihào shì shénme?")], c: 0 },
  { q: R("你最近常常做什么？", "Nǐ zuìjìn chángcháng zuò shénme?"), a: [R("我住在北京。", "Wǒ zhù zài Běijīng."), R("最近我常常跟朋友一起看书。", "Zuìjìn wǒ chángcháng gēn péngyou yìqǐ kàn shū."), R("以前我十二岁。", "Yǐqián wǒ shí'èr suì."), R("我最后上六年级。", "Wǒ zuìhòu shàng liù niánjí.")], c: 1 },
  { q: R("以前你会游泳吗？现在呢？", "Yǐqián nǐ huì yóuyǒng ma? Xiànzài ne?"), a: [R("我最近常常游泳。", "Wǒ zuìjìn chángcháng yóuyǒng."), R("我喜欢游泳，也会唱歌。", "Wǒ xǐhuan yóuyǒng, yě huì chàng gē."), R("以前我不太会，现在我会了。", "Yǐqián wǒ bú tài huì, xiànzài wǒ huì le."), R("我一游泳就回家。", "Wǒ yì yóuyǒng jiù huí jiā.")], c: 2 },
  { q: R("你每天几点起床？", "Nǐ měitiān jǐ diǎn qǐchuáng?"), a: [R("我每天七点起床。", "Wǒ měitiān qī diǎn qǐchuáng."), R("我起床以后刷牙。", "Wǒ qǐchuáng yǐhòu shuāyá."), R("我七点放学。", "Wǒ qī diǎn fàngxué."), R("周末比较轻松。", "Zhōumò bǐjiào qīngsōng.")], c: 0 },
  { q: R("起床以后，你先做什么？", "Qǐchuáng yǐhòu, nǐ xiān zuò shénme?"), a: [R("我七点起床。", "Wǒ qī diǎn qǐchuáng."), R("我先刷牙。", "Wǒ xiān shuāyá."), R("我最后去上学吗？", "Wǒ zuìhòu qù shàngxué ma?"), R("我以前起床。", "Wǒ yǐqián qǐchuáng.")], c: 1 },
  { q: R("你刷牙以后做什么？", "Nǐ shuāyá yǐhòu zuò shénme?"), a: [R("我先刷牙。", "Wǒ xiān shuāyá."), R("我会刷牙。", "Wǒ huì shuāyá."), R("然后我吃早饭。", "Ránhòu wǒ chī zǎofàn."), R("以前我吃晚饭。", "Yǐqián wǒ chī wǎnfàn.")], c: 2 },
  { q: R("你早上最后做什么？", "Nǐ zǎoshang zuìhòu zuò shénme?"), a: [R("最后我去上学。", "Zuìhòu wǒ qù shàngxué."), R("我先去上学。", "Wǒ xiān qù shàngxué."), R("我最近去上学。", "Wǒ zuìjìn qù shàngxué."), R("我上六年级。", "Wǒ shàng liù niánjí.")], c: 0 },
  { q: R("闹钟一响，你就做什么？", "Nàozhōng yì xiǎng, nǐ jiù zuò shénme?"), a: [R("我一闹钟就七点。", "Wǒ yí nàozhōng jiù qī diǎn."), R("我就起床。", "Wǒ jiù qǐchuáng."), R("我才放学。", "Wǒ cái fàngxué."), R("我以前闹钟。", "Wǒ yǐqián nàozhōng.")], c: 1 },
  { q: R("你一回家就做作业吗？", "Nǐ yì huí jiā jiù zuò zuòyè ma?"), a: [R("是，我一回家就做作业。", "Shì, wǒ yì huí jiā jiù zuò zuòyè."), R("是，我先回家才放学。", "Shì, wǒ xiān huí jiā cái fàngxué."), R("不，我每天回家吗？", "Bù, wǒ měitiān huí jiā ma?"), R("是，我最近住在哪里。", "Shì, wǒ zuìjìn zhù zài nǎlǐ.")], c: 0 },
  { q: R("你一放学就回家吗？", "Nǐ yí fàngxué jiù huí jiā ma?"), a: [R("对，我一上学就放学。", "Duì, wǒ yí shàngxué jiù fàngxué."), R("我放学是四点。", "Wǒ fàngxué shì sì diǎn."), R("星期二不，我先打乒乓球。", "Xīngqī'èr bù, wǒ xiān dǎ pīngpāngqiú."), R("我会放学，但是不太会。", "Wǒ huì fàngxué, dànshì bú tài huì.")], c: 2 },
  { q: R("星期二放学以后，小美先做什么？", "Xīngqī'èr fàngxué yǐhòu, Xiǎoměi xiān zuò shénme?"), a: [R("她先打乒乓球。", "Tā xiān dǎ pīngpāngqiú."), R("她九点才起床。", "Tā jiǔ diǎn cái qǐchuáng."), R("她先吃早饭。", "Tā xiān chī zǎofàn."), R("她一回家就睡觉。", "Tā yì huí jiā jiù shuìjiào.")], c: 0 },
  { q: R("小美星期二几点才回家？", "Xiǎoměi xīngqī'èr jǐ diǎn cái huí jiā?"), a: [R("她七点起床。", "Tā qī diǎn qǐchuáng."), R("她四点放学。", "Tā sì diǎn fàngxué."), R("她六点才回家。", "Tā liù diǎn cái huí jiā."), R("她九点睡觉。", "Tā jiǔ diǎn shuìjiào.")], c: 2 },
  { q: R("周末也七点起床吗？", "Zhōumò yě qī diǎn qǐchuáng ma?"), a: [R("对，平日九点起床。", "Duì, píngrì jiǔ diǎn qǐchuáng."), R("不，周末九点起床。", "Bù, zhōumò jiǔ diǎn qǐchuáng."), R("不，我九点放学。", "Bù, wǒ jiǔ diǎn fàngxué."), R("对，我周末上六年级。", "Duì, wǒ zhōumò shàng liù niánjí.")], c: 1 },
  { q: R("平日和周末哪里不一样？", "Píngrì hé zhōumò nǎlǐ bù yíyàng?"), a: [R("平日我七点起床，周末九点起床。", "Píngrì wǒ qī diǎn qǐchuáng, zhōumò jiǔ diǎn qǐchuáng."), R("平日是六年级，周末是十二岁。", "Píngrì shì liù niánjí, zhōumò shì shí'èr suì."), R("平日我叫小美，周末住北京。", "Píngrì wǒ jiào Xiǎoměi, zhōumò zhù Běijīng."), R("平日以前，周末最近。", "Píngrì yǐqián, zhōumò zuìjìn.")], c: 0 },
  { q: R("七点一刻是几点？", "Qī diǎn yí kè shì jǐ diǎn?"), a: [R("七点十分。", "Qī diǎn shí fēn."), R("七点十五分。", "Qī diǎn shíwǔ fēn."), R("七点半。", "Qī diǎn bàn."), R("八点一刻。", "Bā diǎn yí kè.")], c: 1 },
  { q: R("你几点去上学？", "Nǐ jǐ diǎn qù shàngxué?"), a: [R("我八点去上学。", "Wǒ bā diǎn qù shàngxué."), R("我八点放学。", "Wǒ bā diǎn fàngxué."), R("我先去上学吗？", "Wǒ xiān qù shàngxué ma?"), R("上学以后是八点。", "Shàngxué yǐhòu shì bā diǎn.")], c: 0 },
  { q: R("回家以后，你马上做什么？", "Huí jiā yǐhòu, nǐ mǎshàng zuò shénme?"), a: [R("我马上做作业。", "Wǒ mǎshàng zuò zuòyè."), R("我六点才回家。", "Wǒ liù diǎn cái huí jiā."), R("我会回家。", "Wǒ huì huí jiā."), R("我最近十二岁。", "Wǒ zuìjìn shí'èr suì.")], c: 0 },
  { q: R("你晚上几点睡觉？", "Nǐ wǎnshang jǐ diǎn shuìjiào?"), a: [R("我晚上九点洗澡。", "Wǒ wǎnshang jiǔ diǎn xǐzǎo."), R("我十点半睡觉。", "Wǒ shí diǎn bàn shuìjiào."), R("我睡觉以前看书。", "Wǒ shuìjiào yǐqián kàn shū."), R("我周末比较轻松。", "Wǒ zhōumò bǐjiào qīngsōng.")], c: 1 },
  { q: R("睡觉以前，你做什么？", "Shuìjiào yǐqián, nǐ zuò shénme?"), a: [R("我起床以后刷牙。", "Wǒ qǐchuáng yǐhòu shuāyá."), R("我睡觉以前看书。", "Wǒ shuìjiào yǐqián kàn shū."), R("我一睡觉就起床。", "Wǒ yí shuìjiào jiù qǐchuáng."), R("我以前十点半。", "Wǒ yǐqián shí diǎn bàn.")], c: 1 },
  { q: R("你会做什么？", "Nǐ huì zuò shénme?"), a: [R("我会唱歌，也会画画。", "Wǒ huì chàng gē, yě huì huàhuà."), R("我的爱好是什么？", "Wǒ de àihào shì shénme?"), R("我以前常常。", "Wǒ yǐqián chángcháng."), R("我一唱歌就十二岁。", "Wǒ yì chàng gē jiù shí'èr suì.")], c: 0 },
  { q: R("你不太会做什么？", "Nǐ bú tài huì zuò shénme?"), a: [R("我不太会游泳。", "Wǒ bú tài huì yóuyǒng."), R("我不太喜欢十二岁。", "Wǒ bú tài xǐhuan shí'èr suì."), R("我最近不会什么？", "Wǒ zuìjìn bú huì shénme?"), R("我先不太会，最后爱好。", "Wǒ xiān bú tài huì, zuìhòu àihào.")], c: 0 },
  { q: R("你早上先刷牙，然后做什么？", "Nǐ zǎoshang xiān shuāyá, ránhòu zuò shénme?"), a: [R("然后我吃早饭。", "Ránhòu wǒ chī zǎofàn."), R("以前我刷牙。", "Yǐqián wǒ shuāyá."), R("最后我先起床。", "Zuìhòu wǒ xiān qǐchuáng."), R("我一早饭就上学。", "Wǒ yì zǎofàn jiù shàngxué.")], c: 0 },
  { q: R("为什么周末比较轻松？", "Wèishénme zhōumò bǐjiào qīngsōng?"), a: [R("因为我可以晚一点儿起床。", "Yīnwèi wǒ kěyǐ wǎn yìdiǎnr qǐchuáng."), R("所以我上六年级。", "Suǒyǐ wǒ shàng liù niánjí."), R("因为我叫小美吗？", "Yīnwèi wǒ jiào Xiǎoměi ma?"), R("最近我住在哪里。", "Zuìjìn wǒ zhù zài nǎlǐ.")], c: 0 }
].map((item, index) => ({ ...item, id: `d${index + 1}`, type: 2 }));

function sortQuestion(id, en, answer, extras) {
  return { id, type: 3, en, answer, extras, sentence: Z(answer.map(t => t.z).join(""), answer.map(t => t.p).join(" ")) };
}

const sortPool = [
  sortQuestion("s1", "I am twelve this year.", [token("我", "wǒ"), token("今年", "jīnnián"), token("十二", "shí'èr"), token("岁", "suì")], [token("最近", "zuìjìn"), token("年级", "niánjí")]),
  sortQuestion("s2", "I live in Beijing.", [token("我", "wǒ"), token("住", "zhù"), token("在", "zài"), token("北京", "Běijīng")], [token("上", "shàng"), token("最近", "zuìjìn")]),
  sortQuestion("s3", "I am in sixth grade.", [token("我", "wǒ"), token("上", "shàng"), token("六", "liù"), token("年级", "niánjí")], [token("住", "zhù"), token("十二", "shí'èr")]),
  sortQuestion("s4", "My hobby is drawing.", [token("我", "wǒ"), token("的", "de"), token("爱好", "àihào"), token("是", "shì"), token("画画", "huàhuà")], [token("会", "huì"), token("最近", "zuìjìn")]),
  sortQuestion("s5", "I like drawing and can also sing.", [token("我", "wǒ"), token("喜欢", "xǐhuan"), token("画画", "huàhuà"), token("也", "yě"), token("会", "huì"), token("唱歌", "chàng gē")], [token("但是", "dànshì"), token("以前", "yǐqián")]),
  sortQuestion("s6", "I can sing, but I cannot swim very well.", [token("我", "wǒ"), token("会", "huì"), token("唱歌", "chàng gē"), token("但是", "dànshì"), token("不", "bú"), token("太", "tài"), token("会", "huì"), token("游泳", "yóuyǒng")], [token("也", "yě"), token("喜欢", "xǐhuan")]),
  sortQuestion("s7", "Before, I could not swim very well; now I can swim.", [token("以前", "yǐqián"), token("我", "wǒ"), token("不", "bú"), token("太", "tài"), token("会", "huì"), token("游泳", "yóuyǒng"), token("现在", "xiànzài"), token("我", "wǒ"), token("会", "huì"), token("游泳", "yóuyǒng"), token("了", "le")], [token("最近", "zuìjìn"), token("最后", "zuìhòu")]),
  sortQuestion("s8", "Recently, I often read with friends.", [token("最近", "zuìjìn"), token("我", "wǒ"), token("常常", "chángcháng"), token("跟", "gēn"), token("朋友", "péngyou"), token("一起", "yìqǐ"), token("看书", "kàn shū")], [token("以前", "yǐqián"), token("才", "cái")]),
  sortQuestion("s9", "Please introduce yourself.", [token("请", "qǐng"), token("介绍", "jièshào"), token("你", "nǐ"), token("自己", "zìjǐ")], [token("爱好", "àihào"), token("最近", "zuìjìn")]),
  sortQuestion("s10", "I get up at seven every day.", [token("我", "wǒ"), token("每天", "měitiān"), token("七点", "qī diǎn"), token("起床", "qǐchuáng")], [token("放学", "fàngxué"), token("周末", "zhōumò")]),
  sortQuestion("s11", "After getting up, I first brush my teeth.", [token("起床", "qǐchuáng"), token("以后", "yǐhòu"), token("我", "wǒ"), token("先", "xiān"), token("刷牙", "shuāyá")], [token("以前", "yǐqián"), token("最后", "zuìhòu")]),
  sortQuestion("s12", "I first brush my teeth, then eat breakfast.", [token("我", "wǒ"), token("先", "xiān"), token("刷牙", "shuāyá"), token("然后", "ránhòu"), token("吃", "chī"), token("早饭", "zǎofàn")], [token("以前", "yǐqián"), token("最后", "zuìhòu")]),
  sortQuestion("s13", "I first brush my teeth, then eat breakfast, and finally go to school.", [token("我", "wǒ"), token("先", "xiān"), token("刷牙", "shuāyá"), token("然后", "ránhòu"), token("吃", "chī"), token("早饭", "zǎofàn"), token("最后", "zuìhòu"), token("去", "qù"), token("上学", "shàngxué")], [token("以前", "yǐqián"), token("才", "cái")]),
  sortQuestion("s14", "As soon as the alarm rings, I get up.", [token("闹钟", "nàozhōng"), token("一", "yì"), token("响", "xiǎng"), token("我", "wǒ"), token("就", "jiù"), token("起床", "qǐchuáng")], [token("才", "cái"), token("然后", "ránhòu")]),
  sortQuestion("s15", "As soon as I get home, I do my homework.", [token("我", "wǒ"), token("一", "yì"), token("回家", "huí jiā"), token("就", "jiù"), token("做", "zuò"), token("作业", "zuòyè")], [token("才", "cái"), token("以前", "yǐqián")]),
  sortQuestion("s16", "I go home after school.", [token("放学", "fàngxué"), token("以后", "yǐhòu"), token("我", "wǒ"), token("回家", "huí jiā")], [token("以前", "yǐqián"), token("上学", "shàngxué")]),
  sortQuestion("s17", "I take a shower at nine in the evening.", [token("我", "wǒ"), token("晚上", "wǎnshang"), token("九点", "jiǔ diǎn"), token("洗澡", "xǐzǎo")], [token("早上", "zǎoshang"), token("睡觉", "shuìjiào")]),
  sortQuestion("s18", "I go to sleep at ten thirty.", [token("我", "wǒ"), token("十点", "shí diǎn"), token("半", "bàn"), token("睡觉", "shuìjiào")], [token("起床", "qǐchuáng"), token("一刻", "yí kè")]),
  sortQuestion("s19", "On weekends, I get up a little later.", [token("周末", "zhōumò"), token("我", "wǒ"), token("起床", "qǐchuáng"), token("晚", "wǎn"), token("一点儿", "yìdiǎnr")], [token("平日", "píngrì"), token("早", "zǎo")]),
  sortQuestion("s20", "On weekdays I get up at seven, but on weekends I get up at nine.", [token("平日", "píngrì"), token("我", "wǒ"), token("七点", "qī diǎn"), token("起床", "qǐchuáng"), token("但是", "dànshì"), token("周末", "zhōumò"), token("我", "wǒ"), token("九点", "jiǔ diǎn"), token("起床", "qǐchuáng")], [token("最近", "zuìjìn"), token("最后", "zuìhòu")]),
  sortQuestion("s21", "On Tuesday, I do not go home after school.", [token("星期二", "Xīngqī'èr"), token("放学", "fàngxué"), token("以后", "yǐhòu"), token("我", "wǒ"), token("不", "bù"), token("回家", "huí jiā")], [token("上学", "shàngxué"), token("就", "jiù")]),
  sortQuestion("s22", "I first play table tennis and do not go home until six.", [token("我", "wǒ"), token("先", "xiān"), token("打", "dǎ"), token("乒乓球", "pīngpāngqiú"), token("六点", "liù diǎn"), token("才", "cái"), token("回家", "huí jiā")], [token("最后", "zuìhòu"), token("上学", "shàngxué")]),
  sortQuestion("s23", "What do you do immediately after getting home?", [token("回家", "huí jiā"), token("以后", "yǐhòu"), token("你", "nǐ"), token("马上", "mǎshàng"), token("做", "zuò"), token("什么", "shénme")], [token("以前", "yǐqián"), token("谁", "shéi")]),
  sortQuestion("s24", "Before going to sleep, I read.", [token("睡觉", "shuìjiào"), token("以前", "yǐqián"), token("我", "wǒ"), token("看书", "kàn shū")], [token("以后", "yǐhòu"), token("起床", "qǐchuáng")]),
  sortQuestion("s25", "After finishing my homework, I take a shower.", [token("做完", "zuòwán"), token("作业", "zuòyè"), token("以后", "yǐhòu"), token("我", "wǒ"), token("洗澡", "xǐzǎo")], [token("以前", "yǐqián"), token("上学", "shàngxué")]),
  sortQuestion("s26", "On weekends, I often exercise with friends.", [token("周末", "zhōumò"), token("我", "wǒ"), token("常常", "chángcháng"), token("跟", "gēn"), token("朋友", "péngyou"), token("一起", "yìqǐ"), token("运动", "yùndòng")], [token("平日", "píngrì"), token("才", "cái")]),
  sortQuestion("s27", "Before, I could not speak Chinese; now I can.", [token("以前", "yǐqián"), token("我", "wǒ"), token("不会", "bú huì"), token("说", "shuō"), token("中文", "Zhōngwén"), token("现在", "xiànzài"), token("我", "wǒ"), token("会", "huì"), token("了", "le")], [token("最近", "zuìjìn"), token("最后", "zuìhòu")]),
  sortQuestion("s28", "Recently, I often practise Chinese.", [token("最近", "zuìjìn"), token("我", "wǒ"), token("常常", "chángcháng"), token("练习", "liànxí"), token("中文", "Zhōngwén")], [token("以前", "yǐqián"), token("最后", "zuìhòu")]),
  sortQuestion("s29", "He first does homework, then reads, and finally sleeps.", [token("他", "tā"), token("先", "xiān"), token("做", "zuò"), token("作业", "zuòyè"), token("然后", "ránhòu"), token("看书", "kàn shū"), token("最后", "zuìhòu"), token("睡觉", "shuìjiào")], [token("以前", "yǐqián"), token("才", "cái")]),
  sortQuestion("s30", "As soon as she finishes school, she plays table tennis.", [token("她", "tā"), token("一", "yí"), token("放学", "fàngxué"), token("就", "jiù"), token("打", "dǎ"), token("乒乓球", "pīngpāngqiú")], [token("才", "cái"), token("最后", "zuìhòu")])
];

const levelInfo = {
  1: {
    title: "Word Choice",
    eyebrow: "Level 1 · Vocabulary",
    intro: "Read the Chinese word and choose its English meaning.",
    tips: ["Each question has four choices.", "A correct choice turns green.", "If you miss one, the correct answer appears before Next."],
    art: "words"
  },
  2: {
    title: "Conversation Challenge",
    eyebrow: "Level 2 · TOCFL-style replies",
    intro: "Read each Chinese question and choose the most natural reply.",
    tips: ["You will receive 20 random questions.", "Watch for answers that are grammatical but do not fit the question.", "Time, sequence, and before/now clues matter."],
    art: "assets/level-2-dialogue.jpg"
  },
  3: {
    title: "Build the Translation",
    eyebrow: "Level 3 · Word order",
    intro: "Turn the English sentence into Chinese by arranging individual word tiles.",
    tips: ["Every question includes two extra distractor words.", "Drag tiles with a mouse or finger; you can also tap to move them.", "Put the words in the answer area, then check your sentence."],
    art: "assets/level-3-sort.jpg"
  }
};

let levelSets = {};
let selectedQuestions = [];
let mastery = new Map();
let currentLevel = 0;
let currentIndex = 0;
let answered = false;
let selectedOption = null;
let sessionMode = "idle";
let reviewQueue = [];
let reviewIndex = 0;
let gameActive = false;
let suppressClickUntil = 0;
let pointerDrag = null;

function prepareVocabulary(q) {
  const choices = shuffle([q.en, ...q.foils]);
  return { ...q, choices, c: choices.indexOf(q.en) };
}

function resetSortState(q) {
  const correct = q.answer.map((part, index) => ({ ...part, id: `${q.id}-a${index}` }));
  const extras = q.extras.map((part, index) => ({ ...part, id: `${q.id}-x${index}` }));
  q.tokenMap = new Map([...correct, ...extras].map(part => [part.id, part]));
  q.correctIds = correct.map(part => part.id);
  q.answerIds = [];
  q.bankIds = shuffle([...q.correctIds, ...extras.map(part => part.id)]);
}

function startFullGame() {
  mastery = new Map();
  levelSets = {
    1: sample(vocabPool, 20).map(prepareVocabulary),
    2: sample(dialoguePool, 20).map(q => ({ ...q })),
    3: sample(sortPool, 20).map(q => ({ ...q }))
  };
  levelSets[3].forEach(resetSortState);
  selectedQuestions = [...levelSets[1], ...levelSets[2], ...levelSets[3]];
  sessionMode = "full";
  currentLevel = 1;
  currentIndex = 0;
  gameActive = true;
  showLevelIntro(1);
}

function renderWelcome() {
  gameActive = false;
  sessionMode = "idle";
  headerProgress.hidden = true;
  screen.innerHTML = `
    <section class="welcome-layout screen-enter">
      <div class="welcome-copy">
        <p class="eyebrow">A Chinese learning game · 60 questions</p>
        <h1>Welcome, <span>Chloe!</span></h1>
        <p class="lead">Review your Chinese profile and daily routine through words, conversation, and sentence building. Your final score is out of 100.</p>
        <div class="button-row">
          <button class="primary-button" id="startGame" type="button">Start the quest</button>
        </div>
      </div>
      <div class="level-preview-grid" aria-label="Game levels">
        <article class="level-preview"><div class="number">1</div><h3>Word Choice</h3><p>Match Chinese vocabulary with the right meaning.</p></article>
        <article class="level-preview"><div class="number">2</div><h3>Conversation</h3><p>Choose natural replies and avoid TOCFL-style traps.</p></article>
        <article class="level-preview"><div class="number">3</div><h3>Translation</h3><p>Drag word tiles into the correct Chinese order.</p></article>
      </div>
    </section>`;
  document.querySelector("#startGame").addEventListener("click", startFullGame);
  focusScreen();
}

function miniPair(z, p) {
  return `<div class="mini-card">${pairHTML(Z(z, p))}</div>`;
}

function showLevelIntro(level) {
  currentLevel = level;
  currentIndex = 0;
  headerProgress.hidden = true;
  const info = levelInfo[level];
  const art = info.art === "words"
    ? `<div class="intro-art level-one-art"><div class="word-orbit">${miniPair("爱好", "àihào")}${miniPair("最近", "zuìjìn")}${miniPair("起床", "qǐchuáng")}${miniPair("周末", "zhōumò")}</div></div>`
    : `<div class="intro-art"><img src="${info.art}" alt="Original illustrated learning scene for ${escapeHTML(info.title)}"></div>`;
  screen.innerHTML = `
    <section class="intro-layout screen-enter">
      <div>
        <p class="eyebrow">${escapeHTML(info.eyebrow)}</p>
        <h2>${escapeHTML(info.title)}</h2>
        <p class="lead">${escapeHTML(info.intro)}</p>
        <ul class="instruction-list">${info.tips.map(tip => `<li>${escapeHTML(tip)}</li>`).join("")}</ul>
        <button class="primary-button" id="beginLevel" type="button">Begin Level ${level}</button>
      </div>
      ${art}
    </section>`;
  document.querySelector("#beginLevel").addEventListener("click", () => {
    answered = false;
    selectedOption = null;
    renderCurrentQuestion();
  });
  focusScreen();
}

function getCurrentQuestion() {
  if (sessionMode === "review") return reviewQueue[reviewIndex];
  return levelSets[currentLevel][currentIndex];
}

function updateHeader(question) {
  headerProgress.hidden = false;
  if (sessionMode === "review") {
    headerLevel.textContent = "Mistake Review";
    headerCount.textContent = `${reviewIndex + 1} / ${reviewQueue.length}`;
    progressFill.style.width = `${((reviewIndex + 1) / reviewQueue.length) * 100}%`;
  } else {
    headerLevel.textContent = `Level ${question.type}`;
    headerCount.textContent = `${currentIndex + 1} / 20`;
    const overall = (question.type - 1) * 20 + currentIndex + 1;
    progressFill.style.width = `${(overall / 60) * 100}%`;
  }
}

function answeredCount() {
  return selectedQuestions.filter(q => mastery.has(q.id)).length;
}

function renderCurrentQuestion() {
  const q = getCurrentQuestion();
  updateHeader(q);
  if (q.type === 3) renderSortQuestion(q);
  else renderMultipleChoice(q);
  focusScreen();
}

function quizKicker(q) {
  const label = sessionMode === "review" ? "Review a missed question" : `Level ${q.type} · ${levelInfo[q.type].title}`;
  return `<div class="quiz-kicker"><span>${escapeHTML(label)}</span><span class="score-chip">${answeredCount()} / 60 answered</span></div>`;
}

function renderMultipleChoice(q) {
  const isVocab = q.type === 1;
  const options = isVocab ? q.choices : q.a;
  const prompt = isVocab ? pairHTML(q.word, "prompt-pair") : pairHTML(q.q, "prompt-pair");
  const label = isVocab ? "What does this word mean?" : "Choose the most natural reply.";
  screen.innerHTML = `
    <section class="quiz-wrap screen-enter">
      ${quizKicker(q)}
      <article class="question-card">
        <p class="question-label">${label}</p>
        <div class="prompt-pair">${prompt}</div>
        <div class="options-grid">
          ${options.map((option, index) => {
            const stateClass = answered && index === q.c ? "correct" : answered && index === selectedOption ? "wrong" : "";
            const content = isVocab ? escapeHTML(option) : pairHTML(option);
            return `<button class="option-button ${stateClass}" type="button" data-option="${index}" ${answered ? "disabled" : ""}>${content}</button>`;
          }).join("")}
        </div>
        ${answered ? feedbackHTML(q, selectedOption === q.c) : ""}
      </article>
    </section>`;
  document.querySelectorAll("[data-option]").forEach(button => {
    button.addEventListener("click", () => answerMultipleChoice(q, Number(button.dataset.option)));
  });
  bindNext();
}

function answerMultipleChoice(q, choice) {
  if (answered) return;
  answered = true;
  selectedOption = choice;
  mastery.set(q.id, choice === q.c);
  renderMultipleChoice(q);
}

function feedbackHTML(q, correct) {
  let correction = "";
  if (!correct) {
    correction = q.type === 1
      ? `Correct answer: <strong>${escapeHTML(q.en)}</strong>`
      : `Correct reply: ${pairHTML(q.a[q.c])}`;
  }
  return `<div class="feedback ${correct ? "good" : "bad"}" role="status">
    <div class="feedback-copy"><strong>${correct ? "Correct!" : "Not quite."}</strong><p>${correct ? "Nice work — you read the clue correctly." : correction}</p></div>
    <button class="primary-button" id="nextQuestion" type="button">Next</button>
  </div>`;
}

function renderSortQuestion(q) {
  screen.innerHTML = `
    <section class="quiz-wrap screen-enter">
      ${quizKicker(q)}
      <article class="question-card">
        <p class="question-label">Build the Chinese sentence.</p>
        <p class="translation-prompt">${escapeHTML(q.en)}</p>
        <p class="translation-help">Drag or tap each word. Two tiles do not belong.</p>
        <div class="drop-section">
          <div class="drop-label"><span>Your answer</span><span>${q.answerIds.length} words placed</span></div>
          <div id="answerZone" class="dropzone ${answered ? (mastery.get(q.id) ? "answer-correct" : "answer-wrong") : ""}" data-zone="answer" aria-label="Answer area"></div>
        </div>
        <div class="drop-section">
          <div class="drop-label"><span>Word bank</span><span>Includes 2 distractors</span></div>
          <div id="bankZone" class="dropzone bank" data-zone="bank" aria-label="Word bank"></div>
        </div>
        ${answered ? sortFeedbackHTML(q, mastery.get(q.id)) : `<div class="translation-actions"><button class="text-button" id="clearAnswer" type="button">Clear answer</button><button class="primary-button" id="checkAnswer" type="button">Check sentence</button></div>`}
      </article>
    </section>`;
  renderTokenZones(q);
  if (!answered) {
    document.querySelector("#clearAnswer").addEventListener("click", () => {
      q.bankIds = shuffle([...q.bankIds, ...q.answerIds]);
      q.answerIds = [];
      renderTokenZones(q);
      updatePlacedCount(q);
    });
    document.querySelector("#checkAnswer").addEventListener("click", () => checkSortAnswer(q));
  }
  bindNext();
}

function sortFeedbackHTML(q, correct) {
  return `<div class="feedback ${correct ? "good" : "bad"}" role="status">
    <div class="feedback-copy"><strong>${correct ? "Correct!" : "Not quite."}</strong><p>${correct ? "The sentence is in the right order." : `Correct order: ${pairHTML(q.sentence)}`}</p></div>
    <button class="primary-button" id="nextQuestion" type="button">Next</button>
  </div>`;
}

function tokenHTML(q, id, zone) {
  const part = q.tokenMap.get(id);
  return `<button class="word-token" type="button" draggable="${answered ? "false" : "true"}" data-token-id="${escapeHTML(id)}" data-location="${zone}" ${answered ? "disabled" : ""} aria-label="${escapeHTML(part.z)}, ${escapeHTML(part.p)}">${pairHTML(part)}</button>`;
}

function renderTokenZones(q) {
  const answerZone = document.querySelector("#answerZone");
  const bankZone = document.querySelector("#bankZone");
  if (!answerZone || !bankZone) return;
  answerZone.innerHTML = q.answerIds.length ? q.answerIds.map(id => tokenHTML(q, id, "answer")).join("") : `<div class="empty-hint">Drop words here</div>`;
  bankZone.innerHTML = q.bankIds.length ? q.bankIds.map(id => tokenHTML(q, id, "bank")).join("") : `<div class="empty-hint">All tiles are in your answer</div>`;
  if (!answered) bindDragAndTap(q);
}

function updatePlacedCount(q) {
  const count = document.querySelector(".drop-label span:last-child");
  if (count) count.textContent = `${q.answerIds.length} words placed`;
}

function moveToken(q, id, targetZone, targetIndex = null) {
  q.answerIds = q.answerIds.filter(item => item !== id);
  q.bankIds = q.bankIds.filter(item => item !== id);
  const target = targetZone === "answer" ? q.answerIds : q.bankIds;
  const index = targetIndex === null ? target.length : Math.max(0, Math.min(targetIndex, target.length));
  target.splice(index, 0, id);
  renderTokenZones(q);
  updatePlacedCount(q);
}

function bindDragAndTap(q) {
  document.querySelectorAll(".word-token").forEach(tile => {
    tile.addEventListener("click", () => {
      if (Date.now() < suppressClickUntil) return;
      const target = tile.dataset.location === "bank" ? "answer" : "bank";
      moveToken(q, tile.dataset.tokenId, target);
    });
    tile.addEventListener("dragstart", event => {
      event.dataTransfer.setData("text/plain", tile.dataset.tokenId);
      event.dataTransfer.effectAllowed = "move";
      tile.classList.add("is-dragging");
    });
    tile.addEventListener("dragend", () => tile.classList.remove("is-dragging"));
    tile.addEventListener("pointerdown", event => startPointerDrag(event, q, tile));
  });
  document.querySelectorAll(".dropzone").forEach(zone => {
    zone.addEventListener("dragover", event => {
      event.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", event => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      const id = event.dataTransfer.getData("text/plain");
      const index = findDropIndex(zone, event.clientX, event.clientY, id);
      moveToken(q, id, zone.dataset.zone, index);
    });
  });
}

function findDropIndex(zone, x, y, movingId) {
  const tiles = [...zone.querySelectorAll(".word-token")].filter(tile => tile.dataset.tokenId !== movingId);
  if (!tiles.length) return 0;
  for (let i = 0; i < tiles.length; i += 1) {
    const rect = tiles[i].getBoundingClientRect();
    if (y < rect.top + rect.height / 2 || (y <= rect.bottom && x < rect.left + rect.width / 2)) return i;
  }
  return tiles.length;
}

function startPointerDrag(event, q, tile) {
  if (event.pointerType === "mouse" && event.button !== 0) return;
  pointerDrag = {
    q,
    id: tile.dataset.tokenId,
    tile,
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    moved: false
  };
  tile.setPointerCapture?.(event.pointerId);
}

window.addEventListener("pointermove", event => {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
  const distance = Math.hypot(event.clientX - pointerDrag.startX, event.clientY - pointerDrag.startY);
  if (!pointerDrag.moved && distance < 8) return;
  event.preventDefault();
  if (!pointerDrag.moved) {
    pointerDrag.moved = true;
    pointerDrag.tile.classList.add("is-dragging");
    dragLayer.innerHTML = pointerDrag.tile.outerHTML;
    dragLayer.classList.add("active");
  }
  dragLayer.style.transform = `translate(${event.clientX + 12}px, ${event.clientY + 12}px)`;
}, { passive: false });

window.addEventListener("pointerup", event => {
  if (!pointerDrag || event.pointerId !== pointerDrag.pointerId) return;
  const drag = pointerDrag;
  pointerDrag = null;
  if (!drag.moved) return;
  event.preventDefault();
  dragLayer.classList.remove("active");
  dragLayer.innerHTML = "";
  drag.tile.classList.remove("is-dragging");
  suppressClickUntil = Date.now() + 400;
  const element = document.elementFromPoint(event.clientX, event.clientY);
  const zone = element?.closest?.(".dropzone");
  if (!zone) return;
  const index = findDropIndex(zone, event.clientX, event.clientY, drag.id);
  moveToken(drag.q, drag.id, zone.dataset.zone, index);
}, { passive: false });

window.addEventListener("pointercancel", () => {
  if (!pointerDrag) return;
  pointerDrag.tile.classList.remove("is-dragging");
  pointerDrag = null;
  dragLayer.classList.remove("active");
  dragLayer.innerHTML = "";
});

function checkSortAnswer(q) {
  if (answered) return;
  answered = true;
  const correct = q.answerIds.length === q.correctIds.length && q.answerIds.every((id, index) => id === q.correctIds[index]);
  mastery.set(q.id, correct);
  renderSortQuestion(q);
}

function bindNext() {
  const next = document.querySelector("#nextQuestion");
  if (next) next.addEventListener("click", advanceQuestion);
}

function advanceQuestion() {
  answered = false;
  selectedOption = null;
  if (sessionMode === "review") {
    reviewIndex += 1;
    if (reviewIndex >= reviewQueue.length) {
      showResults();
      return;
    }
    const next = reviewQueue[reviewIndex];
    if (next.type === 3) resetSortState(next);
    renderCurrentQuestion();
    return;
  }
  currentIndex += 1;
  if (currentIndex < 20) {
    renderCurrentQuestion();
    return;
  }
  if (currentLevel < 3) {
    showLevelIntro(currentLevel + 1);
    return;
  }
  showResults();
}

function startWrongReview() {
  reviewQueue = selectedQuestions.filter(q => mastery.get(q.id) !== true);
  if (!reviewQueue.length) return;
  reviewQueue = shuffle(reviewQueue);
  reviewIndex = 0;
  sessionMode = "review";
  answered = false;
  selectedOption = null;
  const first = reviewQueue[0];
  if (first.type === 3) resetSortState(first);
  gameActive = true;
  renderCurrentQuestion();
}

function showResults() {
  gameActive = false;
  headerProgress.hidden = true;
  const correct = selectedQuestions.filter(q => mastery.get(q.id) === true).length;
  const score = Math.round((correct / 60) * 100);
  const missed = 60 - correct;
  const stats = [1, 2, 3].map(level => {
    const totalCorrect = levelSets[level].filter(q => mastery.get(q.id) === true).length;
    return { level, correct: totalCorrect };
  });
  const message = score === 100
    ? "Perfect score — every lesson point is mastered!"
    : score >= 80
      ? "Strong work! A short mistake review can take you even higher."
      : score >= 60
        ? "Good progress. Review the missed clues and try them again."
        : "You have a clear next step: review the missed questions, one at a time.";
  screen.innerHTML = `
    <section class="results-layout screen-enter">
      <p class="eyebrow">Quest complete</p>
      <h2>Your final score</h2>
      <div class="score-ring" style="--score-angle:${score * 3.6}deg" aria-label="Score ${score} out of 100">
        <div class="score-value"><strong>${score}</strong><span>out of 100</span></div>
      </div>
      <p class="lead" style="margin-left:auto;margin-right:auto">${escapeHTML(message)}</p>
      <div class="result-grid">
        ${stats.map(stat => `<div class="result-card"><span>Level ${stat.level}</span><strong>${stat.correct} / 20</strong></div>`).join("")}
      </div>
      <div class="button-row">
        <button class="primary-button" id="retryWrong" type="button" ${missed ? "" : "disabled"}>${missed ? `Retry ${missed} missed` : "No missed questions"}</button>
        <button class="secondary-button" id="retryAll" type="button">Retry all</button>
        <button class="text-button" id="backHome" type="button">Back to welcome</button>
      </div>
    </section>`;
  document.querySelector("#retryWrong").addEventListener("click", startWrongReview);
  document.querySelector("#retryAll").addEventListener("click", startFullGame);
  document.querySelector("#backHome").addEventListener("click", renderWelcome);
  focusScreen();
}

function focusScreen() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  requestAnimationFrame(() => screen.focus({ preventScroll: true }));
}

homeButton.addEventListener("click", () => {
  if (gameActive && !window.confirm("Return to the welcome screen? Your current run will be lost.")) return;
  renderWelcome();
});

renderWelcome();
