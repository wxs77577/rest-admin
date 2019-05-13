<template>
  <div class="data-form">
    <el-row type="flex" class="row">
      <el-col :md="16">
        <legend
          v-if="model[$config.primaryKey]"
        >{{$t('actions.edit')}} id: {{model[$config.primaryKey]}}</legend>
      </el-col>
      <el-col :md="8" class="text-right">
        <el-button size="small" onclick="window.history.go(-1)">
          <i class="el-icon-back"></i> 返回
        </el-button>
      </el-col>
    </el-row>
    <el-form
      ref="form"
      :model="model"
      :rules="rules"
      label-position="right"
      label-width="7em"
      @submit.native.prevent="handleSubmit"
    >
      <el-tabs value>
        <el-tab-pane
          v-for="(subFields, name) in groupBy(fields, v => v.group || '')"
          :key="name"
          :label="name || $t('messages.default')"
          :name="name"
        >
          <el-fields
            v-model="model"
            :parent="model"
            :fields="_.pickBy(fields, v => String(v.group || '') === name)"
          ></el-fields>
        </el-tab-pane>
      </el-tabs>

      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
        >{{$t(`actions.${isNew ? 'create' : 'save'}`)}}</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
  <!-- </component> -->
</template>

<script>
import { mapState, mapGetters } from "vuex";
import _ from "lodash";
import { get, map, filter, groupBy, pickBy } from "lodash";

export default {
  components: {},
  props: {
    id: {},
    resource: {},
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
      errors: {},
      tag: "el-card",
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
    resourceUri() {
      let url = [this.site.resource_prefix, this.resource, this.id]
        .filter(v => v)
        .join("/");
      let group = this.group;
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
    rules() {
      return _(this.fields)
        .pickBy("rules")
        .mapValues("rules")
        .toJSON();
    },
    ...mapState(["nav", "auth", "site"]),
    ...mapGetters(["currentMenu"])
  },
  methods: {
    groupBy: groupBy,
    async fetch() {
      if (this.isNew) {
        this.model = {};
        this.loaded = true;
        return;
      }
      const { data } = await this.$http.get(this.resourceUri, {
        params: {
          query: {
            with: this.with
          }
        }
      });
      this.loaded = true;
      this.model = data;
    },
    async fetchForm() {
      const { data } = await this.$http.get(this.formUri, {
        params: this.$route.params
      });

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
    },

    async handleSubmit() {
      try {
        await this.$refs.form.validate();
      } catch (e) {
        return this.$messager.warning("输入有误");
      }
      const methodName = String(this.method).toLowerCase();
      let formData = this.model;
      try {
        const { data } = await this.$http[methodName](
          this.resourceUri,
          formData
        );

        this.$messager.success(
          this.successMessage || this.$t("messages.success")
        );

        this.errors = {};
        this.$router.push(`/rest/${this.resource}`);
      } catch (e) {
        const { data, status } = e;
        if (status == 422) {
          this.errors = data.errors;
        }
      }
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

