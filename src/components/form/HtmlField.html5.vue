<template>
  <component class="html-editor" :is="com" :content="String(value || '')" @change="$emit('input', arguments[0])"></component>
</template>

<script>
import VueHtml5EditorClass from "vue-html5-editor";

export default {
  components: {
    VueHtml5Editor: {}
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      com: 'span'
    }
  },
  created(){
    const VueHtml5Editor = new VueHtml5EditorClass(this.options)
    this.com = VueHtml5Editor
  }
}
</script>

<style>
.html-editor img{
  max-width: 100%;
}
</style>
