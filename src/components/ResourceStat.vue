<template>
  <div class="my-3">
    <b-row>
      <b-col cols="6" lg="8">
       
          <b-card :header="resource">
            <b-data-chart :resource="resource" :id="id" group="os" />
          </b-card>
        
      </b-col>
    </b-row>
  </div>
</template>

<script>

import bDataChart from './DataChart'

export default {
  name: "resource-stat",
  components: {
    bDataChart
  },
  data() {
    return {

    };
  },
  computed: {
    id() {
      return this.$route.params.id
    },
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
