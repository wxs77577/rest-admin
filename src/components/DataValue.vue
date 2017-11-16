<template>
  <div>
    <template v-if="['html'].includes(field.type)">
      <div v-html="value" class="p-2 data-value-html"></div>
    </template>

    <template v-else-if="['image'].includes(field.type)">
      <b-img-lazy :src="value" blank-color="#bbb" style="max-height:5em" />
    </template>

    <template v-else-if="['audio', 'video'].includes(field.type)">
      <component :is="field.type" :src="value" controls />
    </template>

    <template v-else-if="['switch', 'boolean', 'checkbox'].includes(field.type)">
      <b-badge :variant="value ? 'success' : 'danger'">
        {{value ? 'Yes' : 'No'}}
      </b-badge>
    </template>

    <template v-else-if="field.ref">
      <template v-if="field.multiple">
        {{_.map(_.get(model, field.ref.split('.')[0]), field.ref.split('.')[1]).join('，')}}
      </template>
      <template v-else>
        {{_.get(model, field.ref)}}
      </template>
    </template>

    <template v-else-if="name === '_id'">
      <span v-b-tooltip.hover.top.d100 :title="value">
        {{String(shortId ? value.substr(-4) : value).toUpperCase()}}
      </span>
    </template>

    <template v-else>
      {{value}}
    </template>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "b-data-value",
  props: {
    field: {
      required: true,
      type: Object
    },
    name: {
      required: true,
      type: String,
    },
    model: {
      required: true,
      type: Object
    },
    shortId: {
      required: false,
      type: Boolean,
      default: false
    },

  },
  computed: {
    value() {
      let value = this.model[this.name]
      if (this.field.options) {
        const options = _.mapValues(_.keyBy(this.field.options, 'value'), 'text')
        return options[value]
      }
      return value;
    }
  }
};
</script>

<style lang="scss">
.data-value-html {
  max-height: 500px;
  max-width: 420px;
  overflow-y: scroll;
  border: 1px solid #eee;

  p {
    img {
      max-width:100%;
    }
  }
}
</style>
