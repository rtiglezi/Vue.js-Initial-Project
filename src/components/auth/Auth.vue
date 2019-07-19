<template>
  <div class="auth-content" v-on:keyup.enter="submitByKey">
    <div class="auth-modal">
      <img src="@/assets/c-proc.png" alt="Logo" width="80" align="left" />
      <span class="auth-logo">ceproc</span>

      <hr />

      <div v-if="!forgotPass" class="text-center">
        <div class="auth-title">Login</div>
        <input v-model="user.email" type="text" placeholder="E-mail" />
        <input v-if="!forgotPass" v-model="user.password" type="password" placeholder="Senha" />
        <button @click="signin" class="mb-3">Entrar</button>
        <div>
          <a href="#" @click="forgotPass = true">Esqueci a senha</a>
        </div>
      </div>

      <div v-if="forgotPass" class="text-center">
        <div class="auth-title">Redefinir a Senha</div>
        <b-form-input v-model="user.email" type="text" placeholder="E-mail" />
        <div :class="lblClass">{{txtLabel}}</div>
        <div class="mt-3"><b-button @click="forgot" class="mb-3">{{ txtButton }}</b-button></div>
        <div><a href="#" @click="forgotPass = false">Voltar ao login</a></div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "Auth",
  data: function() {
    return {
      user: {},
      forgotPass: false,
      queryEmail: "",
      txtButton: "Redefinir",
      txtLabel: "",
      lblClass: ""
    };
  },
  methods: {
    signin() {
      axios
        .post(`${baseApiUrl}/users/authenticate`, this.user)
        .then(res => {
          this.$store.commit("setUser", res.data);
          localStorage.setItem(userKey, JSON.stringify(res.data));
          this.$router.push({ path: "/" });
          this.$toasted.global.defaultSuccess({
            msg: `Bem-vindo, ${res.data.name}.`
          });
        })
        .catch(e => {
          if (e) {
            showError("Credenciais inválidas.");
          }
        });
    },
    forgot() {
      this.txtButton = "Enviando...";
      const email = this.user.email;
      const url = `${baseApiUrl}/users/forgotpass/${email}/localhost:8081`;
      axios
        .get(url)
        .then(() => {
          this.txtLabel = "E-mail enviado. Consulte sua caixa de mensagens.";
          this.txtButton = "Redefinir";
          this.lblClass = "lblSuccess";
        })
        .catch(e => {
          this.txtLabel = `Ocorreu um erro ao tentar eviar o e-mail: ${e.response.data.message}`;
          this.txtButton = "Tentar novamente";
          this.lblClass = "lblErr";
        });
    },
    submitByKey() {
      if (!this.forgotPass) {
        this.signin();
      } else {
        this.forgot();
      }
    }
  },
  mounted() {
    if (this.$route.query.email) {
      this.forgotPass = true;
      this.email = this.$route.query.email;
      this.user.email = this.$route.query.email;
    }
  }
};
</script>

<style>
.auth-content {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
}

.auth-modal {
  background-color: #fff;
  width: 350px;
  padding: 35px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);

  display: flex;
  flex-direction: column;
  align-items: center;
}

.auth-logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.auth-title {
  font-size: 1.2rem;
  font-weight: 100;
  margin-top: 10px;
  margin-bottom: 15px;
}

.auth-modal input {
  border: 1px solid #bbb;
  width: 100%;
  margin-bottom: 15px;
  padding: 3px 8px;
}

.auth-modal button {
  align-self: flex-end;
  background-color: #2460ae;
  color: #fff;
  padding: 5px 15px;
}

.auth-modal a {
  margin-top: 35px;
}

.auth-modal hr {
  border: 0;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(120, 120, 120, 0),
    rgba(120, 120, 120, 0.75),
    rgba(120, 120, 120, 0)
  );
}

.lblErr {
  color: red;
}

.lblSuccess {
  color: green;
}
</style>
