<template>
  <div class="demand-admin">
    <PageTitle
      icon="fa fa-tasks"
      main="Cadastro de Demandas"
      sub="Área administrativa de acesso restrito"
    />

    <b-modal
      size="lg"
      v-bind:hide-footer="true"
      id="mymodal"
      v-model="modalShow"
      title="Cadastro de Demanda"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-card class="mb-3 box-out">
          <b-card class="box">
            <b-row>
              <b-col md="3" sm="12" class="box-ico">
                <i class="fa fa-tasks fa-5x" aria-hidden="true"></i>
                <br />Cadastro de Demanda
              </b-col>
              <b-col md="9" sm="12">
                <b-form-group label="Nome da Demanda *" label-for="demandName">
                  <b-form-input
                    class="input-text"
                    ref="demandName"
                    name="Nome"
                    id="demandName"
                    v-model="demand.name"
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
        :items="demands"
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

          <b-button style="width: 115px" class="ml-1" variant="info" @click="goToStages(data.item)">
            <i class="fa fa-flag" title="Editar etapas."></i>
            {{data.item.stages.length}}
            etapa(s)
          </b-button>
        </template>
      </b-table>
    </div>

    <b-row>
      <b-col>
        <b-button v-b-modal="'mymodal'" @click="clearForm">
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
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  name: "demandAdmin",
  components: { PageTitle },
  data: function() {
    return {
      modalShow: false,
      mode: "save",
      demands: [],
      demand: {},
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
          key: "name",
          label: "Nome",
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
    loadResources() {
      const url = `${baseApiUrl}/demands`;
      axios.get(url).then(res => {
        this.demands = res.data;
        this.totalRows = res.data.length;
      });
    },
    loadResource(demand, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/demands/${demand._id}`;
      axios.get(url).then(res => {
        this.demand = res.data;
      });
    },
    save() {
      const method = this.demand._id ? "patch" : "post";
      const id = this.demand._id ? `/${this.demand._id}` : "";
      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/demands${id}`, this.demand)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.demand._id;
      axios
        .delete(`${baseApiUrl}/demands/${id}`)
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
      this.clearForm();
    },
    clearForm() {
      this.clickModalBtn();
      this.loadResources();
      this.demand = {};
      this.mode = "save";
    },
    submitByKey() {
      if (this.mode === "save" || this.mode === "edit") {
        this.save();
      } else if (this.mode === "remove") {
        this.remove();
      }
    },
    goToStages(demand) {
        this.$router.push({ name: "stageAdmin", params: { demand } });
    },
  },
  mounted() {
    if (!this.mode) {
      this.mode = "save";
    }
    this.loadResources();
  }
};
</script>

<style>
</style>
