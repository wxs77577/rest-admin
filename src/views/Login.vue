<template>
  <div class="login-container" :style="site.login_style">
    <el-row class="bg-white login-box flex-wrap" type="flex">
      <el-col :md="12" class="bg-primary d-flex justify-content-center align-items-center">
        <div class="card text-white py-5 d-md-down-none" :style="site.desbg_style">
          <div class="card-body text-center align-items-center d-flex">
            <div class style="width: 100%">
              <h2>{{site.name || 'REST ADMIN'}}</h2>
              <p>{{site.description || $t('messages.login_description')}}</p>
              <!-- <button type="button" class="btn btn-primary active mt-3">{{$t('messages.go_home')}}</button> -->

              <div>
                <locale-switcher class="text-center"></locale-switcher>
                
              </div>
              
            </div>
          </div>
        </div>
      </el-col>
      <el-col :md="12" class="p-4 text-center">
        <!-- <h1>{{$t('actions.login')}}</h1> -->
        <img :src="site.login_logo" style="margin-bottom:20px">
        <p class="text-muted">{{$t('messages.login_please')}}</p>
        <b-form-builder
          action="login"
          :fields="fields"
          v-model="model"
          @success="onSuccess"
          :submitText="$t('actions.login')"
          backText
        ></b-form-builder>
      </el-col>
      
    </el-row>
    <div class="mt-5 fs-sm text-muted" v-html="site.footer"></div>

  </div>
</template>

<script>
import { types } from "../store";
import { mapState } from "vuex";
import LocaleSwitcher from "../components/LocaleSwitcher";

export default {
  name: "Login",
  components: { LocaleSwitcher },
  computed: {
    ...mapState(["auth", "site"]),
    fields() {
      return {
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
      };
    }
  },
  data() {
    return {
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
        path: data.redirect || "/"
      });
    }
  },
  mounted() {
    this.$store.commit(types.SET_AUTH, {})
  }
};
</script>

<style lang="scss">
.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.login-box {
  box-shadow: 0 0px 30px rgba(0, 0, 0, 0.2);
  width: 40rem;
  max-width: 80vw;
}
</style>
