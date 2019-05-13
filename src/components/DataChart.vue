<script>
// import Chart from "vue-chartjs";

export default {
  // extends: Chart.Pie,
  props: {
    resource: {
      type: String,
      required: true
    },
    group: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      options: {}
    };
  },
  computed: {
    resourceUri() {
      return this.resource + "/stat";
    }
  },
  methods: {
    async fetch() {
      const { data } = await this.$http.get(this.resourceUri, {
        params: { group: this.group }
      });
      this.options = data;
      this.renderChart(this.options);
    }
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.fetch();
  }
};
</script>

