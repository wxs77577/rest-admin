import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
for (let name in Element) {
  const row = Element[name]
  if (typeof row !== 'object' || !row.name) {
    continue
  }
  Vue.component(`B${name}`, row)
}
Vue.component('BBtn', Element.Button)
Vue.use(Element)
