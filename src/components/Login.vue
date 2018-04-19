<template>
  <div class="app flex-row align-items-center">
    <div class="container animated fadeIn">
      <div class="row justify-content-center">
        <div class="col-md-9 col-xl-8">
          <div class="card-group">
            <div class="card p-4">
              <div class="card-body">
                <h1>{{this.$t('actions.login')}}</h1>
                <p class="text-muted">{{$t('message.login_please')}}</p>
                <b-form-builder action="login" :fields="fields" v-model="model" 
                @success="onSuccess" :submitText="$t('actions.login')" backText="" />
      
              </div>
            </div>
            <div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <div class="card-body text-center">
                <div>
                  <h2>{{site.name || 'REST ADMIN'}} - {{$t('messages.dashboard')}}</h2>
                  <p>{{site.description}}</p>
                  <button type="button" class="btn btn-primary active mt-3">{{$t('messages.go_home')}}</button>
                </div>
              </div>
            </div>
          </div>
                
          
          <p class="text-muted m-5 text-center">{{$t('messages.login_footer')}}</p>
          <languages class="text-center" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { types } from "../store";
import { mapState } from "vuex";
import Languages from "./Languages";

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
          placeholder: this.$t("fields.username"),
          icon: "icon-user"
        },
        password: {
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
        path: "/"
      });
    }
  },
  mounted() {
    this.$store.commit(types.SET_AUTH, {});
  }
};
</script>
