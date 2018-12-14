<template>
  <b-card class="border-0" :header="table.header">
    <div class="custom-table">
      <div class="row">
        <div class="col col-md-8">
          <legend>{{table.title}}</legend>
        </div>
        <div class="col col-md-4">
          <b-btn
            class="mr-2"
            :to="'/rest/' + uri + '/create'"
            variant="secondary"
            v-if="_.get(actions,'toolbar.create') !== false"
          >
            <i class="icon-plus"></i>
            {{$t('actions.create')}}
          </b-btn>
          <b-btn
            class="mr-2"
            @click="fetch"
            variant="success"
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
            variant="second"
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
            :submit-text="$t('actions.search')"
            :fields="table.searchFields"
            v-model="table.searchModel"
          ></b-form-builder>
        </div>
        <div class="row align-items-center">
          <div class="col-md-8">
            <b-pagination
              :limit="pageLimit"
              v-model="currentPage"
              :total-rows="total"
              :per-page="perPage"
            >
            </b-pagination>
            
          </div>
          <div class="col-md-4 form-inline justify-content-end">
            Page
            <b-select v-model="currentPage" class="mx-2">
              <option v-for="n in Math.ceil(total/perPage)" :key="n" :value="n">{{n}}</option>
            </b-select>
            
            <span>{{$t('messages.paginate', {total: total})}}</span>
          </div>
        </div>
        <b-table
          v-if="table.fields"
          ref="table"
          :items="fetchData"
          :fields="table.fields"
          :current-page="currentPage"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          :sort-direction="sortDirection"
        >
          <template v-for="(field, key) in actions" :slot="`HEAD_${key}`" slot-scope="row">
            <div
              :key="key"
              :class="{'text-right': ['number'].includes(field.type)}"
            >{{field.label || key}}</div>
          </template>
          <template v-for="(field, key) in table.fields" :slot="key" slot-scope="row">
            <b-data-value :field="field" :key="key" :name="key" :model="row.item" short-id/>
          </template>
          <template slot="_actions" slot-scope="row">
            <b-button
              v-for="(field, key) in actions"
              :key="key"
              :to="_.template(field.to)(row)"
              class="mr-1"
              v-bind="field"
              v-if="field.label"
            >{{field.label}}</b-button>
            <b-btn
              v-if="actions.edit"
              variant="success"
              :to="`/rest/${uri}/${row.item[$config.primaryKey]}`"
              class="mr-1"
            >{{$t('actions.view')}}</b-btn>
            <b-btn
              v-if="actions.edit"
              variant="primary"
              :to="`/rest/${uri}/${row.item[$config.primaryKey]}/edit`"
              class="mr-1"
            >{{$t('actions.edit')}}</b-btn>
            <b-btn
              v-if="actions.delete || actions.remove"
              @click.stop="remove(row.item[$config.primaryKey])"
            >{{$t('actions.delete')}}</b-btn>
          </template>
        </b-table>

        <div class="row align-items-center">
          <div class="col-md-10">
            <b-pagination
              :limit="pageLimit"
              v-model="currentPage"
              :total-rows="total"
              :per-page="perPage"
            ></b-pagination>
          </div>
          <div class="col-md-2 text-right">
            {{$t('messages.paginate', {total: total})}}
          </div>
        </div>
      </div>
    </div>
  </b-card>
</template>

<script>
import { mapState } from "vuex";
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
      pageLimit: 10, //display how many page buttons
      currentPage: 1,
      sortBy: this.$config.primaryKey,
      sortDesc: false,
      sortDirection: null,
      perPage: 10,
      where: {}
    };
  },
  watch: {
    "$route.params"(val) {
      this.fetch();
    }
    // page(val) {}
  },
  computed: {
    actions() {
      return _.get(this.table, "fields._actions", {});
    },
    ...mapState(["auth"]),
    uri() {
      return this.$route.params.uri.replace(/\./g, "/");
    }
  },
  methods: {
    doSearch(params) {
      this.where = params;
      this.$refs.table.refresh();
      // console.log(params);
    },
    applyRouteQuery() {
      const { sort = {}, page = 1, where = {} } = JSON.parse(
        this.$route.query.query || "{}"
      );
      const [sortBy, sortDesc] = Object.entries(sort).pop() || [];
      this.sortBy = sortBy;
      this.sortDesc = sortDesc === -1 ? true : false;
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
    fetchData(ctx) {
      const query = {
        page: ctx.currentPage,
        sort: { [ctx.sortBy]: this.sortDesc ? -1 : 1 },
        where: this.where
      };

      if (!this.init) {
        // this.$router.replace({
        //   query: { query: JSON.stringify(query) }
        // });
        return [];
      }
      // this.$router.push({
      //   query: { query: JSON.stringify(query) }
      // });
      return this.$http
        .get(this.uri, {
          params: {
            query: JSON.stringify(query)
          }
        })
        .then(res => {
          const { total, data } = res.data;
          this.total = total;
          return data;
        });
    },
    fetch() {
      this.init = false;

      this.$http.get(this.uri + "/grid").then(res => {
        this.table = res.data;
        if (typeof this.table.fields._actions === "undefined") {
          this.table.fields._actions = {
            edit: true,
            view: true,
            delete: true
          };
        }
        this.init = true;
        this.$refs.table.refresh();
      });
    }
  },
  mounted() {},
  created() {
    // this.applyRouteQuery();

    this.fetch();
    // this.fetchTable();
  }
};
</script>

