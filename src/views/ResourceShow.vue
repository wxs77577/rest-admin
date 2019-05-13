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
  props: {
    id: {},
    resource: {},
  },
  computed: {

  },
  methods: {
    
  },
  created() {
    
  }
};
</script>
