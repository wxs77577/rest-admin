<template>
  <b-card :header="header">
    
    <div class="data-table">
      <div class="py-1">
        <b-btn :to="resourceUri + '/create'" variant="secondary">
        <i class="icon-plus"></i>
        新建
        </b-btn>
        <b-btn @click="fetchGrid" variant="success">
        <i class="icon-refresh"></i>
        刷新
        </b-btn>
        <b-btn v-for="button in _.get(fields || {}, 'actions.toolbar.extra', [])" 
        :key="button.label"
        v-bind="button">
          {{button.label}}
        </b-btn>

        <b-btn @click="removeAll" class="pull-right" variant="second">
        <i class="icon-trash"></i>
        全部删除
        </b-btn>
      </div>
      <div class="mb-2 data-table-search" v-if="!_.isEmpty(searchModel)">
        <b-form-builder :inline="true" :fields="searchFields" :action="searchUri" v-model="searchModel" submitText="搜索" backText="" method="get" :on-submit="onSearch" />
      </div>
      <b-row>
        <b-col cols="8">
          <b-pagination :limit="limitPages" :total-rows="totalRows" :per-page="perPage" v-model="page" />
        </b-col>
        <b-col cols="4" class="text-right">
          <p>共 <b>{{totalRows}}</b> 条数据</p>
        </b-col>
      </b-row>
      <b-table :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :no-local-sorting="true" :fields="fields" :items="items">
        
        <template v-for="(field, key) in fields"  :slot="key" slot-scope="row">
          <b-data-value :field="field" :key="key" :name="key" :model="row.item" short-id />
        </template>
        
        <template slot="actions" slot-scope="row" >
          <b-btn size="sm" variant="success" @click.stop="show(row.item)" v-if="!fields.$actions.buttons || fields.$actions.buttons.show !== false">查看</b-btn>
          <b-btn size="sm" variant="primary" @click.stop="edit(row.item)" v-if="!fields.$actions.buttons || fields.$actions.buttons.edit !== false">编辑</b-btn>
          <b-btn size="sm" variant="second" @click.stop="remove(row.item)" v-if="!fields.$actions.buttons || fields.$actions.buttons.remove !== false">删除</b-btn>
          <b-btn size="sm" v-for="(button, key) in fields.$actions.addon" :key="key" v-bind="button">{{button.label}}</b-btn>
        </template>

      </b-table>

      <b-row>
        <b-col cols="8">
          <b-pagination :limit="limitPages" :total-rows="totalRows" :per-page="perPage" v-model="page" />
        </b-col>
        <b-col cols="4" class="text-right">
          <p>共 <b>{{totalRows}}</b> 条数据</p>
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>

<script>
import bFormBuilder from "./FormBuilder";
import bDataValue from "./DataValue";
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    bFormBuilder,
    bDataValue
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
      pause: true, //修复切换页面时page等参数的自动变更会导致多次fetch的问题
      page: 1,
      perPage: 6,
      sortBy: "_id",
      sortDesc: true,
      fields: {},
      filter: {},
      choices: {},
      totalRows: 0,
      items: [],
      searchFields: {},
      searchModel: {},
      where: {},
      limitPages: 10
    };
  },
  computed: {
    ...mapState(["site"]),
    ...mapGetters(["currentMenu"]),
    header() {
      return `
        ${this.currentMenu.name || ""}
        <small> ${this.resource.toUpperCase()} </small>
      `;
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
    "$route.params.resource"() {
      this.pause = true;
      this.fetchGrid(true);
    },
    page: "fetch",
    sort: "fetch",
    where: "fetch",
    "$route.query.query"(val) {
      this.applyQuery();
      this.fetch();
    }
    // query(val) {
    //   this.$emit("change query", val);
    //   // this.$router.push({
    //   //   query: {
    //   //     query: JSON.stringify(val)
    //   //   }
    //   // });
    // }
  },
  methods: {
    fetch() {
      if (this.pause) {
        return;
      }
      this.$http
        .get(this.resourceUri, {
          params: {
            query: JSON.stringify(this.query)
          }
        })
        .then(({ data }) => {
          this.items = data.data;
          this.totalRows = data.total;
          this.perPage = data.perPage;
        });
    },
    fetchGrid(fetchData = false) {
      this.query = {};
      this.$http.get(this.gridUri).then(({ data }) => {
        this.fields = data.fields;
        if (!this.fields.$actions && this.fields.$actions !== false) {
          this.fields.$actions = {};
        }
        if (this.fields.$actions) {
          if (!this.fields.$actions.label) {
            this.fields.$actions.label = "操作";
          }
        }
        this.searchFields = data.searchFields;
        this.searchModel = data.searchModel;
        this.pause = false;
        if (fetchData) {
          this.applyQuery();
          this.fetch();
        }
      });
    },
    applyQuery() {
      const query = this.$route.query.query;
      if (!query) {
        this.query = {};
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
    edit(item) {
      this.$router.push({
        path: this.resource + "/" + item._id + "/edit"
      });
    },
    remove(item) {
      if (window.confirm("确定要删除吗？")) {
        this.$http
          .delete(this.resourceUri + "/" + item._id)
          .then(({ data }) => {
            this.$snotify.success("删除成功");
            this.fetch();
          });
      }
    },
    removeAll(item) {
      if (window.confirm("此次操作不可恢复，确定要全部删除吗？")) {
        this.$http.delete(this.resourceUri).then(({ data }) => {
          this.$snotify.success("全部删除成功");
          this.fetch();
        });
      }
    },

    onSearch() {
      this.where = this.searchModel;
      this.fetch();
    }
  },
  mounted() {
    this.fetchGrid(true);

    // console.log('mounted');
  },
  created() {
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
