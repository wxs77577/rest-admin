<template>
  <b-card :header="header">
    
    <div class="data-table">
      <div class="py-1">
        <b-btn :to="resourceUri + '/create'" variant="secondary">
        <i class="icon-plus"></i>
        {{$t('actions.create')}}
        </b-btn>
        <b-btn @click="fetchGrid" variant="success">
        <i class="icon-refresh"></i>
        {{$t('actions.reload')}}
        </b-btn>
        <b-btn v-for="button in _.get(fields || {}, '_actions.toolbar.extra', [])" 
        :key="button.label"
        v-bind="button">
          {{button.label}}
        </b-btn>

        <b-btn @click="removeAll" class="pull-right" variant="second">
        <i class="icon-trash"></i>
        {{$t('actions.delete_all')}}
        </b-btn>
      </div>
      <div class="mb-2 data-table-search" v-if="!_.isEmpty(searchFields)">
        <b-form-builder :inline="true" :fields="searchFields" :action="searchUri" v-model="searchModel" :submitText="$t('actions.search')" backText="" method="get" :on-submit="onSearch">
          <div slot="extra-buttons" class="ml-2">
            <b-button type="button" @click="searchAndExport" variant="success" v-if="fields._actions.export">{{$t('actions.search_and_export')}}</b-button>
            <iframe :src="iframeSrc" style="width:0;height:0;border:none;"></iframe>
          </div>
        </b-form-builder>
      </div>
      <b-row>
        <b-col cols="8">
          <b-pagination :limit="limitPages" :total-rows="totalRows" :per-page="perPage" v-model="page" />
        </b-col>
        <b-col cols="4" class="text-right">
          <p>{{$t('messages.paginate', {total: totalRows})}}</p>
          <!-- <p>共 <b>{{totalRows}}</b> 条数据</p> -->
        </b-col>
      </b-row>
      <b-table class="data-table" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :no-local-sorting="true" :fields="fields" :items="items">
        
        <template v-for="(field, key) in fields"  :slot="key" slot-scope="row">
          <b-data-value :field="field" :key="key" :name="key" :model="row.item" short-id />
        </template>
        
        <template slot="_actions" slot-scope="row" >
          <b-btn size="sm" variant="success" @click.stop="show(row.item)" v-if="!fields._actions.buttons || fields._actions.buttons.show !== false">
            <i class="icon-eye"></i>
            {{$t('actions.view')}}
          </b-btn>
          <b-btn size="sm" variant="primary" @click.stop="edit(row.item)" v-if="!fields._actions.buttons || fields._actions.buttons.edit !== false">
            <i class="icon-pencil"></i>
            {{$t('actions.edit')}}
          </b-btn>
          <b-btn size="sm" variant="second" @click.stop="remove(row.item)" v-if="!fields._actions.buttons || fields._actions.buttons.remove !== false">
            <i class="icon-trash"></i>
            {{$t('actions.delete')}}
          </b-btn>
          <b-btn size="sm" v-for="(button, key) in fields._actions.addon" :key="key" v-bind="button">{{button.label}}</b-btn>
        </template>

      </b-table>

      <b-row>
        <b-col cols="8">
          <b-pagination :limit="limitPages" :total-rows="totalRows" :per-page="perPage" v-model="page" />
        </b-col>
        <b-col cols="4" class="text-right">
          <p>{{$t('messages.paginate', {total: totalRows})}}</p>
        </b-col>
      </b-row>
    </div>
  </b-card>
</template>

<script>
import BFormBuilder from "./FormBuilder";
import BDataValue from "./DataValue";
import { mapState, mapGetters } from "vuex";
export default {
  components: {
    BFormBuilder,
    BDataValue
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
      iframeSrc: null,
      pause: true, //修复切换页面时page等参数的自动变更会导致多次fetch的问题
      page: 1,
      perPage: 6,
      sortBy: this.$config.primaryKey,
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
    searchAndExport() {
      const query = JSON.stringify({
        where: _.clone(this.searchModel)
      })
      this.iframeSrc = ''
      setTimeout(() => {
        this.iframeSrc = `${API_URI}${this.resourceUri}/export?query=${query}&token=${this.$store.state.auth.token}`
      }, 50)
      
    },
    fetchGrid(fetchData = false) {
      this.query = {};
      this.$http.get(this.gridUri).then(({ data }) => {
        this.fields = data.fields;
        if (!this.fields._actions && this.fields._actions !== false) {
          this.fields._actions = {};
        }
        if (this.fields._actions) {
          if (!this.fields._actions.label) {
            this.fields._actions.label = "";
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
        path: this.resource + "/" + item[this.$config.primaryKey]
      });
    },
    edit(item) {
      this.$router.push({
        path: this.resource + "/" + item[this.$config.primaryKey] + "/edit"
      });
    },
    remove(item) {
      if (window.confirm(this.$t("messages.confirm_delete"))) {
        this.$http
          .delete(this.resourceUri + "/" + item[this.$config.primaryKey])
          .then(({ data }) => {
            this.$snotify.success(this.$t("messages.deleted"));
            this.fetch();
          });
      }
    },
    removeAll(item) {
      if (window.confirm(this.$t("messages.confirm_delete_all"))) {
        this.$http.delete(this.resourceUri).then(({ data }) => {
          this.$snotify.success(this.$t("messages.deleted_all"));
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
  .data-value > img {
    max-width: inherit !important;
    max-height: 60px !important;
  }
  .data-table-search {
  }
}
</style>
