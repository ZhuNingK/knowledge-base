import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'
import { imgClick } from './imageTouchScale'


export default {
  extends: Theme,
  Layout: () => {
    return h(Theme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
    imgClick()
  },
  setup() {},
}