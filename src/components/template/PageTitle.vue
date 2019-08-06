<template>
  <div
    style="padding: 3px; 
     text-align:center; 
     border-style: solid; 
     border-width:1px; 
     border-color: #ccc; 
     border-radius: 3px;
     background-color: #eee;
     margin-bottom: 10px;"
  >
    <button
      v-b-popover.hover.top="'Home'"
      @click="navigate('/')"
      :class="getClass(main, 'home')"
    >
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
  </div>
</template>

<script>
import { userKey } from "@/global";
import { mapState } from "vuex";

export default {
  name: "PageTitle",
  props: ["main"],
  computed: mapState(["user"]),
  methods: {
    navigate(link) {
      this.$router.push(link);
    },
    getClass(main, button) {
      if (main == button) {
        return "button-menu-active btn btn-dark";
      } else {
        return "button-menu btn btn-dark";
      }
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
</style>
