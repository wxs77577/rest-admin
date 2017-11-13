<template>
  <div class="my-3">
    <b-row>
      <b-col cols="12" xl="12">
       
          <b-data-view :resource="resource" :id="id"></b-data-view>
        
      </b-col>
    </b-row>
  </div>
</template>

<script>
import DataView from './DataView'
export default {
  name: "resource-show",
  components: {
    'b-data-view': DataView
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
