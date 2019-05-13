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

import ElField from '../components/form/Field'
import ElFields from '../components/form/Fields'
Vue.component('el-field', ElField)
Vue.component('el-fields', ElFields)
// 兼容之前的bootstrap-vue
Vue.component('b-form-group', Element.FormItem)
Vue.component('el-form-group', Element.FormItem)

const $messager = {}
'success error info warning'.split(' ').map(type => {
  $messager[type] = (message, title) => Vue.prototype.$message({type, title, message})
})
Vue.prototype.$messager = $messager
