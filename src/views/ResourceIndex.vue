<template>
  <div class="custom-table">
    <div class="row">
      <div class="col col-md-8 d-none">
        <!-- <legend v-html="table.title || header"></legend> -->
      </div>
      <div class="col col-md-12">
        <el-button
          class="mr-1"
          @click="$router.push('/rest/' + uri + '/create')"
          size="small"
          v-if="_.get(actions,'toolbar.create') !== false"
        >
          <i class="icon-plus"></i>
          {{$t('actions.create')}}
        </el-button>
        <el-button
          class="mr-1"
          @click="fetch"
          size="small"
          v-if="_.get(actions, 'toolbar.reload') !== false"
        >
          <i class="icon-reload"></i>
          {{$t('actions.reload')}}
        </el-button>
        <el-button
          class="mr-1"
          v-for="button in _.get(actions, 'toolbar.extra', [])"
          :key="button.label"
          v-bind="button"
          @click="$router.push(button.to)"
          size="small"
        >{{button.label}}</el-button>
        <el-button
          @click="removeAll"
          class="pull-right"
          type="second"
          size="small"
          v-if="_.get(actions, 'toolbar.delete_all') === true"
        >
          <i class="icon-trash"></i>
          {{$t('actions.delete_all')}}
        </el-button>
      </div>
    </div>
    <div class>
      <el-form
        class="py-3"
        inline
        @submit.native.prevent="doSearch"
        v-if="!_.isEmpty(table.searchFields)"
      >
        <el-fields v-model="table.searchModel" :fields="table.searchFields">
          <el-form-item>
            <el-button native-type="submit">{{$t('actions.search')}}</el-button>
          </el-form-item>
        </el-fields>

        <div slot="extra-buttons" class="ml-2">
          <b-button
            @click="searchAndExport"
            type="success"
            v-if="_.get(actions, 'export')"
          >{{$t('actions.search_and_export')}}</b-button>
          <iframe :src="iframeSrc" style="width:0;height:0;border:none;"></iframe>
        </div>
      </el-form>

      <b-pagination
        class="pt-3"
        :limit="pageLimit"
        :current-page.sync="currentPage"
        :total="total"
        :page-size="perPage"
        :page-sizes="[10, 20]"
      ></b-pagination>

      <b-table ref="table" :data="items" @sort-change="changeSort" @filter-change="changeFilter">
        <b-table-column
          v-for="(field, key) in fields"
          :key="key"
          :prop="key"
          :label="field.label || key"
          :sortable="field.sortable ? 'custom' : false"
          :width="field.width"
          :column-key="key"
          :filters="field.filterable ? field.options : null"
        >
          <template slot-scope="scope">
            <b-data-value
              :field="field"
              :key="key"
              :name="key"
              :model="scope.row"
              short-id
              :lang="currentLanguage"
            ></b-data-value>
          </template>
        </b-table-column>
        <b-table-column :label="$t('actions.actions')" width="220" fixed="right">
          <template slot-scope="scope">
            <template v-for="(field, name) in actions">
              <b-button
                :key="name"
                :to="_.template(field.to)({item: scope.row})"
                size="sm"
                v-bind="field"
                v-if="field.label"
              >{{field.label}}</b-button>
            </template>

            <el-button
              v-if="actions.edit !== false"
              type="success"
              size="mini"
              @click="$router.push(`/rest/${uri}/${scope.row[$config.primaryKey]}`)"
            >{{$t('actions.view')}}</el-button>
            <el-button
              v-if="actions.edit !== false"
              type="primary"
              size="mini"
              @click="$router.push(`/rest/${uri}/${scope.row[$config.primaryKey]}/edit`)"
            >{{$t('actions.edit')}}</el-button>
            <el-button
              v-if="actions.delete !== false"
              size="mini"
              @click.stop="remove(scope.row[$config.primaryKey])"
            >{{$t('actions.delete')}}</el-button>
          </template>
        </b-table-column>
      </b-table>

      <b-pagination
        class="py-3"
        :limit="pageLimit"
        :current-page.sync="currentPage"
        :total="total"
        :page-size="perPage"
        :page-sizes="[10, 20]"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import types from "../store/types";
