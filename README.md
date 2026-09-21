# 邱超凡 · 个人作品集

一个使用原生 HTML、CSS 和 JavaScript 构建的个人作品集页面，适合在桌面端和移动端展示个人介绍、技能方向与项目作品。

## 本地运行

直接用浏览器打开 `index.html` 即可。

如果希望通过本地服务器访问，可以在当前目录执行：

```bash
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 文件结构

```text
.
├── index.html
├── css/
│   ├── base.css
│   ├── layout.css
│   └── components.css
├── js/
│   ├── theme.js
│   ├── projects.js
│   └── main.js
└── assets/
    └── images/
        ├── avatar.svg
        ├── favicon.svg
        └── projects/
```

## 如何新增项目

打开 `js/projects.js`，在 `window.PORTFOLIO_PROJECTS` 数组中增加一个对象即可。页面会自动完成编号、左右交替布局和类别筛选。下面以“轻记账”为例：

```js
{
  id: "qingjizhang",
  title: "轻记账",
  category: "微信小程序",
  tag: "移动应用",
  date: "2025 年 4 月",
  summary: "“轻记账”是一款面向日常生活场景的极简记账微信小程序。",
  stack: ["TypeScript", "微信小程序", "微信云开发", "ECharts"],
  image: "assets/images/projects/qingjizhang-cover.png",
  alt: "轻记账项目界面截图",
  featured: true,
  link: null
}
```

如果希望项目在页面中跳转，把 `link` 改成对应的 URL 即可。`featured` 设置为 `true` 时，该项目会以大图形式展示在作品区最前面。

`tag` 是显示在项目标题上方的简洁类别标签，例如“移动应用”“Web应用”“数据可视化”“AI应用”。

## 主题切换

页面左下方和移动端顶部栏提供日间 / 夜间模式切换按钮。主题状态保存在浏览器本地存储中，并由 `js/theme.js` 通过 `data-theme` 属性控制。

## 替换图片

当前项目封面为与项目内容对应的本地 PNG 界面截图。后续如果有真实项目截图，可以直接替换 `assets/images/projects/` 中的图片；建议图片比例为 16:10，尺寸控制在 1600 × 1000 左右，并在 `js/projects.js` 中同步更新 `image` 路径和 `alt` 描述。

## 字体

页面通过 Google Fonts 引入 `Inter` 和 `Noto Sans SC`，分别用于拉丁字符和中文正文；网络不可用时会自动回退到系统字体。
