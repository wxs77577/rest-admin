<template>
  <b-card :header="header">
    <div class="data-form">
      <div class="row">
        <div class="col col-md-8">
          <legend v-if="model[$config.primaryKey] && false">{{$t('actions.edit')}}: {{model[$config.primaryKey]}}</legend>
        </div>
        <div class="col col-md-4 text-right hidden-sm-down">
          <b-btn @click="$router.go(-1)">{{$t('actions.back')}}</b-btn>
          <b-btn variant="primary" @click="$refs.form.submitForm()">{{$t('actions.save')}}</b-btn>
        </div>
      </div>
      <b-form-builder :languages="$store.state.site.languages" group-by="group" v-if="loaded" :auth="auth" :layout="layout" :fields="fields" ref="form" v-model="model" :action="resourceUri" :method="method" @success="onSuccess"></b-form-builder>
    </div>
  </b-card>
</template>

<script>
import { mapState, mapGetters } from "vuex"
import _ from 'lodash'

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
  watch: {
    '$route'(){
      this.fetchForm()
    }
  },
  computed: {
    resourceUri() {
      return this.resource + "/" + this.id;
    },
    formUri() {
      let url = this.resource + "/" + this.formPath + '/' +(this.id || '');
      return url
    },
    isNew() {
      return !this.id;
    },
    method() {
      return this.isNew ? "post" : "put";
    },
    with() {
      return _.filter(
        _.map(this.fields, (v) => v.ref && v.ref.split(".").shift())
      );
    },
    header() {
      return `
        ${this.currentMenu.name || ''}
        <small> ${this.resource.toUpperCase()} </small>
      `;
    },
    ...mapState(["nav", "auth"]),
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
      
      this.$http.get(this.formUri, {
        params: this.$route.params
      }).then(({ data }) => {
        this.fields = data.fields;
        this.layout = data.layout;

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

