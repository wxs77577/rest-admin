<template>
  <div>
    <b-row>
      <b-col cols="12">
       
          <b-data-table :resource="resource"></b-data-table>
        
      </b-col>
    </b-row>
      
    
  </div>
</template>

<script>
import BDataTable from '../components/DataTable'

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
