import Vue from 'vue'
import VueI18n from 'vue-i18n'
import inflection from 'inflection'

Vue.use(VueI18n)

const messages = {
  "en": require('./en.json'),
  "zh-CN": require('./zh-CN.json')
}

export default new VueI18n({
  locale: 'en',
  messages,
  silentTranslationWarn: true,
  missing(lang, key) {
    if (!key) {
      return
    }
    return inflection.titleize(key.replace(/^\w+\./, ''))
  }
})