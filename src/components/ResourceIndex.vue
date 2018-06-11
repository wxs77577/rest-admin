<template>
  <div>
    
      <b-data-table :resource="resource"></b-data-table>
    
  </div>
</template>

<script>
import BDataTable from './DataTable'

export default {
  name: "resource-index",
  components: {
    BDataTable
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
