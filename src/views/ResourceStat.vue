<template>
  <div >
    <b-row>
      <b-col cols="6" lg="8">
       
          <b-card :header="resource">
            <b-data-chart :resource="resource" :id="id" :group="group" />
          </b-card>
        
      </b-col>
    </b-row>
  </div>
</template>

<script>

import BDataChart from '../components/DataChart'

export default {
  name: "resource-stat",
  components: {
    BDataChart
  },
  data() {
    return {

    };
  },
  computed: {
    group() {
      return this.$route.query.group || 'status'
    }
  },
  methods: {
    
  },
  created() {
    
  }
};
</script>
