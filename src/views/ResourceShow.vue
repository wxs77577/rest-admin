<template>
  <div >
    <b-data-view :resource="resource" :id="id"></b-data-view>
  </div>
</template>

<script>
import BDataView from '../components/DataView'
export default {
  components: {
    BDataView
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
