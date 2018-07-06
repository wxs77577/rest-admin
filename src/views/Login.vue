<template>
  <div class="app login-container flex-row align-items-center" :style="site.login_style">
    <div class="container animated fadeIn">
      <div class="row justify-content-center">
        <div class="col-md-9 col-xl-8">
          <div class="card-group">
            <div class="card p-4">
              <div class="card-body">
                <!-- <h1>{{this.$t('actions.login')}}</h1> -->
                <img :src="site.login_logo" style="margin-bottom:20px">
                <!-- <p class="text-muted">{{$t('message.login_please')}}</p> -->
                <b-form-builder action="login" :fields="fields" v-model="model" 
                @success="onSuccess" :submitText="$t('actions.login')" backText="" />
      
              </div>
            </div>
            <div class="card text-white  py-5 d-md-down-none" :style="site.desbg_style">
              <div class="card-body text-center align-items-center d-flex">
                <div>
                  <!-- <h2>{{site.name || 'REST ADMIN'}} - {{$t('messages.dashboard')}}</h2> -->
                  <p>{{site.description}}</p>
                  <!-- <button type="button" class="btn btn-primary active mt-3">{{$t('messages.go_home')}}</button> -->
                </div>
              </div>
            </div>
          </div>
                
          
          <p class="text-muted m-5 text-center">{{site.login_footer || $t('messages.login_footer')}}</p>
          <languages class="text-center" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { types } from "../store";
import { mapState } from "vuex";
import Languages from "../components/Languages";

export default {
  name: "Login",
  components: { Languages },
  computed: {
    ...mapState(["auth", "site"])
  },
  data() {
    return {
      fields: {
        username: {
          label: this.$t("fields.username"),
          placeholder: this.$t("fields.username"),
          icon: "icon-user"
        },
        password: {
          label: this.$t("fields.password"),
          placeholder: this.$t("fields.password"),
          icon: "icon-lock",
          type: "password"
        }
      },
      model: {
        username: "",
        password: ""
      },
      errors: []
    };
  },
  methods: {
    onSuccess(data) {
      this.$store.commit(types.SET_AUTH, data);
      this.$store.dispatch(types.FETCH_SITE);
      this.$router.push({
        path: data.redirect || '/'
      });
    }
  },
  mounted() {
    
  }
};
</script>

<style>
.login-container{
  height: 100%;
}
</style>
