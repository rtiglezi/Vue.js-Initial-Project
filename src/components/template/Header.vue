<template>
  <div class="header">
    <b-navbar toggleable="lg" type="dark" class="header-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title" @click="navigate('/')">
        <img src="@/assets/c-proc.png" alt="Logo" width="30" />ceproc
      </b-navbar-brand>
      <span class="mr-3 client">[{{ user.tenant }}]</span>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="user.profiles.indexOf('master')!=-1">
          <b-nav-item-dropdown text="Configuração">
            <template slot="button-content">
              <i class="fas fa-meteor"></i>
              Criação
            </template>
            <b-dropdown-item href="#" @click="navigate('/admin/tenants')">
              <i class="fa fa-building mr-1 admin-icon"></i>Inquilinos
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav v-if="user.profiles.indexOf('admin')!=-1">
          <b-nav-item-dropdown text="Administração">
            <template slot="button-content">
              <i class="fa fa-cogs"></i>
              Administração
            </template>
            <b-dropdown-item href="#" @click="navigate('/admin/users')">
              <i class="fa fa-users mr-1 admin-icon"></i>Usuários
            </b-dropdown-item>
            <b-dropdown-item href="#" @click="navigate('/admin/divisions')">
              <i class="fa fa-sitemap mr-1 admin-icon"></i>Unidades
            </b-dropdown-item>
            <b-dropdown-item href="#" @click="navigate('/admin/requests')">
              <i class="fas fa-tags mr-1 admin-icon"></i>Demandas
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <!--
          <b-nav-form class="mr-5">
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button variant="dark" size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
          -->

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

export default {
  name: "Header",
  computed: mapState(["user"]),
  props: {
    title: String,
  },
  data: function(){
    return {
    }
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    },
    logout() {
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$router.push({ name: "auth" });
    }
  },
  mounted(){
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
  color: #f2e15d;
  font-weight: bold;
}
</style>
