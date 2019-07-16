<template>
  <div class="tenant-admin">
    <PageTitle
      icon="fa fa-address-card"
      main="Cadastro de Inquilinos"
      sub="Área administrativa de acesso restrito"
    />

    <!-- INICIO FORMULÁRIO DE CADASTRO -->
    <b-form v-if="showCad" v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
      <b-card class="mb-3 box-out">
        <b-card class="box">
          <b-row>
            <b-col md="3" sm="12" class="box-ico">
              <i class="fa fa-building fa-5x" aria-hidden="true"></i>
              <br />Cadastro de Inquilino
            </b-col>
            <b-col md="9" sm="12">
              <b-form-group label="Apelido do Inquilino *" label-for="tenantAlias">
                <b-form-input
                  class="input-text"
                  ref="tenantAlias"
                  name="Apelido"
                  id="tenantAlias"
                  v-model="tenant.tenant_alias"
                  :readonly="mode === 'remove'"
                  v-validate="{ required: true, min: 3 }"
                ></b-form-input>
                <span
                  ref="spnApelido"
                  v-if="showSpanError('Apelido')"
                  class="adm-msg-error"
                >{{ errors.first('Apelido') }}</span>
              </b-form-group>

              <b-form-group label="Nome do Inquilino *" label-for="tenantName">
                <b-form-input
                  class="input-text"
                  ref="tenantName"
                  name="Nome"
                  id="tenantName"
                  v-model="tenant.tenant_name"
                  :readonly="mode === 'remove'"
                  v-validate="{ required: true, min: 3 }"
                ></b-form-input>
                <span
                  ref="spnNome"
                  v-if="showSpanError('Nome')"
                  class="adm-msg-error"
                >{{ errors.first('Nome') }}</span>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-card>

      <div class="text-right">
        <b-button class="btn-main ml-2" v-if="mode === 'save'" @click="save">
          <i class="fa fa-send fa-lg"></i>
          Inserir
        </b-button>
        <b-button class="btn-main ml-2" v-if="mode === 'edit'" @click="save">
          <i class="fa fa-pencil fa-lg"></i>
          Editar
        </b-button>
        <b-button variant="danger" class="ml-2" v-if="mode === 'remove'" @click="remove">
          <i class="fa fa-trash fa-lg"></i>
          Excluir?
        </b-button>
        <b-button @click="refresh(true)" class="ml-2">
          <i class="fa fa-eraser fa-lg"></i>
          Limpar
        </b-button>
        <b-button @click="showCad = false" class="btn-list ml-4">
          {{totalRows}} registro(s)
          <i class="fa fa-arrow-right fa-lg ml-1"></i>
        </b-button>
      </div>
    </b-form>
    <!-- FINAL FORMULÁRIO DE CADASTRO -->

    <!-- INÍCIO DA LISTA -->
    <div v-if="!showCad">
      <b-row class="mb-2">
        <b-col></b-col>
        <b-col>
          <b-input-group>
            <b-form-input small ref="txtFilter" v-model="filter" placeholder="Busca rápida ..."></b-form-input>
            <b-input-group-append>
              <b-button :disabled="!filter" @click="filter = ''">Limpar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>

      <div class="layer-total">Total de {{ totalRows }} registro(s)</div>

      <b-table
        id="my-table"
        :items="tenants"
        :per-page="perPage"
        :current-page="currentPage"
        small
        responsive
        bordered
        :filter="filter"
        :fields="items"
        @filtered="onFiltered"
      >
        <template slot="created_at" slot-scope="row">
          {{
          (new Date(row.item.created_at).getDate().toString().length == 1) ? "0" + new Date(row.item.created_at).getDate() : new Date(row.item.created_at).getDate()
          }}/{{
          ((new Date(row.item.created_at).getMonth() + 1).toString().length == 1) ? "0" + (new Date(row.item.created_at).getMonth()+1) : (new Date(row.item.created_at).getMonth())+1
          }}/{{
          new Date(row.item.created_at).getFullYear()
          }}
        </template>

        <template slot="actions" slot-scope="data">
          <b-button @click="loadDivision(data.item, 'edit')">
            <i class="fa fa-pencil" title="Editar o registro."></i>
          </b-button>

          <b-button variant="danger" class="ml-1" @click="loadDivision(data.item, 'remove')">
            <i class="fa fa-trash" title="Excluir o registro."></i>
          </b-button>
        </template>
      </b-table>

      <b-row>
        <b-col>
          <b-button @click="refreshPage();">
            <i class="fa fa-arrow-left fa-lg mr-1"></i>Novo Cadastro
          </b-button>
        </b-col>
        <b-col>
          <b-pagination
            small
            align="right"
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="my-table"
          ></b-pagination>
        </b-col>
      </b-row>
    </div>
    <!-- FINAL DA LISTA -->
  </div>
</template>

<script>
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
import Confirm from "./Confirm";

export default {
  name: "tenantAdmin",
  components: { PageTitle, Confirm },
  data: function() {
    return {
      btnCancelDisabled: false,
      mode: "save",
      tenants: [],
      tenant: {},
      showCad: true,
      totalRows: 1,
      filter: null,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],

      items: [
        {
          key: "created_at",
          label: "Cadastro",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "tenant_alias",
          label: "Apelido",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "tenant_name",
          label: "Nome",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "actions",
          label: "Ações",
          sortable: false,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        }
      ]
    };
  },
  methods: {
    loadDivisions() {
      const url = `${baseApiUrl}/tenants`;
      axios.get(url).then(res => {
        this.tenants = res.data;
        this.totalRows = res.data.length;
      });
    },
    loadDivision(tenant, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/tenants/${tenant._id}`;
      axios.get(url).then(res => {
        this.tenant = res.data;
        this.showCad = !this.showCad;
      });
    },
    save() {
      const method = this.tenant._id ? "patch" : "post";
      const id = this.tenant._id ? `/${this.tenant._id}` : "";

      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/tenants${id}`, this.tenant)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.tenant._id;
      axios
        .delete(`${baseApiUrl}/tenants/${id}`)
        .then(() => {
          this.refresh();
        })
        .catch(showError);
    },
    setFocus() {
      this.$refs.tenantName.$el.focus();
    },
    showSpanError(campo) {
      let obj = this.errors.items;
      let index = obj.findIndex(val => val.field == campo);
      if (index < 0) {
        return false;
      } else {
        return true;
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    refresh(isCleaningForm) {
      let doRefreshPage = true;

      if (!isCleaningForm) {
        switch (this.mode) {
          case "save":
            this.loadDivisions();
            this.$toasted.global.defaultSuccess({
              msg: `Registro inserido com sucesso. ${this.totalRows +
                1} registro(s) até agora.`
            });

            break;
          case "edit":
            this.$toasted.global.defaultSuccess({
              msg: "Registro editado com sucesso."
            });
            break;
          case "remove":
            this.$toasted.global.defaultSuccess({
              msg: "Registro excluído do sistema com sucesso."
            });
            this.showCad = false;
            doRefreshPage = false;
            break;
        }
      }

      this.loadDivisions();

      if (doRefreshPage) {
        this.refreshPage();
      }
    },
    refreshPage() {
      let msg = "Formulário pronto para nova inserção.";
      this.$router.push(`/admin/confirm?origin=tenants&msg=${msg}`);
    },
    submitByKey() {
      if (this.mode === "save" || this.mode === "edit") {
        this.save();
      } else if (this.mode === "remove") {
        this.remove();
      }
    }
  },
  mounted() {
    if (!this.mode) {
      this.mode = "save";
    }
    this.loadDivisions();
    this.setFocus();
  }
};
</script>

<style>
</style>
