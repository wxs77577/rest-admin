<template>
  <b-card :header="resource">
    <div class="data-table">
      <b-table :sort-by.sync="sortBy" :sort-desc.sync="sortDesc" :no-local-sorting="true" :fields="fields" :items="items">
        <span v-for="(field, key) in fields" :key="key" :slot="key" slot-scope="row">
          
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
              {{row.value.substr(-6).toUpperCase()}}
            </span>
          </template>
          <template v-else>
            {{row.value}}
          </template>
        </span>
        <template slot="actions" slot-scope="row">
          <b-btn size="sm" @click.stop="show(row.item)">Details</b-btn>
        </template>

      </b-table>
      <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="page" />
    </div>
  </b-card>
</template>

<script>
export default {
  name: "b-data-table",
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
      perPage: 10,
      sortBy: null,
      sortDesc: true,
      fields: {},
      filter: {},
      choices: {},
      totalRows: 0,
      items: []
    };
  },
  computed: {
    with(){
      return _.filter(_.map(this.fields, (v, k) => v.ref && v.ref.split('.').shift()))
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
        };
      },
      set(val) {
        this.sort = val.sort;
        this.page = val.page;
        this.perPage = val.perPage;
      }
    }
  },
  watch: {
    "$route.params.resource": 'fetchGrid',
    "$route.params.id": 'fetch',
    "$route.query": 'fetch',
    query(val) {
      this.$router.push({
        query: {
          query: JSON.stringify(val)
        }
      });
    }
  },
  methods: {
    fetchAll() {
      // this.fetch()
      this.fetchGrid()
      // this.applyQuery()
    },
    fetch() {
      this.$http
        .get(this.resource, {
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
      this.$http.get(this.gridUri).then(({ data }) => {
        this.fields = data.fields;
        if (!this.fields.actions) {
          this.fields.actions = {}
        }
        this.choices = data.choices;
        this.fetch()
      });
    },
    applyQuery() {
      const query = this.$route.query.query;
      if (!query) {
        return
      }
      this.query = JSON.parse(query);
    },
    get(item, path) {
      const [model, field] = path.split('.')
      return item[model][field]
    },
    show(item) {
      this.$router.push({
        path: this.resource + '/' + item._id,
      })
    }
  },
  created() {
    this.fetchAll()

  }
};
</script>

<style>
.data-table td img {
  max-height: 3em;
}
</style>
