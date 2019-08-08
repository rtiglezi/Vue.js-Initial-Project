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
            <span style="color: white" class="mr-2">Pesquisar:</span>

            <b-form-input
              style="border-width:2px; 
                     border-color: #C8A741; 
                     border-radius: 3px;"
              class="mr-1"
              placeholder="número do processo..."
            ></b-form-input>

            <b-button style="background-color: orange">
              <i class="fas fa-search"></i>
            </b-button>
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

    <div style="height:3px"></div>

    <div
      style="padding:8px;
     text-align:center; 
     border-style: solid; 
     border-width:1px; 
     border-color: #ccc; 
     border-radius: 3px;
     background-color: #eee;
     margin-bottom: 8px;"
    >
      <button v-b-popover.hover.top="'Home'" @click="navigate('/')" :class="getClass(main, 'home')">
        <i class="fas fa-home fa-lg"></i>
      </button>

      <button
        v-b-popover.hover.top="'Inquilinos'"
        v-if="user.profiles.indexOf('master')!=-1"
        @click="navigate('/admin/tenants')"
        :class="getClass(main, 'tenants')"
      >
        <i class="fas fa-building fa-lg"></i>
      </button>

      <button
        v-b-popover.hover.top="'Usuários'"
        v-if="user.profiles.indexOf('admin')!=-1"
        @click="navigate('/admin/users')"
        :class="getClass(main, 'users')"
      >
        <i class="fas fa-users fa-lg"></i>
      </button>

      <button
        v-b-popover.hover.top="'Unidades'"
        v-if="user.profiles.indexOf('admin')!=-1"
        @click="navigate('/admin/divisions')"
        :class="getClass(main, 'divisions')"
      >
        <i class="fas fa-sitemap fa-lg"></i>
      </button>

      <button
        v-b-popover.hover.top="'Demandas'"
        v-if="user.profiles.indexOf('admin')!=-1"
        @click="navigate('/admin/demands')"
        :class="getClass(main, 'demands')"
      >
        <i class="fas fa-tasks fa-lg"></i>
      </button>

      <button
        v-b-popover.hover.top="'Processos'"
        @click="navigate('/processes')"
        :class="getClass(main, 'processes')"
      >
        <i class="fab fa-buffer fa-lg"></i>
      </button>

      <button
        v-b-popover.hover.top="'Perfil'"
        @click="navigate('/admin/users/profile')"
        :class="getClass(main, 'profile')"
      >
        <i class="fas fa-user-circle fa-lg"></i>
      </button>

      <b-form-select
        v-b-popover.hover.top="'Unidade preferencial'"
        id="input-horizontal"
        @change="changeDivision($event)"
        v-model="user.lastDivision"
        style="width:250px; border-style: solid; 
                border-width:1px; 
                border-color: #888; 
                border-radius: 3px;
                height: 37px;"
      >
        <option
          v-for="division in divisions"
          :value="division._id"
          :key="division._id"
        >{{division.name}}</option>
      </b-form-select>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { userKey } from "@/global";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "PageTitle",
  props: ["main"],
  computed: mapState(["user"]),
  data: function() {
    return {
      divisions: []
    };
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    },
    logout() {
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$router.push({ name: "auth" });
    },
    getClass(main, button) {
      if (main == button) {
        return "button-menu-active btn btn-dark";
      } else {
        return "button-menu btn btn-dark";
      }
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
      };
      const url = `${baseApiUrl}/users/${this.user._id}/changedivision`;
      axios.patch(url, userObj).then(() => {
        this.navigate("/redirection/division");
      });
    }
  },
  mounted() {
    if (this.user) {
      this.loadDivisions();
    }
  }
};
</script>

<style>
.button-menu {
  margin-right: 3px;
  font-size: 0.9em;
  padding-top: 8px;
  border-color: #aaa;
  border-radius: 2px;
  background-color: white;
  width: 50px;
  color: #555;
}

.button-menu-active {
  margin-right: 3px;
  font-size: 0.9em;
  padding-top: 8px;
  border-color: grey;
  border-radius: 2px;
  width: 50px;
}

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
