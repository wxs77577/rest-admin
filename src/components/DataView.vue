<template>
  <b-card :header="header">
    <div class="data-view">
      <legend v-if="model._id">View: {{model._id}}</legend>
      <table class="table ">
        <tbody>
          <tr v-for="(field, key) in fields" :key="key">
            <th style="min-width:120px">{{field.label || key}}</th>
            <td>
              <div v-if="['array'].includes(field.type)">
                <b-table :items="model[key]" :fields="field.fields">
                  <div v-for="(child, k) in field.fields" :key="k" :slot="k" slot-scope="row">

                    <b-data-value :field="child" :name="k" :model="row.item" />

                  </div>
                </b-table>
              </div>
              <div v-else>
                <b-data-value :field="field" :name="key" :model="model" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div slot="footer">
      <b-btn @click="$router.go(-1)">返回</b-btn>
    </div>
  </b-card>
</template>

<script>
import bDataValue from "./DataValue";

import { mapState, mapGetters } from 'vuex'
export default {
  components: {
    bDataValue
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
    viewPath: {
      type: String,
      default: "view",
      required: false
    },

  },
  data() {
    return {
      choices: {},
      fields: {},
      model: {},
      errors: [],
      items: []
    };
  },

  computed: {
    resourceUri() {
      return this.resource + "/" + this.id;
    },
    viewUri() {
      return this.resource + "/" + this.viewPath;
    },
    with() {
      return _.filter(
        _.map(this.fields, (v, k) => v.ref && v.ref.replace(/\.\w+$/, ''))
      );
    },

    ...mapState(['site']),
    ...mapGetters(['currentMenu']),
    header() {
      return `
        ${this.currentMenu.name}
        <small> ${this.resource.toUpperCase()} </small>
      `
    },
  },
  methods: {
    fetch() {
      this.$http.get(this.resourceUri, {
        params: {
          query: { with: this.with }
        }
      }).then(({ data }) => {
        this.model = data;
      });
    },
    fetchView() {
      this.$http.get(this.viewUri).then(({ data }) => {
        this.fields = data.fields;
        this.fetch();
      });
    },
  },
  mounted() {

  },
  created() {
    this.fetchView();


  }
};
</script>

