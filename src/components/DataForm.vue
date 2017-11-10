<template>
  <b-card :header="resource">
    <div class="data-form">
      <legend v-if="model._id">Edit: {{model._id}}</legend>
      <b-form-builder :fields="fields" v-model="model" :action="resourceUri" :method="method" @success="onSuccess"></b-form-builder>
    </div>
  </b-card>
</template>

<script>

export default {
  components: {
  },
  props: {
    resource: {
      type: String,
      required: true
    },
    id: {
      default: '',
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
      model: {},
      errors: [],
      
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
      if (this.isNew) {
        return
      }
      this.$http.get(this.resourceUri).then(({ data }) => {
        this.model = data;
      });
    },
    fetchForm() {
      this.$http.get(this.formUri).then(({ data }) => {
        this.fields = data.fields;
      });
    },
    
    onSuccess() {
      this.$router.go(-1)
    },
  },
  mounted() {

  },
  created() {
    this.fetchForm();
    this.fetch();
  }
};
</script>

