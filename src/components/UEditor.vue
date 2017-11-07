<template>
  <script :id="id" type="text/plain"></script>
</template>

<script>
import 'ueditor-static/ueditor.config'
import 'ueditor-static/ueditor.all.min'
import 'ueditor-static/lang/zh-cn/zh-cn'
// import 'ueditor-static/ueditor.parse.min'

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
  methods: {
    handleChange ({ target: { checked } }) {
      this.$emit('change', checked ? this.value : this.uncheckedValue)
    },
    update(event){
      this.$emit('input', event.target.value)
    },
    init(){
      const editor = UE.getEditor(this.id);
      editor.addListener('contentchange',() => {
        this.$emit('input', editor.getContent())
      });
      this.editor = editor
    }
  },
  created(){
    this.init()
  }
}
</script>

<style>
.edui-default .edui-editor{
  border-radius: 0;
}
</style>
