import { defineConfig } from "vitepress";
import nav from "./nav.mts";
import createSidebar from "./menu/index.mts";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ignoreDeadLinks: true,
  title: "一只小康康",
  description: "Learn Documents",
  lang: 'zh-CN',
  lastUpdated: true,

  head: [
    ["link", { rel: "icon", href: "/static/favicon.ico" }],
    [
      'meta',
      {
        'http-equiv': 'cache-control',
        content: 'no-cache,no-store, must-revalidate',
      },
    ],
    ['meta', { 'http-equiv': 'pragma', content: 'no-cache' }],
    ['meta', { 'http-equiv': 'Expires', content: '0' }],

  ],


  markdown: {
    theme: 'vitesse-light',
    lineNumbers: true,
    headers: {
      level: [1, 2, 3, 4, 5, 6],
    },
    // anchor: {
    //   slugify(str) {
    //     return encodeURIComponent(str);
    //   },
    // },
    // Ensure links to headers work correctly
    toc: {
      level: [1, 2, 3, 4, 5, 6],
    },
  },


  themeConfig: {
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },

    lastUpdated: {
      text: '最后更新',
    },

    outline: 'deep',
    outlineTitle: '文章目录',
    logo: "/logo.png",

    editLink: {
      pattern: '',
      text: 'Edit this page on Gitlab',
    },

    docFooter: {
      prev: "上一页",
      next: "下一页",
    },

    nav: nav(),
    sidebar: createSidebar(),

    socialLinks: [
      {
        icon: {
          svg: '<svg t="1718128952090" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2107" width="200" height="200"><path d="M512 1024C229.222 1024 0 794.778 0 512S229.222 0 512 0s512 229.222 512 512-229.222 512-512 512z m17.067-413.525c34.85 4.352 68.778 5.12 102.741 2.099 23.04-2.048 44.817-8.363 64.17-21.914 38.213-26.794 49.784-85.197 24.252-123.05-14.626-21.71-36.812-30.345-60.757-35.5-35.055-7.543-70.451-5.75-105.847-3.412-5.667 0.358-6.759 3.072-7.237 8.209-3.072 32.682-6.536 65.314-9.813 97.962-2.509 24.815-4.932 49.63-7.51 75.606z m53.401-33.929c1.963-20.907 3.635-39.339 5.427-57.77 1.554-15.907 3.414-31.779 4.728-47.702 0.358-4.284 1.553-6.656 5.956-6.383 15.616 1.041 31.71 0.034 46.729 3.652 36.488 8.824 48.725 54.307 23.347 83.03-15.82 17.903-36.762 23.586-59.256 25.088-8.465 0.546-17.015 0.085-26.93 0.085zM512 434.296c-2.185-0.65-3.533-1.178-4.932-1.434-37.718-6.878-75.69-8.329-113.647-2.816-20.975 3.038-41.011 9.489-57.48 23.33-22.99 19.32-21.641 46.848 4.402 62.003 13.056 7.595 28.024 12.51 42.599 17.289 14.08 4.608 28.996 6.826 43.144 11.264 12.596 3.925 14.012 14.319 3.584 22.306-3.345 2.56-7.44 5.086-11.537 5.751-11.195 1.826-22.698 4.386-33.826 3.567-24.098-1.775-48.042-5.461-72.55-8.43-1.366 10.615-2.936 23.09-4.557 35.942 4.181 1.365 7.68 2.73 11.264 3.618 33.946 8.5 68.386 9.608 102.912 5.12 20.087-2.611 39.475-7.902 56.695-19.03 28.604-18.483 36.694-57.19-4.676-75.383-14.506-6.383-30.19-10.41-45.482-15.087-11.418-3.481-23.314-5.615-34.526-9.523-9.78-3.413-11.145-12.203-3.038-18.398 4.659-3.55 10.718-6.997 16.384-7.373a480.853 480.853 0 0 1 53.384-0.853c15.377 0.7 30.652 3.55 46.49 5.53L512 434.295z m257.143 2.047l-18.21 177.955h54.153c4.779-45.637 9.71-90.727 14.063-135.885 0.614-6.366 2.355-8.84 8.687-9.011 11.434-0.273 22.886-1.98 34.287-1.57 23.722 0.853 42.393 9.727 38.4 43.263-2.902 24.27-5.598 48.572-8.244 72.875-1.092 10.07-1.826 20.19-2.73 30.413h55.33c3.584-35.26 7.987-70.059 10.496-104.994 3.413-47.463-17.766-73.319-64.683-80.214-40.96-6.007-81.34-0.34-121.549 7.134zM285.645 570.948c-8.738 1.297-16.384 2.8-24.098 3.482-25.652 2.236-51.32 3.942-76.305-4.267-13.91-4.59-24.679-12.578-29.799-25.958-7.902-20.702 0.888-47.104 19.832-60.314 17.374-12.117 37.717-15.923 58.453-15.923 22.545-0.017 45.09 2.423 68.233 3.84l5.239-39.51c-15.07-1.723-29.491-3.925-43.998-4.915-41.011-2.798-80.64 2.612-117.47 20.463-30.02 14.558-52.053 36.011-58.675 68.13-7.85 38.145 11.537 69.496 51.763 85.846 19.15 7.765 39.288 12.51 60.007 12.595 24.746 0.102 49.493-1.57 74.206-2.952 3.106-0.171 8.311-2.902 8.67-5.035 1.98-11.554 2.73-23.28 3.942-35.465z" fill="#DD1700" p-id="2108"></path></svg>'
        },
        link: "",
      },
      {
        icon: {
          svg: '<svg t="1718103249353" class="icon" viewBox="0 0 1316 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4482" width="200" height="200"><path d="M643.181714 247.698286l154.916572-123.172572L643.181714 0.256 643.072 0l-154.660571 124.269714 154.660571 123.245715 0.109714 0.182857z m0 388.461714h0.109715l399.579428-315.245714-108.361143-87.04-291.218285 229.888h-0.146286l-0.109714 0.146285L351.817143 234.093714l-108.251429 87.04 399.433143 315.136 0.146286-0.146285z m-0.146285 215.552l0.146285-0.146286 534.893715-422.034285 108.397714 87.04-243.309714 192L643.145143 1024 10.422857 525.056 0 516.754286l108.251429-86.893715L643.035429 851.748571z" fill="#1E80FF" p-id="4483"></path></svg>'
        },
        link: "",
      },
      {
        icon: {
          svg: '<svg t="1718103377428" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5619" width="200" height="200"><path d="M290.0992 409.6H155.136a371.4048 371.4048 0 0 0-14.2848 102.4c0 35.5328 4.9664 69.888 14.336 102.4h134.9632c-5.632-32.768-8.4992-66.9184-8.4992-102.4 0-35.4816 2.8672-69.632 8.4992-102.4z m52.0704 0a542.1056 542.1056 0 0 0-9.3696 102.4c0 35.7376 3.072 69.888 9.3696 102.4H486.4V409.6H342.1696z m75.008 461.3632A491.8784 491.8784 0 0 1 301.568 665.6H173.9776a372.0704 372.0704 0 0 0 243.2 205.3632z m69.2224-3.584V665.6H354.9696c24.064 77.1072 67.84 144.2304 131.4304 201.8304zM417.1776 153.088A372.0704 372.0704 0 0 0 173.9776 358.4H301.568a491.8784 491.8784 0 0 1 115.5584-205.3632z m69.2224 3.584C422.8096 214.1184 379.0848 281.2416 354.9696 358.4H486.4V156.5696zM733.9008 409.6c5.632 32.768 8.4992 66.9184 8.4992 102.4 0 35.4816-2.8672 69.632-8.4992 102.4h135.0144c9.3184-32.512 14.2848-66.8672 14.2848-102.4s-4.9664-69.888-14.336-102.4h-134.9632z m-52.0704 0H537.6v204.8h144.2304c6.2464-32.512 9.3696-66.6624 9.3696-102.4s-3.072-69.888-9.3696-102.4z m-75.008 461.3632A372.0704 372.0704 0 0 0 850.0224 665.6H722.432a491.8784 491.8784 0 0 1-115.5584 205.3632z m-69.2224-3.584c63.5904-57.5488 107.3152-124.672 131.4304-201.7792H537.6v201.8304zM606.8224 153.088A491.8784 491.8784 0 0 1 722.432 358.4h127.6416a372.0704 372.0704 0 0 0-243.2-205.3632z m-69.2224 3.584V358.4h131.4304c-24.064-77.1072-67.84-144.2304-131.4304-201.8304zM512 947.2a435.2 435.2 0 1 1 0-870.4 435.2 435.2 0 0 1 0 870.4z" fill="#5A5A68" p-id="5620"></path></svg>'
        },
        link: ""
      },
      {
        icon: 'github',
        link: ""
      }
    ],

    footer: {
      copyright: "牛马康康 © 2025-present",
      message: "MIT Licensed",
    },
  },

  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },

});