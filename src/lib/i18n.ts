import { Locale, locales } from "@/lib/types";

export const defaultLocale: Locale = "zh";

export const isLocale = (value: string): value is Locale =>
  locales.includes(value as Locale);

export const copy = {
  en: {
    siteName: "OpenCoco",
    tagline: "Prompt cases for GPT image2 and Nano Banana",
    nav: {
      home: "Home",
      cases: "Cases",
      favorites: "Favorites",
      admin: "Admin",
    },
    heroEyebrow: "Bilingual prompt library",
    heroTitle: "A Xiaohongshu-style prompt gallery for visual teams.",
    heroBody:
      "Collect high-signal prompts, distilled prompt patterns, and standout cases from GPT image2 and Nano Banana in one searchable feed.",
    heroPrimary: "Browse cases",
    heroSecondary: "Open admin",
    stats: [
      { label: "Prompt cases", value: "8+" },
      { label: "Models covered", value: "2" },
      { label: "Bilingual UI", value: "EN / 中文" },
    ],
    sections: {
      featured: "Featured feed",
      latest: "Latest additions",
      related: "Related cases",
      why: "What makes a good case",
    },
    filters: {
      all: "All",
      gpt: "GPT image2",
      nano: "Nano Banana",
      searchPlaceholder: "Search title, prompt, or tag",
    },
    cards: {
      featured: "Featured",
      source: "Source",
      viewCase: "View case",
      favorite: "Save",
      saved: "Saved",
      adTitle: "Sponsor spot",
      adBody:
        "This card style matches the feed so AdSense or brand promos can blend in without breaking the browsing rhythm.",
      adCta: "Ad card demo",
    },
    detail: {
      prompt: "Prompt",
      takeaways: "Why it works",
      metadata: "Case notes",
      model: "Model",
      tags: "Tags",
      source: "Source link",
      author: "Collected from",
      favoritesHint: "Sign in with Google to save this case.",
    },
    favorites: {
      title: "Your saved cases",
      body:
        "This page uses Google sign-in for favorites when Supabase is configured. Without it, the rest of the site still works in read-only mode.",
      empty: "No saved cases yet.",
      signIn: "Sign in with Google",
      missingConfig: "Supabase is not configured yet.",
    },
    admin: {
      loginTitle: "Admin login",
      loginBody:
        "Use the username and password from environment variables to manage cases.",
      username: "Username",
      password: "Password",
      submit: "Sign in",
      logout: "Sign out",
      dashboard: "Content dashboard",
      dashboardBody:
        "Create, edit, and remove prompt cases. In local mode this writes to the JSON seed file; in production you should connect Supabase.",
      create: "New case",
      save: "Save case",
      delete: "Delete",
      editing: "Editing",
    },
    footer:
      "OpenCoco is designed as a searchable, bilingual prompt inspiration feed with room for ads, SEO pages, and future curator workflows.",
  },
  zh: {
    siteName: "OpenCoco",
    tagline: "GPT image2 与 Nano Banana 提示词案例库",
    nav: {
      home: "首页",
      cases: "案例",
      favorites: "收藏",
      admin: "后台",
    },
    heroEyebrow: "中英双语提示词库",
    heroTitle: "做一个偏小红书风格的 AI 图片提示词案例站。",
    heroBody:
      "把 GPT image2 和 Nano Banana 的高质量提示词、实战案例、可复用套路整理成统一内容流，方便收藏、筛选和后续 SEO 扩张。",
    heroPrimary: "浏览案例",
    heroSecondary: "进入后台",
    stats: [
      { label: "案例数量", value: "8+" },
      { label: "模型类型", value: "2" },
      { label: "界面语言", value: "中 / EN" },
    ],
    sections: {
      featured: "精选信息流",
      latest: "最新收录",
      related: "相关案例",
      why: "什么样的案例更值得收录",
    },
    filters: {
      all: "全部",
      gpt: "GPT image2",
      nano: "Nano Banana",
      searchPlaceholder: "搜索标题、提示词或标签",
    },
    cards: {
      featured: "精选",
      source: "来源",
      viewCase: "查看案例",
      favorite: "收藏",
      saved: "已收藏",
      adTitle: "赞助位示意",
      adBody:
        "这里展示首页信息流广告卡片的样式思路。后续接入 Google 广告时，可以保持和普通案例卡片一致的视觉节奏。",
      adCta: "广告卡片示意",
    },
    detail: {
      prompt: "提示词",
      takeaways: "为什么有效",
      metadata: "案例信息",
      model: "模型",
      tags: "标签",
      source: "来源链接",
      author: "采集来源",
      favoritesHint: "使用 Google 登录后可收藏此案例。",
    },
    favorites: {
      title: "我的收藏",
      body:
        "这里会在配置 Supabase 后启用 Google 登录收藏。即使还没配置，站点其余部分也能本地和线上只读运行。",
      empty: "还没有收藏案例。",
      signIn: "使用 Google 登录",
      missingConfig: "当前尚未配置 Supabase。",
    },
    admin: {
      loginTitle: "后台登录",
      loginBody: "使用环境变量中的账号密码进入后台管理案例内容。",
      username: "用户名",
      password: "密码",
      submit: "登录",
      logout: "退出登录",
      dashboard: "内容管理后台",
      dashboardBody:
        "可新增、编辑、删除案例。本地模式会写入 JSON 种子文件；正式上线建议接入 Supabase 持久化。",
      create: "新建案例",
      save: "保存案例",
      delete: "删除",
      editing: "正在编辑",
    },
    footer:
      "OpenCoco 的首版重点是双语内容流、提示词详情、收藏链路和后台扩展能力，方便后续加 SEO 专题页与广告。",
  },
} as const;

export const getCopy = (locale: Locale) => copy[locale];
