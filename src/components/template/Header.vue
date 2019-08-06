<template>
  <div class="header">
    <b-navbar toggleable="lg" type="dark" class="header-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title">
        <img src="@/assets/c-proc.png" alt="Logo" width="30" />ceproc
      </b-navbar-brand>

      <span class="client">[{{ user.tenantAlias }}]</span>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form class="mr-5">
            <span style="color: white; margin-right: 2px;">Pesquisar:</span>
            <b-form-input size="sm" class="mr-sm-2" placeholder="número processo..."></b-form-input>

            <b-form-select size="sm" @change="changeDivision($event)">
              <option
                v-for="division in divisions"
                :value="division._id"
                :key="division._id"
              >{{division.name}}</option>
            </b-form-select>

            <i
              @click="navigate('/processes')"
              class="fab fa-buffer fa-2x ml-2"
              style="color:white; cursor:pointer"
            ></i>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <i class="fa fa-user admin-icon"></i>
              {{ user.name }}
            </template>
            <b-dropdown-item href="#" @click="navigate('/admin/users/profile')">
              <i class="fa fa-user-circle admin-icon"></i> Perfil
            </b-dropdown-item>
            <b-dropdown-item href="#" @click="logout()">
              <i class="fas fa-sign-out-alt admin-icon"></i> Sair
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { userKey } from "@/global";
import { mapState } from "vuex";

import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "Header",
  computed: mapState(["user"]),
  props: {
    title: String
  },
  data: function() {
    return {
      divisions: []
    };
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    },
    loadDivisions() {
      const url = `${baseApiUrl}/divisions`;
      axios.get(url).then(res => {
        this.divisions = res.data;
      });
    },
    changeDivision(division) {
      let userObj = {
        lastDivision: division
      }
      const url = `${baseApiUrl}/users/${this.user._id}/changedivision`;
      axios.patch(url, userObj).then(usr => {
        alert('Unidade alterada!')
        this.navigate('/processes')
      });
    },
    logout() {
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$router.push({ name: "auth" });
    }
  },
  mounted() {
    this.loadDivisions();
  }
};
</script>

<style>
.header {
  background-color: #ccc;
}
.header-nav {
  z-index: 2;
  background-color: #006999;
}
.header-title {
  font-weight: bold;
}
.header .admin-icon {
  color: #c8a741;
}
.header .client {
  text-align: center;
  color: white;
  font-weight: bold;
}
</style>
