<template>
  <div class="data-form">
    <b-form @submit="onSubmit">
      <legend v-if="model._id">Edit: {{model._id}}</legend>
      <b-form-group v-for="(field, key) in fields" v-if="!ignoredFields.includes(key)" :key="key"
                    :label="field.label"  :label-for="'input_' + key"
                    :description="field.hint">
        
        <b-form-select v-if="['select', 'select2'].includes(field.type)" 
        :id="'input_' + key" v-bind="field" v-model="model[key]" />

        <b-form-radio-group v-else-if="['radiolist'].includes(field.type)" v-model="model[key]">
          <b-form-radio :key="choice.value" :value="choice.value" v-for="choice in field.choices">{{choice.text}}</b-form-radio>
        </b-form-radio-group>
        
        <b-form-checkbox-group v-else-if="['checkboxlist'].includes(field.type)" v-model="model[key]">
          <b-form-checkbox :key="choice.value" :value="choice.value" v-for="choice in field.choices">{{choice.text}}</b-form-checkbox>
        </b-form-checkbox-group>

        <b-form-textarea v-else-if="['textarea'].includes(field.type)" 
        :id="'input_' + key" v-model="model[key]" v-bind="field" :rows="field.rows || 3" />

        <b-form-file v-else-if="['image', 'file'].includes(field.type)"  
        :id="'input_' + key" v-model="model[key]" />

        <b-form-input v-else :id="'input_' + key" v-model="model[key]" />

      </b-form-group>
      
      <b-button type="submit" variant="primary">Save</b-button>
      <b-button type="button" variant="secondary" @click="$router.go(-1)">Back</b-button>
    </b-form>
  </div>
</template>

<script>
export default {
  name: "b-data-form",
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
    onSubmit() {}
  },
  created() {
    this.fetchForm();
    this.fetch();
  }
};
</script>

