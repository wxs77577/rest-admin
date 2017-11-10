<template>
  <div class="my-3">
    <b-row>
      <b-col cols="12" xl="12">
       
          <b-data-form :resource="resource" :id="id"></b-data-form>
        
      </b-col>
    </b-row>
  </div>
</template>

<script>
import DataForm from './DataForm'
export default {
  name: "resource-edit",
  components: {
    'b-data-form': DataForm
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
