<template>
  <v-select
    v-model="model"
    @search="getAjaxOptions"
    label="text"
    :options="newOptions"
    :multiple="multiple"
  ></v-select>
</template>

<script>
import VSelect from "vue-select";

export default {
  components: {
    VSelect
  },
  data() {
    return {
      newOptions: this.options.slice(0)
    };
  },
  props: {
    value: {
      deafult() {
        return this.multiple ? [] : null;
      }
    },
    options: {
      default: () => []
    },
    name: {},
    multiple: {},
    field: {},
    parent: {},
    ajaxOptions: {}
  },
  computed: {
    model: {
      get() {
        if (this.multiple) {
          return this.options.filter(v => this.value.includes(v.value));
        } else {
          return this.options.find(v => this.value === v.value);
        }
      },
      set(val) {
        let ret;
        if (this.multiple) {
          const isChanged = JSON.stringify(val) !== JSON.stringify(this.value);
          if (isChanged) {
            ret = val.map(v => v.value);
          }
        } else {
          ret = val.value;
        }
        ret && this.$emit("input", ret);
      }
    }
  },
  methods: {
    getAjaxOptions(q) {
      if (!this.ajaxOptions) {
        return;
      }

      const options = this.ajaxOptions;
      if (options.url) {
        const url = _.template(options.url)({ item: parent });
        const fetchOptions = (params = {}) => {
          console.log(params);
          this.$http
            .get(url, {
              params: params
            })
            .then(res => {
              this.newOptions = res.data;
            })
            .catch(console.log);
        };
        if (options.depends) {
          this.$watch(
            `parent.${options.depends}`,
            val => {
              fetchOptions({ [options.depends]: val });
            },
            {
              // deep: true,
              immediate: true
            }
          );
        } else {
          fetchOptions();
        }
        return;
      }
      if (!options.where) {
        options.where = {};
      }
      options.where[options.text] = q;
      this.$http
        .get(options.resource + "/options", {
          params: options
        })
        .then(({ data }) => {
          this.newOptions = data;
        });
    },
    initOptionsForSelect2() {
      const parentOptions = this.parent[this.name + "_data"];
      if (parentOptions) {
        this.newOptions = this.options.concat(parentOptions);
      }
    },
    fetchOptions(query) {
      const params = this.ajaxOptions;
      const { url, resource, where = {}, text, depends } = params;
      if (!params.where) {
        params.where = {};
      }
      // if (text) {
      //   options.where[text] = q;
      // }
      const apiUrl = url
        ? _.template(url)({ item: this.parent })
        : resource + "/options";
      this.$http.get(apiUrl, { params }).then(({ data }) => {
        this.newOptions = data;
      });
    }
  },
  mounted() {
    if (this.ajaxOptions) {
      this.fetchOptions();
      const { url, resource, where, depends } = this.ajaxOptions;
      this.$watch(
        `parent.${depends}`,
        val => {
          this.fetchOptions({ [depends]: val });
        },
        {
          // deep: true,
          immediate: true
        }
      );
    }
  }
};
</script>

