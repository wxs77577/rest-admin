<template>
  <div class="break-all data-value">
    <template v-if="['html'].includes(field.type)">
      <div v-html="value" class="p-2 data-value-html"></div>
    </template>

    <template v-else-if="['image'].includes(field.type)">
      <template v-if="field.multiple">
        <b-img class="type-image" :key="v" v-for="v in value" :src="v" v-bind="field" @click.stop="previewInModal(v)"/>
      </template>
      <b-img class="type-image" v-else :src="value" v-bind="field" fluid @click.stop="previewInModal(value)"/>
    </template>

    <template v-else-if="['audio', 'video'].includes(field.type)">
      <component :is="field.type" :src="value" controls />
    </template>
    <template v-else-if="['file'].includes(field.type)">
      <a target="blank" :href="value" v-if="value">
        <i class="fa fa-file"></i> {{String(value).split('/').pop()}}
      </a>
      <div v-else class="text-muted">
        
      </div>
    </template>

    <template v-else-if="['switch', 'boolean', 'checkbox'].includes(field.type)">
      <b-badge :variant="value ? 'success' : 'danger'">
        {{value ? 'Yes' : 'No'}}
      </b-badge>
    </template>

    <template v-else-if="field.ref">
      <template v-if="field.multiple">
        {{_.map(_.get(model || {}, field.ref.split('.')[0]), field.ref.split('.')[1]).join('，')}}
      </template>
      <template v-else>
        {{_.get(model || {}, field.ref)}}
      </template>
    </template>

    <template v-else-if="name === '_id'">
      <span v-b-tooltip.hover.top.d100 :title="value">
        {{String(shortId ? value.substr(-4) : value).toUpperCase()}}
      </span>
    </template>
    <template v-else-if="field.type == 'datetime'">
      <span v-b-tooltip.hover.top.d100 :title="value">
        {{value | datetime}}
      </span>
    </template>
    

    <template v-else>
      {{value}}
    </template>

    <b-modal :title="field.label" v-model="showModal">
      <b-img :src="preview(previewValue)" class="my-2" center fluid />
    </b-modal>
  </div>
</template>

<script>
import _ from "lodash";

export default {
  name: "b-data-value",
  filters: {
    datetime(val) {
      return new Date(val).toLocaleDateString()
    }
  },
  data() {
    return {
      previewValue: null,
      showModal: false,
    }
  },
  props: {
    field: {
      required: true,
      type: Object
    },
    name: {
      required: true,
      type: String
    },
    model: {
      required: true,
      type: Object
    },
    shortId: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  computed: {
    value() {
      let value = _.get(this.model || {},this.name);
      if (!value) {
        return value
      }
      if (this.field.options) {
        const options = _.mapValues(
          _.keyBy(this.field.options, "value"),
          "text"
        );
        return options[value];
      }
      return value;
    }
  },
  methods: {
    previewInModal(value) {
      this.showModal = true
      this.previewValue = value
    },
    preview(file) {
      if (!file) {
        return;
      }
      if (typeof file === "string") {
        return file;
      }
      if (file instanceof File) {
        return URL.createObjectURL(file);
      }
      return ''
    }
  }
};
</script>

<style lang="scss">
.data-table td .modal-body img{
  max-height: inherit;
  max-width: 100%;
}
.data-value-html {
  max-height: 500px;
  max-width: 420px;
  overflow-y: scroll;
  border: 1px solid #eee;

  p {
    img {
      max-width: 100%;
    }
  }
}
.data-value {
  .type-image {
    max-width: 100%;
    max-height: 200px;

  }
}
</style>
