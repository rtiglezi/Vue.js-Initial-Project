<template>
  <div class="user-admin">
    <PageTitle
      icon="fa fa-users"
      main="Cadastro de Usuários"
      sub="Área administrativa de acesso restrito"
    />

    <!-- INICIO FORMULÁRIO DE CADASTRO -->
    <b-form v-if="showCad" v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
      <b-card class="mb-2 box-out">
        <b-card class="box">
          <b-row>
            <b-col md="3" sm="12" class="box-ico">
              <i class="fa fa-users fa-5x" aria-hidden="true"></i>
              <br />Dados Cadastrais do
              <br />USUÁRIO
            </b-col>
            <b-col md="9" sm="12">
              <b-form-group label="Nome *" label-for="userName">
                <b-form-input
                  ref="userName"
                  name="Nome"
                  id="userName"
                  class="input-text"
                  v-model="user.name"
                  :readonly="mode === 'remove'"
                  v-validate="{ required: true, min: 3 }"
                ></b-form-input>
                <span
                  ref="spnNome"
                  v-if="showSpanError('Nome')"
                  class="adm-msg-error"
                >{{ errors.first('Nome') }}</span>
              </b-form-group>

              <b-form-group label="E-mail *" label-for="user-email">
                <b-form-input
                  class="input-text"
                  prepend="@"
                  name="E-mail"
                  id="user-email"
                  v-model="user.email"
                  :readonly="mode === 'remove'"
                  v-validate="'required|email'"
                ></b-form-input>
                <span
                  v-if="showSpanError('E-mail')"
                  class="adm-msg-error"
                >{{ errors.first('E-mail') }}</span>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-card>

      <b-card class="mb-3 box-out">
        <b-card class="box">
          <b-row>
            <b-col md="3" sm="12" class="box-ico">
              <i class="fa fa-key fa-5x" aria-hidden="true"></i>
              <br />Pefis e
              <br />Permissões
            </b-col>

            <b-col md="4" sm="12">
              <b-form-group label="Perfis do usuário:" label-for="user-profiles">
                <b-form-checkbox-group
                  stacked
                  id="user-profiles"
                  v-model="user.profiles"
                  name="profiles"
                >
                  <b-form-checkbox disabled value="user">user</b-form-checkbox>
                  <b-form-checkbox :disabled="mode === 'remove'" value="admin">admin</b-form-checkbox>
                  <b-form-checkbox :disabled="mode === 'remove'" value="master">master</b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>
            </b-col>

            <b-col md="4" sm="12">
              <b-form-group
                label="Unidades a que este usuário tem acesso:"
                label-for="user-allowedDivisions"
              >
                <b-form-checkbox-group
                  stacked
                  id="user-allowedDivisions"
                  v-model="user.allowedDivisions"
                  name="divisions"
                >
                  <b-form-checkbox
                    v-for="division in divisions"
                    :key="division._id"
                    :value="division._id"
                  >{{ division.name }}</b-form-checkbox>
                </b-form-checkbox-group>
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
        <b-button @click="refresh(true)" class="btn-clean ml-2">
          <i class="fa fa-eraser fa-lg"></i>
          Limpar
        </b-button>
        <b-button @click="showCad = false" class="btn-list ml-4">
          Listagem
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
        :items="users"
        :per-page="perPage"
        :current-page="currentPage"
        bordered
        responsive
        small
        :filter="filter"
        :fields="fields"
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

        <template slot="profiles" slot-scope="row">
          <ul>
            <li v-for="(value, key) in row.item.profiles" :key="key">{{ value }}</li>
          </ul>
        </template>

        <template slot="allowedDivisionsDetails" slot-scope="row">
          <ul>
            <li
              v-for="(item, index) in row.item.allowedDivisionsDetails"
              :key="item.id"
              :index="index"
            >{{row.item.allowedDivisionsDetails[index].name}}</li>
          </ul>
        </template>

        <template slot="actions" slot-scope="data">
          <b-button @click="loadUser(data.item, 'edit')">
            <i class="fa fa-pencil" title="Editar o registro."></i>
          </b-button>

          <b-button variant="danger" class="ml-1" @click="loadUser(data.item, 'remove')">
            <i class="fa fa-trash" title="Excluir o registro."></i>
          </b-button>
        </template>
      </b-table>

      <b-row>
        <b-col>
          <b-button @click="showCad = true">
            <i class="fa fa-arrow-left fa-lg mr-1"></i>Formulário
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
  name: "UserAdmin",
  components: { PageTitle, Confirm },
  data: function() {
    return {
      btnCancelDisabled: false,
      mode: "save",
      divisions: [],
      user: {
        profiles: ["user"]
      },
      showCad: true,
      totalRows: 1,
      filter: null,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      users: [],
      fields: [
        {
          key: "created_at",
          label: "Cadastro",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "name",
          label: "Nome",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "email",
          label: "E-mail",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "profiles",
          label: "Perfis",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "allowedDivisionsDetails",
          label: "Unidades",
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
      const url = `${baseApiUrl}/divisions`;
      axios.get(url).then(res => {
        this.divisions = res.data;
      });
    },
    loadUser(user, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/users/${user._id}`;
      axios.get(url).then(res => {
        this.user = res.data;
        this.showCad = !this.showCad;
      });
    },
    save() {
      const method = this.user._id ? "patch" : "post";
      const id = this.user._id ? `/${this.user._id}` : "";

      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/users${id}`, this.user)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.user._id;
      axios
        .delete(`${baseApiUrl}/users/${id}`)
        .then(() => {
          this.refresh();
        })
        .catch(showError);
    },
    setFocus() {
      this.$refs.userName.$el.focus();
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
    loadUsers() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
        this.users = res.data;
      });
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
            this.$toasted.global.defaultSuccess({
              msg: "Usuário inserido com sucesso."
            });
            break;
          case "edit":
            this.$toasted.global.defaultSuccess({
              msg: "Dados do usuário editados com sucesso."
            });
            doRefreshPage = false;
            break;
          case "remove":
            this.$toasted.global.defaultSuccess({
              msg: "Usuário excluído do sistema com sucesso."
            });
            break;
        }
      }

      this.loadUsers();

      if (doRefreshPage) {
        let msg = "Formulário pronto para nova inserção.";
        this.$router.push(`/admin/confirm?origin=users&msg=${msg}`);
      }
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
    this.loadUsers();
    this.loadDivisions();
    this.setFocus();
  }
};
</script>

<style>

.user-admin .box-out {
  background-color: rgba(187, 146, 13, 0.1);
}

.user-admin .box {
  background-color: rgba(253, 253, 253, 0.9);
  color: black;
  font-weight: 300;
}
.user-admin .box-ico {
  color: rgba(187, 146, 13, 0.8);
  text-align: center;
}

.user-admin .btn-main {
  background-color: rgba(187, 146, 13, 0.8);
  color: white;
}
.user-admin .btn-main:hover {
  background-color: rgba(187, 146, 13);
  color: white;
}

.user-admin .table-th {
  background-color: rgba(187, 146, 13, 0.5);
  color: #333;
  font-weight: 100;
}
.user-admin .table-td {
  background-color: white;
  color: black;
  font-size: 15px;
}

.user-admin .layer-total {
  background-color: rgba(187, 146, 13);
  color: #333;
  text-align: center;
  font-weight: 100;
  color: white;
}

.user-admin .input-text {
  border:1px solid rgba(187, 146, 13);
}

</style>
