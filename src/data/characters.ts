/** 原创居民的叙事美术设定，不参与计分，也不代表某类型必须有这些外表或爱好。 */
export interface CharacterDesign {
  hair:
    | "parted"
    | "bun"
    | "long"
    | "swept"
    | "crop"
    | "bob"
    | "waves"
    | "curls"
    | "spikes";
  hairColor: string;
  skin: string;
  coat: string;
  shade: string;
  accent: string;
  backdrop: string;
  outfit:
    | "waistcoat"
    | "apron"
    | "cloak"
    | "coat"
    | "overalls"
    | "smock"
    | "poncho"
    | "knit"
    | "jacket"
    | "dress";
  signature: string;
  traits: [string, string, string];
  greeting: string;
  habit: string;
}
export const CHARACTER_DESIGNS: Record<string, CharacterDesign> = {
  ISTJ: {
    hair: "parted",
    hairColor: "#57564b",
    skin: "#efc79d",
    coat: "#537b86",
    shade: "#365b65",
    accent: "#d5b771",
    backdrop: "#e4ece5",
    outfit: "waistcoat",
    signature: "分格档案册 · 铜钥匙",
    traits: ["细细记录", "参照经验", "守住约定"],
    greeting: "“先把走过的路记下来，明天就有迹可循。”",
    habit: "把落叶夹进写着日期的档案册，翻页时，腰间的小铜钥匙轻轻晃一下。",
  },
  ISFJ: {
    hair: "bun",
    hairColor: "#70584a",
    skin: "#f0c6a1",
    coat: "#819568",
    shade: "#546c4d",
    accent: "#e9bb77",
    backdrop: "#edf0db",
    outfit: "apron",
    signature: "温热的茶杯 · 补丁围裙",
    traits: ["记得细节", "回应需要", "安静陪伴"],
    greeting: "“茶还温着，先坐下歇一会儿吧。”",
    habit: "双手捧着刚泡好的茶，围裙口袋里放着给邻居缝补衣服的针线。",
  },
  INFJ: {
    hair: "long",
    hairColor: "#474f53",
    skin: "#eac29c",
    coat: "#738568",
    shade: "#475d4c",
    accent: "#c7b079",
    backdrop: "#e1e9db",
    outfit: "cloak",
    signature: "苔绿斗篷 · 枝头风铃",
    traits: ["静听弦外", "连接意义", "温柔定向"],
    greeting: "“听，风拐过这条小路时，声音会不一样。”",
    habit: "裹着宽大的苔绿斗篷，侧耳听枝杖上的小风铃，铃穗随风摇动。",
  },
  INTJ: {
    hair: "swept",
    hairColor: "#414656",
    skin: "#d6ab87",
    coat: "#626f9c",
    shade: "#3f496b",
    accent: "#d7bb74",
    backdrop: "#e2e5ef",
    outfit: "coat",
    signature: "折叠星图 · 黄铜望远镜",
    traits: ["串联线索", "独立推演", "铺出路径"],
    greeting: "“这几颗星之间，也许还藏着一条路线。”",
    habit: "一边展开深蓝星图，一边缓缓转动黄铜望远镜，寻找远处的连接。",
  },
  ISTP: {
    hair: "crop",
    hairColor: "#685449",
    skin: "#ddb18a",
    coat: "#628c88",
    shade: "#3e6566",
    accent: "#d8a16a",
    backdrop: "#e0eae3",
    outfit: "overalls",
    signature: "开口扳手 · 多格工具带",
    traits: ["动手验证", "观察反馈", "灵活修补"],
    greeting: "“让我试一下，看看是哪一处卡住了。”",
    habit: "卷起袖口，提着一把亮银扳手；工具带的小零件会随着试修动作轻碰。",
  },
  ISFP: {
    hair: "bob",
    hairColor: "#865a4a",
    skin: "#f1c99c",
    coat: "#b18a70",
    shade: "#865f53",
    accent: "#719179",
    backdrop: "#eee6dc",
    outfit: "smock",
    signature: "叶形调色盘 · 沾色画笔",
    traits: ["感受当下", "珍惜意义", "随心创作"],
    greeting: "“今天的苔藓，好像比昨天多了一点蓝。”",
    habit: "穿着沾了几块颜料的宽罩衫，举起画笔，对着叶形调色盘慢慢比色。",
  },
  INFP: {
    hair: "waves",
    hairColor: "#67536b",
    skin: "#efbd9e",
    coat: "#a080a5",
    shade: "#745b82",
    accent: "#e2bd76",
    backdrop: "#eee3ed",
    outfit: "poncho",
    signature: "月牙邮包 · 火漆信封",
    traits: ["珍视内心", "自由联想", "寻找共鸣"],
    greeting: "“有些还说不清的心情，可以先写进信里。”",
    habit:
      "披着不对称的淡紫短斗篷，把一封盖着火漆的信捧在手边，月牙邮包贴着身侧。",
  },
  INTP: {
    hair: "curls",
    hairColor: "#535e68",
    skin: "#d9b08d",
    coat: "#6d99a4",
    shade: "#496c7e",
    accent: "#d9c47e",
    backdrop: "#e0eaf0",
    outfit: "knit",
    signature: "缺一角的拼图 · 折页笔记",
    traits: ["追问原理", "容纳未定", "独立拆解"],
    greeting: "“如果把这块换个方向，会发生什么？”",
    habit:
      "头发有点蓬，毛衣袖口盖住手背；一手摊开折页笔记，一手试着转动拼图片。",
  },
  ESTP: {
    hair: "swept",
    hairColor: "#674d3f",
    skin: "#c99470",
    coat: "#bf7855",
    shade: "#8c523e",
    accent: "#e2bb72",
    backdrop: "#eee5d9",
    outfit: "jacket",
    signature: "红色路旗 · 旅行背包",
    traits: ["走近现场", "即刻尝试", "随势调整"],
    greeting: "“拐角有条新路，走过去看看？”",
    habit: "一只脚已经向前探出，背包扎得紧紧的，手里的小路旗向前一扬。",
  },
  ESFP: {
    hair: "curls",
    hairColor: "#8c6040",
    skin: "#ecc295",
    coat: "#d1a355",
    shade: "#9d763f",
    accent: "#87a078",
    backdrop: "#f2ebd4",
    outfit: "overalls",
    signature: "向日葵发夹 · 小相机",
    traits: ["投入体验", "分享鲜活", "回应身边"],
    greeting: "“这束光正好，一起把这一刻留下来吧！”",
    habit: "卷卷头发上别着一朵向日葵，举起小相机，拍完便向伙伴轻轻招手。",
  },
  ENFP: {
    hair: "waves",
    hairColor: "#9a6748",
    skin: "#f0c4a0",
    coat: "#c5a05c",
    shade: "#957448",
    accent: "#6d9d9c",
    backdrop: "#f0ebd8",
    outfit: "poncho",
    signature: "彩结风铃 · 口袋种子",
    traits: ["发现可能", "连接彼此", "跟随热情"],
    greeting: "“如果把这个点子种下去，会长出什么呢？”",
    habit:
      "披风上缝着不同颜色的小布片，高高提起彩结风铃，另一只手攥着一袋种子。",
  },
  ENTP: {
    hair: "spikes",
    hairColor: "#7a5545",
    skin: "#d6a67f",
    coat: "#a07862",
    shade: "#725246",
    accent: "#74a6a5",
    backdrop: "#ece3dc",
    outfit: "waistcoat",
    signature: "翻起的护目镜 · 发条小桥",
    traits: ["换个角度", "碰撞想法", "试搭新桥"],
    greeting: "“要不把这两样接在一起，试试看？”",
    habit:
      "护目镜推在额头上，蓬起的头发像刚冒出的点子；掌心的发条小桥还在轻轻转。",
  },
  ESTJ: {
    hair: "parted",
    hairColor: "#5f6156",
    skin: "#ddb58f",
    coat: "#5c8580",
    shade: "#3c625e",
    accent: "#d2ae72",
    backdrop: "#e0e9de",
    outfit: "waistcoat",
    signature: "木夹板 · 直角尺",
    traits: ["说清标准", "协调行动", "明确推进"],
    greeting: "“把这一段接好，大家就能一起往前走了。”",
    habit: "卷着衬衫袖口，一手扶木夹板、一手比画直角尺，把小路的接缝逐一看清。",
  },
  ESFJ: {
    hair: "bun",
    hairColor: "#8c5e4a",
    skin: "#e8b891",
    coat: "#b78373",
    shade: "#8e5d54",
    accent: "#d9ba77",
    backdrop: "#f0e4dc",
    outfit: "dress",
    signature: "格纹餐布 · 满满的面包篮",
    traits: ["记住偏好", "照顾连接", "约好相聚"],
    greeting: "“你喜欢的那一块，也替你留着呢。”",
    habit:
      "把格纹餐布铺平，提起装着不同小面包的藤篮，给刚来的邻居留出一个位置。",
  },
  ENFJ: {
    hair: "long",
    hairColor: "#65513f",
    skin: "#cd9975",
    coat: "#a89b61",
    shade: "#7b7249",
    accent: "#f1ce80",
    backdrop: "#eeecd9",
    outfit: "cloak",
    signature: "暖光提灯 · 编织肩带",
    traits: ["看见彼此", "凝聚意义", "邀请同行"],
    greeting: "“我把灯提高一点，我们一起看前面的路。”",
    habit:
      "长披肩的边缘随步子轻摆，把发着暖光的提灯往外送一点，让同行的人都能看清。",
  },
  ENTJ: {
    hair: "crop",
    hairColor: "#444e5b",
    skin: "#e2b996",
    coat: "#667c99",
    shade: "#405773",
    accent: "#d5b074",
    backdrop: "#e1e7ed",
    outfit: "coat",
    signature: "展开的蓝图 · 标记旗",
    traits: ["看向远处", "统整方案", "定下路线"],
    greeting: "“先把想去的地方画出来，再一起找条可走的路。”",
    habit: "站在展开的蓝图后，用小旗标记尚未完成的地方，长外套下摆随转身轻动。",
  },
};
