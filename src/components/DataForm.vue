<template>
  <b-card :header="resource">
    <div class="data-form">
      <b-form @submit.prevent="onSubmit">
        <legend v-if="model._id">Edit: {{model._id}}</legend>
        
        <b-form-group v-for="(field, key) in fields" v-if="!ignoredFields.includes(key)" :key="key" :label="field.label" :label-for="'input_' + key" :description="field.hint">
          
          <b-form-select v-if="['select', 'select2'].includes(field.type)"
          :id="'input_' + key" v-bind="field" v-model="model[key]" :title="model[key]" /> 

          <b-form-radio-group v-else-if="['radiolist'].includes(field.type)" v-model="model[key]">
            <b-form-radio :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-radio>
          </b-form-radio-group>

          <b-form-checkbox-group v-else-if="['checkboxlist'].includes(field.type)" v-model="model[key]">
            <b-form-checkbox :key="choice.value" :value="choice.value" v-for="choice in field.options">{{choice.text}}</b-form-checkbox>
          </b-form-checkbox-group>

          <b-form-textarea v-else-if="['textarea'].includes(field.type)" :id="'input_' + key" v-model="model[key]" v-bind="field" :rows="field.rows || 3" />

          <template v-else-if="['image', 'file', 'audio'].includes(field.type)">
            <b-form-file :id="'input_' + key" v-model="model[key]" v-bind="field" />
            <b-img v-show="model[key]" :alt="model[key]" :src="preview(model[key])" v-b-modal="'modal_input_' + key" class="my-2" center v-bind="field.preview" />
            <b-modal :title="field.label" :id="'modal_input_' + key">
              <b-img :src="preview(model[key])" class="my-2" center fluid />
            </b-modal>
          </template>

          <b-switch variant="success" pill type="3d" v-else-if="['switch'].includes(field.type)" :id="'input_' + key" v-model="model[key]" />

          <b-form-input v-else :id="'input_' + key" v-model="model[key]" />

        </b-form-group>

        <b-button type="submit" variant="primary">保存</b-button>
        <b-button type="button" variant="secondary" @click="$router.go(-1)">返回</b-button>
      </b-form>
    </div>
  </b-card>
</template>

<script>

export default {
  name: "b-data-form",
  components: {

  },
  props: {
    ignoredFields: {
      type: Array,
      default() {
        return ['_id', 'created_at', 'updated_at', 'actions']
      },
      required: false
    },
    resource: {
      type: String,
      required: true
    },
    id: {
      required: true
    },
    formPath: {
      type: String,
      default: "form",
      required: false
    }
  },
  data() {
    return {
      choices: {},
      fields: {},
      model: {}
    };
  },
  computed: {
    resourceUri() {
      return this.resource + "/" + this.id;
    },
    formUri() {
      return this.resource + "/" + this.formPath;
    },
    isNew() {
      return !this.id
    },
    method() {
      return this.isNew ? 'post' : 'put'
    }
  },
  methods: {
    fetch() {
      this.$http.get(this.resourceUri).then(({ data }) => {
        this.model = data;
      });
    },
    fetchForm() {
      this.$http.get(this.formUri).then(({ data }) => {
        this.fields = data.fields;
        this.choices = data.choices;
      });
    },
    preview(file) {
      if (!file) {
        return
      }
      if (typeof file === 'string') {
        return file
      }
      return URL.createObjectURL(file)
    },
    onSubmit() {
      this.$http[this.method](this.resourceUri, this.model).then(({ data }) => {
        this.model = data
        this.$notify('保存成功')
        this.$router.go(-1)
      })
    }
  },
  created() {
    this.fetchForm();
    this.fetch();
  }
};
</script>

