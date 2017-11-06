<template>
  <div class="my-3">
    
      <b-data-table :resource="resource"></b-data-table>
    
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
