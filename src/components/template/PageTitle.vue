<template>
  <div class="header pb-2 mb-2">
    <b-navbar toggleable="lg" type="dark" class="header-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title">
        <img src="@/assets/c-proc.png" alt="Logo" width="30" />ceproc
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-3">
          <b-nav-item-dropdown left>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <i class="fa fa-cogs admin-icon mr-1"></i>
              <span style="color:#eee">Administração</span>
            </template>
            <b-dropdown-item
              v-if="user.profiles.indexOf('master')!=-1"
              href="#"
              @click="navigate('/admin/tenants')"
            >
              <i class="fa fa-building admin-icon"></i> Inquilinos
            </b-dropdown-item>
            <b-dropdown-item
              v-if="user.profiles.indexOf('admin')!=-1"
              href="#"
              @click="navigate('/admin/users')"
            >
              <i class="fa fa-users admin-icon"></i> Usuários
            </b-dropdown-item>
            <b-dropdown-item
              v-if="user.profiles.indexOf('admin')!=-1"
              href="#"
              @click="navigate('/admin/divisions')"
            >
              <i class="fa fa-sitemap admin-icon"></i> Unidades
            </b-dropdown-item>
            <b-dropdown-item
              v-if="user.profiles.indexOf('admin')!=-1"
              href="#"
              @click="navigate('/admin/demands')"
            >
              <i class="fa fa-tasks admin-icon"></i> Demandas
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form class="mr-3">
            <span style="color: #eee" class="mr-2">Pesquisar:</span>


            <b-form v-on:submit.prevent v-on:keyup.enter="emitToParent(number)">
      
            <b-form-input
              v-model="number"
              size="sm"
              placeholder="número do processo..."
            ></b-form-input>

            </b-form>

            <b-button
              size="sm"
              style="border-style: solid; border-color: #ffffff9e; border-size: 1px; background-color: orange"
              variant="danger"
              class="ml-1"
              v-b-popover.hover.top="'Pesquisar processo digitado'"
              @click="emitToParent(number)"
            >
              <i class="fas fa-search"></i>
            </b-button>

            <b-button
              size="sm"
              style="border-style: solid; border-color: #ffffff9e; border-size: 1px; background-color: red"
              v-b-popover.hover.top="'Listar todas os processos'"
              @click="emitToParent('')"
              class="ml-1"
            >
              <i class="fab fa-buffer fa-lg"></i>
            </b-button>

            <b-form-select
              size="sm"
              v-b-popover.hover.top="'Trocar a unidade atual'"
              id="input-horizontal"
              @change="changeDivision($event)"
              v-model="user.lastDivision"
              class="ml-2"
              style="background-color: #ddd; width:180px"
            >
              <option
                v-for="division in divisions"
                :value="division._id"
                :selected="division._id == user.lastDivision"
                :key="division._id"
              >{{division.name}}</option>
            </b-form-select>
          </b-nav-form>

          <b-nav-item-dropdown right>
            <template slot="button-content">
              <i class="fa fa-user admin-icon mr-1"></i>
              <span style="color:#eee">{{ user.name }}</span>
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
      divisions: [],
      number: "",
      processes: []
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
        return "isThePageClass";
      } else {
        return "isNotThePageClass";
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
    },

     emitToParent (number) {
      this.$router.push({ name: "process", params: { number } });
      this.$emit('childToParent', number)
      this.number = '';
    },

    showValue() {
      alert(this.number)
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
.isThePageClass {
  color: #f6e862;
}
.isThePageClass:hover {
  color: #f6e862;
}
.isNotThePageClass:hover {
  color: #ccc;
}
.isNotThePageClass {
  color: #ccc;
}
.header {
  background-color: #eee;
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
</style>
