const ComponentContainer = require("@poyoho/vitepress-theme")
/**
 * @type {import('vitepress').UserConfig}
 */
module.exports = {
  lang: 'zh-CN',
  markdown: {
    lineNumbers: true,
    config (md) {
      md.use(ComponentContainer)
    }
  },

  themeConfig: {
    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    sidebar: {
      "/case": [
        {
          text: "case1",
          link: "/case/test",
        }
      ],
    }
  }
}
