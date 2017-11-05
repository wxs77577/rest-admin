<template>
  <div class="my-3">
    <b-card :header="resource">
      <b-data-table :resource="resource"></b-data-table>
    </b-card>
  </div>
</template>

<script>
import DataTable from './DataTable'

export default {
  name: "resource-index",
  components: {
    'b-data-table': DataTable
  },
  data() {
    return {

    };
  },
  computed: {
    resource() {
      return this.$route.params.resource
    }
  },
  methods: {
    
  },
  created() {
    
  }
};
</script>
