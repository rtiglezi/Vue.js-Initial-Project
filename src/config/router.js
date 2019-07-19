import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/components/home/Home";
import TenantAdmin from "@/components/admin/TenantAdmin";
import UserAdmin from "@/components/admin/UserAdmin";
import DivisionAdmin from "@/components/admin/DivisionAdmin";
import RequestAdmin from "@/components/admin/RequestAdmin";
import StageAdmin from "@/components/admin/StageAdmin";

import Auth from "@/components/auth/Auth";
import Profile from "@/components/admin/Profile";

Vue.use(VueRouter);

const routes = [
  {
    name: "home",
    path: "/",
    component: Home
  },
  { name: "auth", path: "/auth/:email?", component: Auth },
  { name: "profile", path: "/admin/users/profile", component: Profile },
  {
    name: "tenantAdmin",
    path: "/admin/tenants",
    component: TenantAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "userAdmin",
    path: "/admin/users",
    component: UserAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "divisionAdmin",
    path: "/admin/divisions",
    component: DivisionAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "requestAdmin",
    path: "/admin/requests",
    component: RequestAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "stageAdmin",
    path: "/admin/stages",
    component: StageAdmin,
    meta: { requiresAdmin: true }
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
