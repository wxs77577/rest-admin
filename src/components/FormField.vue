<template>
      <b-form-select v-if="['select', 'select2'].includes(field.type) && !field.multiple" text-field="label" :value="getFormatter(field, model, key)(value)" :formatter="getFormatter(field, model, key)" :id="'input_' + key" v-bind="field" @input="value = arguments[0]" :title="value" />
      <!-- <b-select v-if="['select', 'select2'].includes(field.type)" label="label" v-bind="field" :value="value" @input="setSelectedValue(arguments[0], key)"></b-select> -->
      <!-- <b-multi-select v-if="['select', 'select2'].includes(field.type)" track-by="value" label="text" @input="value = arguments[0].value" :value="value" :id="'input_' + key" v-bind="field" :title="value" /> -->

      <b-form-radio-group v-else-if="['radiolist'].includes(field.type)" v-model="value">
        <b-form-radio :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-radio>
      </b-form-radio-group>

      <b-form-checkbox-group v-else-if="['checkboxlist'].includes(field.type)" v-model="value">
        <b-form-checkbox :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-checkbox>
      </b-form-checkbox-group>

      <b-form-textarea v-else-if="['textarea'].includes(field.type)" :id="'input_' + key" v-model="value" v-bind="field" :rows="field.rows || 3" />

      <!-- <b-uploader v-else-if="['image', 'file', 'audio'].includes(field.type)" :id="'input_' + key" v-model="value" v-bind="field" /> -->
      <div v-else-if="['image', 'file', 'audio', 'video'].includes(field.type)">

        <b-form-file :id="'input_' + key" v-model="value" v-bind="field" @input="upload(key)" />
        <div class="preview" v-show="value">
          <b-img v-if="['image'].includes(field.type)" :alt="value" :src="preview(value)" v-b-modal="'modal_input_' + key" class="my-2" center v-bind="field.preview" style="max-height: 300px;" />
          <component controls :is="field.type" v-else-if="['audio', 'video'].includes(field.type)" :alt="value" :src="preview(value)" v-b-modal="'modal_input_' + key" class="my-2" center v-bind="field.preview" style="max-height: 300px;"></component>
        </div>

        <b-modal :title="field.label" :id="'modal_input_' + key">
          <b-img :src="preview(value)" class="my-2" center fluid />
        </b-modal>
      </div>

      <b-switch variant="success" pill type="3d" v-else-if="['switch'].includes(field.type)" :id="'input_' + key" v-model="value" />

      <b-ueditor :state="!hasError(key)" v-else-if="['wysiwyg', 'html'].includes(field.type)" :id="'input_' + key" v-bind="field" v-model="value" />
      <!-- <b-wysiwyg :state="!hasError(key)" v-else-if="['wysiwyg', 'html'].includes(field.type)" :id="'input_' + key" v-bind="field" v-model="value" /> -->

      <b-form-input :state="!hasError(key)" v-else :id="'input_' + key" v-bind="field" v-model="value" :formatter="getFormatter(field, model, key)" />
</template>

<script>
  export default {
    props: {
      value: {},
      field: {}
    },
    methods: {
      
    }
  }
</script>
