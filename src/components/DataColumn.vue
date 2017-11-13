<template>
  <div>
    <template v-if="['html'].includes(field.type)">
      <div v-html="value"></div>
    </template>

    <template v-else-if="['image'].includes(field.type)">
      <img :src="value" />
    </template>

    <template v-else-if="['audio', 'video'].includes(field.type)">
      <component :is="field.type" :src="value" controls />
    </template>

    <template v-else-if="['switch', 'boolean', 'checkbox'].includes(field.type)">
      <b-badge :variant="value ? 'success' : 'danger'">
        {{String(!!value).toUpperCase()}}
      </b-badge>
    </template>

    <template v-else-if="field.ref">
      {{_.get(model, field.ref)}}
    </template>

    <template v-else-if="name === '_id'">
      <span v-b-tooltip.hover.top.d100 :title="value">
        {{value.substr(-4).toUpperCase()}}
      </span>
    </template>

    <template v-else>
      {{value}}
    </template>
  </div>
</template>

<script>
export default {
  name: 'b-data-column',
  props: {
    field: {},
    name: {},
    model: {},
    row: {}
  },
  computed: {
    value(){
      if (this.row) {
        return this.row.value
      }
      return this.model[name]
    }
  }
}
</script>