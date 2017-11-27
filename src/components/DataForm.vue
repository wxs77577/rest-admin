<template>
  <b-card :header="header">
    <div class="data-form">
      <div class="row">
        <div class="col col-md-8">
          <legend v-if="model._id">Edit: {{model._id}}</legend>
        </div>
        <div class="col col-md-4 text-right hidden-sm-down">
          <b-btn @click="$router.go(-1)">返回</b-btn>
          <b-btn variant="primary" @click="$refs.form.handleSubmit()">保存</b-btn>
        </div>
      </div>
      <b-form-builder v-if="loaded" :fields="fields" ref="form" v-model="model" :action="resourceUri" :method="method" @success="onSuccess"></b-form-builder>
    </div>
  </b-card>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  components: {},
  props: {
    resource: {
      type: String,
      required: true
    },
    id: {
      default: "",
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
      loaded: false,
      choices: {},
      fields: {},
      model: {},
      errors: []
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
      return !this.id;
    },
    method() {
      return this.isNew ? "post" : "put";
    },
    with() {
      return _.filter(
        _.map(this.fields, (v, k) => v.ref && v.ref.split(".").shift())
      );
    },
    header() {
      return `
        ${this.currentMenu.name}
        <small> ${this.resource.toUpperCase()} </small>
      `;
    },
    ...mapState(["nav"]),
    ...mapGetters(["currentMenu"])
  },
  methods: {
    fetch() {
      if (this.isNew) {
        this.loaded = true
        return;
      }
      this.$http
        .get(this.resourceUri, {
          params: {
            query: {
              with: this.with
            }
          }
        })
        .then(({ data }) => {
          this.loaded = true
          this.model = data;
        });
    },
    fetchForm() {
      this.$http.get(this.formUri).then(({ data }) => {
        this.fields = data.fields;

        this.fetch();
      });
    },

    onSuccess() {
      this.$router.go(-1);
    }
  },
  mounted() {},
  created() {
    this.fetchForm();
  }
};
</script>

