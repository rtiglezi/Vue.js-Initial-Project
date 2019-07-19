<template>
  <div class="tenant-admin">
    <PageTitle
      icon="fa fa-users"
      main="Cadastro de Usuários"
      sub="Área administrativa de acesso restrito"
    />

    <b-modal
      size="lg"
      v-bind:hide-footer="true"
      id="mymodal"
      v-model="modalShow"
      title="Cadastro de Inquilino"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-card class="mb-2 box-out">
          <b-card class="box">
            <b-row>
              <b-col md="3" sm="12" class="box-ico">
                <i class="fa fa-user fa-5x" aria-hidden="true"></i>
                <br />Dados Cadastrais
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
                <i class="fas fa-user-lock fa-5x" aria-hidden="true"></i>
                <br />Permissões
              </b-col>

              <b-col md="8" sm="12">
                <b-row>
                  <b-col>
                    <div>Pertencente ao inquilino:</div>
                    <b-form-select v-model="user.tenant" @change="loadDivisions($event)">
                      <option
                        v-for="tenant in tenants"
                        :value="tenant._id"
                        :key="tenant._id"
                      >{{tenant.alias}}</option>
                    </b-form-select>
                  </b-col>
                </b-row>
                <hr />
                <b-row>
                  <b-col>
                    <b-form-group
                      label="Tem acesso à(s) unidade(s):"
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
                <hr />
                <b-row>
                  <b-col>
                    <b-form-group label="Perfil(is) de acesso:" label-for="user-profiles">
                      <b-form-checkbox-group
                        stacked
                        id="user-profiles"
                        v-model="user.profiles"
                        name="profiles"
                      >
                        <b-form-checkbox disabled value="user">user</b-form-checkbox>
                        <b-form-checkbox
                          v-for="profile in profiles"
                          :key="profile.name"
                          :value="profile.name"
                        >{{ profile.name }}</b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-col>
                </b-row>
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
            <i class="fas fa-save fa-lg"></i>
            Salvar Edição
          </b-button>
          <b-button variant="danger" class="ml-2" v-if="mode === 'remove'" @click="remove">
            <i class="far fa-trash-alt fa-lg"></i>
            Excluir?
          </b-button>
          <b-button class="ml-2" variant="secondary" @click="clickModalBtn()">Cancelar</b-button>
        </div>
      </b-form>
      <!-- FINAL FORMULÁRIO DE CADASTRO -->
    </b-modal>

    <!-- INÍCIO DA LISTA -->
    <div>
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

        <template slot="tenantDetails" slot-scope="row">
          <div
            v-for="(item, index) in row.item.tenantDetails"
            :key="item.id"
            :index="index"
          >{{row.item.tenantDetails[index].alias}}</div>
        </template>

        <template slot="allowedDivisionsDetails" slot-scope="row">
          <div
            v-for="(item, index) in row.item.allowedDivisionsDetails"
            :key="item.id"
            :index="index"
          >{{row.item.allowedDivisionsDetails[index].name}}</div>
        </template>

        <template slot="profiles" slot-scope="row">
          <div v-for="(value, key) in row.item.profiles" :key="key">{{ value }}</div>
        </template>

        <template slot="actions" slot-scope="data">
          <b-button v-b-modal="'mymodal'" @click="loadResource(data.item, 'edit')">
            <i class="fas fa-pen-square" title="Editar o registro."></i>
          </b-button>

          <b-button
            v-b-modal="'mymodal'"
            variant="danger"
            class="ml-1"
            @click="loadResource(data.item, 'remove')"
          >
            <i class="far fa-trash-alt" title="Excluir o registro."></i>
          </b-button>
        </template>
      </b-table>
    </div>

    <b-row>
      <b-col>
        <b-button v-b-modal="'mymodal'" @click="firstForm">
          <i class="fas fa-plus"></i> Adicionar
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

    <!-- FINAL DA LISTA -->
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  name: "UserAdmin",
  components: { PageTitle },
  data: function() {
    return {
      profilesLoggedUser: [],
      modalShow: false,
      btnCancelDisabled: false,
      mode: "save",
      divisions: [],
      tenants: [],
      profiles: [],
      user: {
        profiles: ["user"]
      },
      totalRows: 1,
      filter: null,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      users: [],
      items: [
        {
          key: "created_at",
          label: "Cadastro",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "name",
          label: "Nome",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "email",
          label: "E-mail",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "tenantDetails",
          label: "Pertencente:",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "allowedDivisionsDetails",
          label: "Pode acessar:",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "profiles",
          label: "Perfis",
          sortable: true,
          class: "text-center",
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
    clickModalBtn() {
      this.modalShow = false;
    },
    loadTenants() {
      const url = `${baseApiUrl}/tenants`;
      axios.get(url).then(res => {
        this.tenants = res.data;
      });
    },
    loadDivisions(tenant) {
      const url = `${baseApiUrl}/divisions?tenant=${tenant}`;
      axios.get(url).then(res => {
        this.divisions = res.data;
      });
    },
    loadResource(user, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/users/${user._id}`;
      axios.get(url).then(res => {
        this.user = res.data;
      });
    },
    save() {
      const method = this.user._id ? "patch" : "post";
      const id = this.user._id ? `/${this.user._id}` : "";

      if (this.mode === "save") {
        let aleatoryPass = Math.floor(Math.random() * 99999999);
        this.user.password = aleatoryPass;
      }

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
    showSpanError(campo) {
      let obj = this.errors.items;
      let index = obj.findIndex(val => val.field == campo);
      if (index < 0) {
        return false;
      } else {
        return true;
      }
    },
    loadResources() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
        this.users = res.data;
        this.totalRows = res.data.length;
      });
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    refresh() {
      switch (this.mode) {
        case "save":
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
          break;
      }
      this.firstForm();
    },

    submitByKey() {
      if (this.mode === "save" || this.mode === "edit") {
        this.save();
      } else if (this.mode === "remove") {
        this.remove();
      }
    },

    firstForm() {
      this.clickModalBtn();
      this.mode = "save";
      this.loadTenants();
      this.loadResources();
      this.getProfilesLoggedUser();

      if (this.profilesLoggedUser.indexOf("master") != -1) {
        this.profiles = [{ name: "admin" }];
      } else {
        this.profiles = [];
      }

      this.user = {
        profiles: ["user"]
      };
    },

    getProfilesLoggedUser() {
      let loggedUser = JSON.parse(localStorage.getItem(userKey));
      this.profilesLoggedUser = loggedUser.profiles;
    }
  },
  mounted() {
    this.firstForm();
  }
};
</script>

<style>
</style>
