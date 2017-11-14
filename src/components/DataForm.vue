<template>
  <b-card :header="header">
    <div class="data-form">
      <legend v-if="model._id">Edit: {{model._id}}</legend>
      <b-form-builder :fields="fields" v-model="model" :action="resourceUri" :method="method" @success="onSuccess"></b-form-builder>
    </div>
  </b-card>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

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
    },
    header() {
      return `
        ${this.currentNav.name}
        <small> ${this.resource.toUpperCase()} </small>
      `
    },
    ...mapState(['nav']),
    ...mapGetters(['currentNav']),
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

