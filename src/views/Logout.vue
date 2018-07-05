<script>
import types from '../store/types'
export default {
  mounted(){
    this.$store.commit(types.SET_AUTH, {})
    this.$router.replace({name: 'login'})
  }
}
</script>
