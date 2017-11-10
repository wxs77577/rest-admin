<template>
  <div :id="id" type="text/plain">
  </div>
</template>

<script>
import '../../static/ueditor/ueditor.config'
import '../../static/ueditor/ueditor.all'
import '../../static/ueditor/lang/zh-cn/zh-cn'
import '../../static/ueditor/ueditor.parse.min'
import '../../static/ueditor/xiumi-ue-dialog-v5.js'
import '../../static/ueditor/xiumi-ue-v5.css'

import { mapState } from 'vuex'
import $ from 'jquery'
window.$ = $

export default {

  props: {
    id: {},
    value: {
      default: ''
    },
  },
  computed: {
    ...mapState(['config', 'auth'])
  },
  data() {
    return {
      editor: null
    }
  },
  watch: {
    '$route': 'init',
  },
  methods: {
    handleChange({ target: { checked } }) {
      this.$emit('change', checked ? this.value : this.uncheckedValue)
    },
    update(event) {
      this.$emit('input', event.target.value)
    },
    init() {
      const editor = UE.getEditor(this.id, {
        UEDITOR_HOME_URL: '/static/ueditor/',
        toolbars: [
          [
            'fullscreen', 'source', 'undo', 'redo', 'bold', 'fontsize',
            'simpleupload', //单图上传
            'insertimage', //多图上传
            'link', //超链接
            'insertvideo', //视频
            'justifyleft', //居左对齐
            'justifyright', //居右对齐
            'justifycenter', //居中对齐
            'justifyjustify', //两端对齐
            'forecolor', //字体颜色
        'backcolor', //背景色
          ]
        ],
        serverUrl: this.config.apiUri + 'ueditor?token=' + this.auth.token,
      })
      this.editor = editor
      editor.addListener('contentchange', () => {
        this.$emit('input', editor.getContent())
      })
      editor.ready(() => {
        editor.setContent(this.value)
        // editor.execCommand('serverparam', 'token', this.auth.token);
      })
    },
    refresh() {
      setTimeout(this.init, 200)
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  mounted() {
    this.init()
  }
}
</script>

<style>
.edui-default .edui-editor {
  border-radius: 0 !important;
}

.edui-default .edui-editor-breadcrumb span {
  color: #666 !important;
}
</style>
