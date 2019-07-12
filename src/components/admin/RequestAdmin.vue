<template>
  <draggable class="request-admin">
    <PageTitle
      icon="fa fa-paperclip"
      main="Cadastro de Pedidos"
      sub="Área administrativa de acesso restrito"
    />

    <!-- INICIO FORMULÁRIO DE CADASTRO -->
    <b-form v-if="showCad" v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
      <b-card class="mb-2 box-out">
        <b-card class="box">
          <b-row>
            <b-col md="3" sm="12" class="box-ico">
              <i class="fa fa-paperclip fa-5x" aria-hidden="true"></i>
              <br />Dados Cadastrais do
              <br />PEDIDO
            </b-col>
            <b-col md="9" sm="12">
              <b-form-group label="Descrição *" label-for="requestName">
                <b-form-input
                  ref="requestName"
                  name="Descrição"
                  id="requestName"
                  class="input-text"
                  v-model="request.name"
                  :readonly="mode === 'remove'"
                  v-validate="{ required: true, min: 3 }"
                  style="width: 100%"
                ></b-form-input>
                <span
                  ref="spnDescrição"
                  v-if="showSpanError('Descrição')"
                  class="adm-msg-error"
                >{{ errors.first('Descrição') }}</span>
              </b-form-group>
            </b-col>
          </b-row>
        </b-card>
      </b-card>

      <b-card class="mb-2 box-out">
        <b-card class="box">
          <b-row>
            <b-col md="3" sm="12" class="box-ico">
              <i class="fa fa-flag fa-5x" aria-hidden="true"></i>
              <br />Estágios
              <br />
            </b-col>
            <b-col md="9" sm="12">
              <draggable class="row">
                <input type="hidden" v-model="request.stages" />

                <draggable class="col-12">
                  
                  <div class="btn btn-link button" @click="add">
                    <i class="fa fa-plus mr-1"></i>adicionar estágio
                  </div>

                  <draggable tag="ul" :list="list" class="list-group" handle=".handle">
                    <li
                      class="list-group-item mt-1 mb-1"
                      v-for="(element, idx) in list"
                      :key="element.position"
                    >
                      <i class="fa fa-align-justify handle mr-3"></i>

                      <input type="text" class="form-control" style="width: 85%" v-model="element.name" />

                      <i class="fa fa-times close" @click="removeAt(idx)"></i>
                    </li>
                  </draggable>
                </draggable>
              </draggable>
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
        :items="requests"
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
          <b-button @click="loadRequest(data.item, 'edit')">
            <i class="fa fa-pencil" title="Editar o registro."></i>
          </b-button>

          <b-button variant="danger" class="ml-1" @click="loadRequest(data.item, 'remove')">
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
  </draggable>
</template>

<script>
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
import Confirm from "./Confirm";

let position = 3;
import draggable from "vuedraggable";

export default {
  name: "RequestAdmin",
  components: { PageTitle, Confirm, draggable },
  display: "Handle",
  data: function() {
    return {
      btnCancelDisabled: false,
      mode: "save",
      divisions: [],
      request: {
        stages: []
      },
      showCad: true,
      totalRows: 1,
      filter: null,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      requests: [],
      items: [
        {
          key: "name",
          label: "Descrição",
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
      ],
      list: [],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    loadDivisions() {
      const url = `${baseApiUrl}/divisions`;
      axios.get(url).then(res => {
        this.divisions = res.data;
      });
    },
    loadRequest(request, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/requests/${request._id}`;
      axios.get(url).then(res => {
        this.request = res.data;
        this.showCad = !this.showCad;

        const url2 = `${baseApiUrl}/requests/${request._id}/stages`;
        axios.get(url2).then(res2 => {
          this.list = res2.data;
        });
      });
    },
    save() {
      const method = this.request._id ? "patch" : "post";
      const id = this.request._id ? `/${this.request._id}` : "";

      this.request.stages = this.list;

      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/requests${id}`, this.request)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.request._id;
      axios
        .delete(`${baseApiUrl}/requests/${id}`)
        .then(() => {
          this.refresh();
        })
        .catch(showError);
    },
    setFocus() {
      this.$refs.requestName.$el.focus();
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
    loadRequests() {
      const url = `${baseApiUrl}/requests`;
      axios.get(url).then(res => {
        this.requests = res.data;
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
              msg: "Pedido inserido com sucesso."
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
              msg: "Pedido excluído do sistema com sucesso."
            });
            break;
        }
      }

      this.loadRequests();

      if (doRefreshPage) {
        let msg = "Formulário pronto para nova inserção.";
        this.$router.push(`/admin/confirm?origin=requests&msg=${msg}`);
      }
    },
    submitByKey() {
      if (this.mode === "save" || this.mode === "edit") {
        this.save();
      } else if (this.mode === "remove") {
        this.remove();
      }
    },
    removeAt(idx) {
      this.list.splice(idx, 1);
    },
    add: function() {
      position++;
      this.list.push({ name: "", position });
    }
  },
  mounted() {
    if (!this.mode) {
      this.mode = "save";
    }
    this.loadRequests();
    this.loadDivisions();
    this.setFocus();
  }
};
</script>
<style scoped>
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
input {
  display: inline-block;
  width: 50%;
}
.text {
  margin: 20px;
}
</style>