import _ from "lodash";

export default {
  components: {},
  props: {
    resource: {}
  },
  data() {
    return {
      init: false,
      loaded: false,
      table: {},
      total: 0, //total rows
      items: [],
      pageLimit: 10, //display how many page buttons
      currentPage: 1,
      sortBy: this.$config.primaryKey,
      sortDesc: true,
      sortDirection: null,
      perPage: 10,
      where: {},
      iframeSrc: ""
    };
  },
  watch: {
    currentPage() {
      this.fetchItems();
    }
    // page(val) {}
  },
  computed: {
    ...mapState(["site", "i18n", "auth"]),
    ...mapGetters(["currentLanguage"]),
    populate() {
      return _(this.table.fields || {})
        .map("ref")
        .filter()
        .map(v => v.split(".").shift())
        .uniq()
        .toJSON();
    },
    actions() {
      return _.get(this.table, "fields._actions", {});
    },
    uri() {
      return this.resource.replace(/\./g, "/");
    },
    fields() {
      const ret = Object.assign({}, this.table.fields);
      delete ret._actions;
      return ret;
    }
  },
  methods: {
    changeFilter(filters) {
      this.where = _.pickBy(_.merge({}, filters), "length");
      console.log(this.where);
      this.fetchItems();
    },
    changeSort({ prop, order }) {
      this.sortBy = prop;
      this.sortDesc = order === "descending";
      this.fetchItems();
    },
    doSearch() {
      this.where = _.omitBy(this.table.searchModel, v =>
        [null, ""].includes(v)
      );
      this.fetchItems();
    },
    searchAndExport() {
      const query = JSON.stringify({
        where: _.clone(this.table.searchModel),
        with: _.clone(this.populate)
      });
      this.iframeSrc = "";
      setTimeout(() => {
        this.iframeSrc = `${global.API_URI}${
          this.uri
        }/export?query=${query}&token=${this.$store.state.auth.token}`;
      }, 50);
    },
    applyRouteQuery() {
      const { sort = {}, page = 1, where = {} } = JSON.parse(
        this.$route.query.query || "{}"
      );
      const [sortBy, sortDesc] = Object.entries(sort).pop() || [];
      sortBy && (this.sortBy = sortBy);

      if (sortDesc) {
        this.sortDesc = sortDesc === -1 ? true : false;
      }
      this.total = page * this.perPage;
      this.currentPage = page;
      this.where = where;
      this.init = true;
    },
    remove(id) {
      if (window.confirm("是否删除?")) {
        this.$http.delete(`${this.uri}/${id}`).then(res => {
          this.$notify.success("删除成功");
          this.fetch();
        });
      }
    },
    fetchItems() {
      const query = _.merge({}, _.get(this.table, "query"), {
        page: this.currentPage,
        sort: { [this.sortBy]: this.sortDesc ? -1 : 1 },
        where: this.where,
        with: this.populate
      });

      return this.$http
        .get(this.uri, {
          params: {
            query: JSON.stringify(query)
          }
        })
        .then(res => {
          const { total, data } = res.data;
          this.total = total;
          this.items = data;
          return data;
        })
        .catch(e => {
          return [];
        });
    },
    fetch() {
      this.init = false;
      this.$http.get(this.uri + "/grid").then(res => {
        _.mapValues(res.data.fields, field => {
          field.thClass = "bg-light";
        });

        this.table = res.data;

        if (_.get(this.table, "fields._actions") !== false) {
          _.set(
            this.table,
            "fields._actions.label",
            this.$t("actions.actions")
          );
        }
        this.init = true;
        this.fetchItems();
      });
    }
  },
  mounted() {},
  created() {
    // this.applyRouteQuery();
    // this.fetch();
    // this.fetchTable();
    this.$watch('resource', () => {
      this.fetch()
    }, {
      immediate: true
    })
    this.$watch('$route.query', () => {
      this.applyRouteQuery()
      this.fetchItems()
    }, {
      deep: true,
    })
  }
};
</script>