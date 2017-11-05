<template>
  <div class="data-table">
    <b-table 
    :sort-by.sync="sortBy"
    :sort-desc.sync="sortDesc"
    :no-local-sorting="true"
    :fields="fields" 
    :items="items"
    >
      <span v-for="(field, key) in fields" :key="key" :slot="key" slot-scope="row">
        <template v-if="field.type == 'image'">
          <img :src="row.value" />
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
      perPage: 2,
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
          perPage: this.perPage
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
    sort: "fetch",
    page: "fetch",
    "$route.params": "fetchAll",
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
      this.fetch()
      this.fetchGrid()
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
      });
    },
    applyQuery() {
      const query = this.$route.query.query;
      if (!query) {
        return
      }
      this.query = JSON.parse(query);
    },
    show(item) {
      this.$router.push({
        path: this.resource + '/' + item._id,
      })
    }
  },
  created() {
    this.fetchAll()
    this.applyQuery();
  }
};
</script>

<style>
.data-table td img {
  height: 3em;
}
</style>
