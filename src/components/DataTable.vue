<template>
  <b-card :header="header">
    
    <div class="data-table">
      <div class="py-1">
        <b-btn :to="resourceUri + '/create'" variant="secondary">
        新建
        </b-btn>
      </div>
      <div class="mb-2 data-table-search" v-if="!_.isEmpty(searchModel)">
        <b-form-builder :inline="true" :fields="searchFields" :action="searchUri" v-model="searchModel" submitText="搜索" backText="" method="get" :on-submit="onSearch" />
      </div>
      <b-table :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :no-local-sorting="true" :fields="fields" :items="items">
        
        <div v-for="(field, key) in fields" :key="key" :slot="key" slot-scope="row">
          
          <template v-if="['image'].includes(field.type)">
            <img :src="row.value" />
          </template>

          <template v-else-if="['audio', 'video'].includes(field.type)">
            <component :is="field.type" :src="row.value" controls />
          </template>

          <template v-else-if="['switch', 'boolean', 'checkbox'].includes(field.type)">
            <b-badge :variant="row.value ? 'success' : 'danger'">
              {{String(!!row.value).toUpperCase()}}
            </b-badge>
          </template>

          <template v-else-if="field.ref">
            {{_.get(row.item, field.ref)}}
          </template>

          <template v-else-if="key === '_id'">
            <span v-b-tooltip.hover.top.d100 :title="row.value">
              {{row.value.substr(-4).toUpperCase()}}
            </span>
          </template>

          <template v-else>
            {{row.value}}
          </template>

        </div>
        
        <template slot="actions" slot-scope="row">
          <b-btn size="sm" variant="primary" @click.stop="show(row.item)">编辑</b-btn>
          <b-btn size="sm" variant="second" @click.stop="remove(row.item)">删除</b-btn>
        </template>

      </b-table>
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="page" />
    </div>
  </b-card>
</template>

<script>
import bFormBuilder from "./FormBuilder";

export default {
  components: {
    bFormBuilder
  },
  props: {
    resource: {
      type: String,
      required: true
    },
    gridPath: {
      type: String,
      default: "grid",
      required: false
    }
  },
  data() {
    return {
      page: 1,
      perPage: 6,
      sortBy: '_id',
      sortDesc: false,
      fields: {},
      filter: {},
      choices: {},
      totalRows: 0,
      items: [],
      searchFields: {},
      searchModel: {},
      where: {}
    };
  },
  computed: {
    header() {
      return `
        ${this.$root.getNavItem(this.resource).name}
        <small> ${this.resource.toUpperCase()} </small>
      `
    },
    with() {
      return _.filter(
        _.map(this.fields, (v, k) => v.ref && v.ref.split(".").shift())
      );
    },
    searchUri() {
      return this.resource;
    },
    resourceUri() {
      return this.resource;
    },
    gridUri() {
      return this.resource + "/" + this.gridPath;
    },
    sort: {
      get() {
        if (!this.sortBy) {
          return null;
        }
        return {
          [this.sortBy]: this.sortDesc ? -1 : 1
        };
      },
      set(val) {
        for (let k in val) {
          this.sortBy = k;
          this.sortDesc = val === -1;
        }
      }
    },
    query: {
      get() {
        return {
          sort: this.sort,
          page: this.page,
          perPage: this.perPage,
          with: this.with,
          where: this.where
        };
      },
      set(val) {
        this.sort = val.sort;
        this.page = val.page;
        this.perPage = val.perPage;
        this.where = val.where;
      }
    }
  },
  watch: {
    "$route.params.resource": "fetchGrid",
    "$route.params.id": "fetch",
    page: "fetch",
    sort: "fetch",
    where: "fetch",
    query(val) {
      this.$emit("change query", val);
      // this.$router.push({
      //   query: {
      //     query: JSON.stringify(val)
      //   }
      // });
    }
  },
  methods: {
    fetch() {
      this.$http
        .get(this.resourceUri, {
          params: {
            query: this.query
          }
        })
        .then(({ data }) => {
          this.items = data.data;
          this.totalRows = data.total;
          this.perPage = data.perPage;
        });
    },
    fetchGrid() {
      this.query = {};
      this.$http.get(this.gridUri).then(({ data }) => {
        this.fields = data.fields;
        if (!this.fields.actions) {
          this.fields.actions = {};
        }
        this.searchFields = data.searchFields;
        this.searchModel = data.searchModel;
        this.fetch();
      });
    },
    applyQuery() {
      const query = this.$route.query.query;
      if (!query) {
        return;
      }
      this.query = _.isString(query) ? JSON.parse(query) : query;
      // this.searchModel = this.where
    },
    get(item, path) {
      const [model, field] = path.split(".");
      return item[model][field];
    },
    show(item) {
      this.$router.push({
        path: this.resource + "/" + item._id
      });
    },
    remove(item) {
      if (window.confirm('确定要删除吗？')) {
        this.$http.delete(this.resourceUri + '/' + item._id).then(({data}) => {
          this.$snotify.success('删除成功');
          this.fetch()
        })
      }
    },
    onSearch() {
      console.log("search");

      this.where = this.searchModel;
      this.fetch();
    }
  },
  created() {
    this.fetchGrid();
    // this.applyQuery();
  }
};
</script>

<style lang="scss">
.data-table {
  td img {
    max-height: 3em;
  }
  .data-table-search {
  }
}
</style>
