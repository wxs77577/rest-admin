<template>
  <div class="custom-table">
    <div class="row">
      <div class="col col-md-8 d-none">
        <!-- <legend v-html="table.title || header"></legend> -->
      </div>
      <div class="col col-md-12">
        <b-btn
          class="mr-2"
          @click="$router.push('/rest/' + uri + '/create')"
          type="secondary"
          round
          v-if="_.get(actions,'toolbar.create') !== false"
        >
          <i class="icon-plus"></i>
          {{$t('actions.create')}}
        </b-btn>
        <b-btn
          class="mr-2"
          @click="fetch"
          type="success"
          round
          v-if="_.get(actions, 'toolbar.reload') !== false"
        >
          <i class="icon-reload"></i>
          {{$t('actions.reload')}}
        </b-btn>
        <b-btn
          class="mr-2"
          v-for="button in _.get(actions, 'toolbar.extra', [])"
          :key="button.label"
          v-bind="button"
        >{{button.label}}</b-btn>
        <b-btn
          @click="removeAll"
          class="pull-right"
          type="second"
          v-if="_.get(actions, 'toolbar.delete_all') === true"
        >
          <i class="icon-trash"></i>
          {{$t('actions.delete_all')}}
        </b-btn>
      </div>
    </div>
    <div class>
      <div class="my-2">
        <b-form-builder
          :onSubmit="doSearch"
          back-text
          inline
          v-if="_.keys(table.searchFields).length > 0"
          :submit-text="$t('actions.search')"
          :fields="table.searchFields"
          v-model="table.searchModel"
        >
          <div slot="extra-buttons" class="ml-2">
            <b-button
              @click="searchAndExport"
              type="success"
              v-if="_.get(actions, 'export')"
            >{{$t('actions.search_and_export')}}</b-button>
            <iframe :src="iframeSrc" style="width:0;height:0;border:none;"></iframe>
          </div>
        </b-form-builder>
      </div>
      <b-pagination
        :limit="pageLimit"
        background
        :current-page.sync="currentPage"
        :total="total"
        :page-size="perPage"
        :page-sizes="[10, 20]"
      ></b-pagination>

      <b-table
        class="data-table"
        v-if="table.fields"
        ref="table"
        :data="items"
        :current-page="currentPage"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :sort-direction="sortDirection"
      >
        <b-table-column
          v-for="(field, key) in table.fields"
          :key="key"
          :prop="key"
          :label="field.label || key"
          
        >
          <template slot-scope="scope">
            <div v-if="key === '_actions'">
              <b-button
                v-for="(field, name) in actions"
                :key="name"
                :to="_.template(field.to)({item: scope.row})"
                class="mr-1"
                size="sm"
                v-bind="field"
                v-if="field.label"
              >{{field.label}}</b-button>
              <b-btn
                v-if="actions.edit !== false"
                type="success"
                size="mini"
                @click="$router.push(`/rest/${uri}/${scope.row[$config.primaryKey]}`)"
                class="mr-1"
              >{{$t('actions.view')}}</b-btn>
              <b-btn
                v-if="actions.edit !== false"
                type="primary"
                size="mini"
                @click="$router.push(`/rest/${uri}/${scope.row[$config.primaryKey]}/edit`)"
                class="mr-1"
              >{{$t('actions.edit')}}</b-btn>
              <b-btn
                v-if="actions.delete !== false"
                size="mini"
                @click.stop="remove(scope.row[$config.primaryKey])"
              >{{$t('actions.delete')}}</b-btn>
            </div>
            <b-data-value
              v-else
              slot-scope="scope"
              :field="field"
              :key="key"
              :name="key"
              :model="scope.row"
              short-id
            ></b-data-value>
          </template>
        </b-table-column>
      </b-table>

      <b-pagination
        :limit="pageLimit"
        background
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
  props: {},
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
    "$route.query"(val) {
      this.applyRouteQuery();
    },
    "$route.params"(val) {
      this.applyRouteQuery();
      this.fetch();
    },
    currentPage(){
      this.fetchItems()
    },
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
    resource() {
      return this.$route.params.resource;
    },
    uri() {
      return this.resource.replace(/\./g, "/");
    }
  },
  methods: {
    doSearch(params) {
      this.where = _.omitBy(params, v => v === null);
      this.$refs.table.refresh();
      // console.log(params);
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
          this.$snotify.success("删除成功");
          this.$refs.table.refresh();
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
    this.applyRouteQuery();

    this.fetch();
    // this.fetchTable();
  }
};
</script>