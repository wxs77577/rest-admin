<template>
  <div :id="id" type="text/plain"></div>
</template>

<script>
import 'ueditor-static/ueditor.config'
import 'ueditor-static/ueditor.all.min'
import 'ueditor-static/lang/zh-cn/zh-cn'
import 'ueditor-static/ueditor.parse.min'
import '../../static/ueditor/xiumi-ue-dialog-v5.js'
import '../../static/ueditor/xiumi-ue-v5.css'

export default {
  
  props: {
    id: {},
    value: {
      default: ''
    },
  },
  computed: {
    
  },
  data(){
    return {
      editor: null
    }
  },
  watch: {
    '$route': 'init',
  },
  methods: {
    handleChange ({ target: { checked } }) {
      this.$emit('change', checked ? this.value : this.uncheckedValue)
    },
    update(event){
      this.$emit('input', event.target.value)
    },
    init(){
      const editor = UE.getEditor(this.id, {
        UEDITOR_HOME_URL: '/static/ueditor/',
        serverUrl: this.$config.apiUri + 'ueditor',
      })
      this.editor = editor
      editor.addListener('contentchange',() => {
        this.$emit('input', editor.getContent())
      })
      editor.ready(() => {
        editor.setContent(this.value)
      })
    },
    refresh(){
      setTimeout(this.init, 200)
    }
  },
  beforeDestroy(){
    this.editor.destroy()
  },
  mounted(){
    this.init()
  }
}
</script>

<style>
.edui-default .edui-editor{
  border-radius: 0 !important;
}
.edui-default .edui-editor-breadcrumb span{
  color:#666 !important;
}
</style>
