<template>
  <div class="app flex-row align-items-center">
    <div class="container animated fadeIn">
      <div class="row justify-content-center">
        <div class="col-md-9 col-xl-8">
          <div class="card-group">
            <div class="card p-4">
              <div class="card-body">
                <h1>Login</h1>
                <p class="text-muted">请先登录</p>

                <b-form-builder action="login" :fields="fields" v-model="model" @success="onSuccess" submitText="登录" backText="" />
                  
                </b-form>

              </div>
            </div>
            <div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <div class="card-body text-center">
                <div>
                  <h2>{{site.name}} - 控制台</h2>
                  <p>{{site.description}}</p>
                  <button type="button" class="btn btn-primary active mt-3">返回首页</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { types } from "../store";
import { mapState } from "vuex";

export default {
  name: "Login",
  computed: {
    ...mapState(["auth", "site"])
  },
  data() {
    return {
      fields: {
        username: { placeholder: "用户名", icon: "icon-user" },
        password: { placeholder: "密码", icon: "icon-lock", type: "password" }
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
