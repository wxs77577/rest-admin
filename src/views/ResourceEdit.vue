<template>
  <div class="data-form">

    <el-row class="row">
      <el-col :md="12">
        <legend
          v-if="model[$config.primaryKey]"
        >{{$t('actions.edit')}} id: {{model[$config.primaryKey]}}</legend>
      </el-col>
      <el-col :md="12" class="text-right hidden-sm-down">
        <b-btn @click="$router.go(-1)">{{$t('actions.back')}}</b-btn>
        <b-btn type="primary" @click="handleSubmit">{{$t('actions.save')}}</b-btn>
      </el-col>
    </el-row>
    <b-form label-width="120px" @submit.native.prevent="handleSubmit">
      <el-tabs value>
        <el-tab-pane
          v-for="(subFields, name) in groupBy(fields, v => v.group || '')"
          :key="name"
          :label="name || $t('messages.default')"
          :name="name"
        >
          <el-fields
            v-model="model"
            :fields="_.pickBy(fields, v => String(v.group || '') === name)"
          ></el-fields>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button type="primary" native-type="submit">{{$t(`actions.${isNew ? 'create' : 'save'}`)}}</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </b-form>
  </div>
  <!-- </component> -->
</template>

<script>
import ElFields from "../components/fields/Fields";
import { mapState, mapGetters } from "vuex";
import { get, map, filter, groupBy } from "lodash";

export default {
  components: {
    ElFields
  },
  props: {
    formPath: {
      type: String,
      default: "form",
      required: false
    }
  },
  data() {
    return {
      redirect: -1,
      loaded: false,
      choices: {},
      fields: {},
      model: {},
      errors: [],
      tag: "b-card",
      header: `
        ${get(this.currentMenu, "name", "") || ""}
        <small> ${String(this.resource || "").toUpperCase()} </small>
      `
    };
  },
  watch: {
    id: "fetchForm",
    "site.fetched"(val) {
      if (val) {
        this.fetchForm(true);
      }
    }
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    resource() {
      return this.$route.params.resource;
    },
    resourceUri() {
      let url = [this.site.resource_prefix, this.resource, this.id]
        .filter(v => v)
        .join("/");
      let group = this.$route.params.group;
      if (group) {
        url += "?group=" + group;
      }
      return url;
    },
    formUri() {
      let url = [this.site.resource_prefix, this.resource, this.formPath]
        .filter(v => v)
        .join("/");
      url += "?id=" + (this.id || "");
      return url;
    },
    isNew() {
      return !this.id;
    },
    method() {
      return this.isNew ? "post" : "put";
    },
    with() {
      return filter(map(this.fields, v => v.ref && v.ref.split(".").shift()));
    },
    ...mapState(["nav", "auth", "site"]),
    ...mapGetters(["currentMenu"])
  },
  methods: {
    groupBy: groupBy,
    fetch() {
      if (this.isNew) {
        this.model = {};
        this.loaded = true;
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
          this.loaded = true;
          this.model = data;
        });
    },
    fetchForm() {
      this.$http
        .get(this.formUri, {
          params: this.$route.params
        })
        .then(({ data }) => {
          this.fields = data.fields;
          this.layout = data.layout;
          this.redirect = data.redirect;
          if (data.header) {
            this.header = data.header;
          }
          if (data.tag) {
            this.tag = data.tag;
          }
          this.fetch();
        });
    },

    handleSubmit() {
      const methodName = String(this.method).toLowerCase();
      let formData = this.model;
      this.$http[methodName](this.resourceUri, formData)
        .then(({ data }) => {
          if (this.successMessage) {
            this.$message({ type: "success", message: this.successMessage });
          } else {
            this.$message({
              type: "success",
              message: this.$t("messages.success")
            });
          }
          this.errors = [];
          this.$router.push(`/rest/${this.resource}`);
        })
        .catch(({ data, status }) => {
          if (status == 422) {
            this.errors = data.message;
          }
        });
    },

    onSuccess() {
      if (this.redirect === false) {
        this.fetchForm();
      } else if (this.redirect === -1 || !this.redirect) {
        this.$router.go(-1);
      } else {
        this.$router.go(this.redirect);
      }
    }
  },
  mounted() {
    this.site.fetched && this.fetchForm();
  },
  created() {
    // this.fetchForm();
  }
};
</script>

