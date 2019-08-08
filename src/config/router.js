import Vue from "vue";
import VueRouter from "vue-router";

import Home from "@/components/home/Home";
import TenantAdmin from "@/components/admin/TenantAdmin";
import UserAdmin from "@/components/admin/UserAdmin";
import DivisionAdmin from "@/components/admin/DivisionAdmin";
import DemandAdmin from "@/components/admin/DemandAdmin";
import StageAdmin from "@/components/admin/StageAdmin";
import ProcessList from "@/components/process/Process";
import ProcessDetails from "@/components/process/ProcessDetails";
import AfterDivisionChange from "@/components/redirection/afterDivisionChange";


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
    name: "demandAdmin",
    path: "/admin/demands",
    component: DemandAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "stageAdmin",
    path: "/admin/stages",
    component: StageAdmin,
    meta: { requiresAdmin: true }
  },
  {
    name: "process",
    path: "/processes",
    component: ProcessList,
    meta: { requiresAdmin: false }
  },
  {
    name: "processDetails",
    path: "/processes/details",
    component: ProcessDetails,
    meta: { requiresAdmin: false }
  },
  {
    name: "afterDivisionChange",
    path: "/redirection/division",
    component: AfterDivisionChange,
    meta: { requiresAdmin: false }
  }
];

const router = new VueRouter({
  mode: "history",
  routes
});

export default router;
