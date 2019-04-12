<template>
  <v-select v-model="model" @search="getAjaxOptions" label="text" :options="options" :multiple="multiple"></v-select>
</template>

<script>
import VSelect from "vue-select";

export default {
  components: {
    VSelect
  },
  props: {
    value: {
      deafult(){
        return this.multiple ? [] : null
      }
    },
    options: {
      default: () => []
    },
    name: {},
    multiple: {},
    field: {},
  },
  computed: {
    model: {
      get(){
        if (this.multiple) {
          return this.options.filter(v => this.value.includes(v.value))
        } else {
          return this.options.find(v => this.value === v.value)
        }
      },
      set(val){
        let ret
        if (this.multiple) {
          const isChanged = JSON.stringify(val) !== JSON.stringify(this.value)
          if (isChanged) {
            ret = val.map(v => v.value)
          }
        } else {
          ret = val.value
        }
        ret && this.$emit('input', ret)
      }
    }
  },
  methods: {
    getAjaxOptions(q) {
      if (!this.field.ajaxOptions) {
        return;
      }

      const options = this.field.ajaxOptions;
      if (options.url) {
        const url = _.template(options.url)({ item: parent });
        const fetchOptions = (params = {}) => {
          this.$http
            .get(url, {
              params: params
            })
            .then(res => {
              this.options = res.data;
            })
            .catch(console.log);
        };
        if (options.depends) {
          // this.$watch(
          //   `parent.${options.depends}`,
          //   val => {
          //     fetchOptions({ [options.depends]: val });
          //   },
          //   {
          //     // deep: true,
          //     immediate: true
          //   }
          // );
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
          this.options = data;
        });
    },
    initOptionsForSelect2() {
      const parentOptions = this.parent[this.name + "_data"];
      if (parentOptions) {
        this.options = this.options.concat(parentOptions);
      }
    }
  }
};
</script>

