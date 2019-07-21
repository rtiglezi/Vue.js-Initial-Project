<template>
  <div class="tenant-admin">
    <PageTitle
      icon="fa fa-folder-open"
      main="Cadastro de Processos"
    />

    <b-modal
      size="xl"
      v-bind:hide-footer="true"
      id="mymodal"
      v-model="modalShow"
      title="Cadastro de Processo"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-row>
          <b-col md="6" sm="12">
            <b-card class="mb-2 box-out">
              <b-card class="box">
                <b-row>
                  <b-col md="3" sm="12" class="box-ico">
                    <i class="fa fa-folder-open fa-5x" aria-hidden="true"></i>
                    <br />Dados Cadastrais
                  </b-col>
                  <b-col md="9" sm="12">
                    <b-form-group label="Número *" label-for="processNumber">
                      <b-form-input
                        ref="processNumber"
                        name="Numero"
                        id="processNumber"
                        class="input-text"
                        v-model="process.number"
                        :readonly="mode === 'remove'"
                        v-validate="{ required: true, min: 3 }"
                      ></b-form-input>
                      <span
                        ref="spnNumero"
                        v-if="showSpanError('Numero')"
                        class="adm-msg-error"
                      >{{ errors.first('Numero') }}</span>
                    </b-form-group>
                    <b-form-group label="Unidade:" label-for="process-division">
                      <b-form-select
                        name="Unidade"
                        v-model="process.division"
                        v-validate="{ required: true }"
                      >
                        <option
                          v-for="division in divisions"
                          :value="division._id"
                          :key="division._id"
                        >{{division.name}}</option>
                      </b-form-select>
                      <span
                        ref="spnUnidade"
                        v-if="showSpanError('Unidade')"
                        class="adm-msg-error"
                      >{{ errors.first('Unidade') }}</span>
                    </b-form-group>
                    <b-form-group label="Demanda:" label-for="process-demand">
                      <b-form-select
                        name="Demanda"
                        v-model="process.demand"
                        v-validate="{ required: true }"
                      >
                        >
                        <option
                          v-for="demand in demands"
                          :value="demand._id"
                          :key="demand._id"
                        >{{demand.name}}</option>
                      </b-form-select>
                      <span
                        ref="spnDemanda"
                        v-if="showSpanError('Demanda')"
                        class="adm-msg-error"
                      >{{ errors.first('Demanda') }}</span>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-card>
            </b-card>
          </b-col>
          <b-col md="6" sm="12">
            <b-card class="mb-3 box-out">
              <b-card class="box">
                <b-row>
                  <b-col md="3" sm="12" class="box-ico">
                    <i class="fas fa-user-tie fa-5x" aria-hidden="true"></i>
                    <br />Solicitante
                  </b-col>

                  <b-col md="8" sm="12">
                    <b-row>
                      <b-col>
                        <b-form-group label="Tipo de solicitante:">
                          <b-form-radio
                            v-model="process.requester.person"
                            name="requester-person"
                            value="PJ"
                          >Pessoa Jurídica</b-form-radio>
                          <b-form-radio
                            v-model="process.requester.person"
                            name="requester-person"
                            value="PF"
                          >Pessoa Física</b-form-radio>
                        </b-form-group>
                        <b-form-group label="Documento *" label-for="requesterDocument">
                          <b-form-input
                            ref="requesterDocument"
                            name="Documento"
                            id="requesterDocument"
                            class="input-text"
                            v-model="process.requester.document"
                            :readonly="mode === 'remove'"
                            v-validate="{ required: true, min: 3 }"
                          ></b-form-input>
                          <span
                            ref="spnDocumento"
                            v-if="showSpanError('Documento')"
                            class="adm-msg-error"
                          >{{ errors.first('Documento') }}</span>
                        </b-form-group>
                        <b-form-group label="Nome *" label-for="requesterName">
                          <b-form-input
                            ref="requesterName"
                            name="Nome"
                            id="requesterName"
                            class="input-text"
                            v-model="process.requester.name"
                            :readonly="mode === 'remove'"
                            v-validate="{ required: true, min: 3 }"
                          ></b-form-input>
                          <span
                            ref="spnNome"
                            v-if="showSpanError('Nome')"
                            class="adm-msg-error"
                          >{{ errors.first('Nome') }}</span>
                        </b-form-group>

                        <b-row>
                          <b-col md="9">
                            <b-form-group label="Cidade" label-for="requesterCidade">
                              <b-form-input
                                class="input-text"
                                v-model="process.requester.addressCity"
                                :readonly="mode === 'remove'"
                              ></b-form-input>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group label="UF" label-for="requesterUF">
                              <b-form-input
                                class="input-text"
                                v-model="process.requester.addressState"
                                :readonly="mode === 'remove'"
                              ></b-form-input>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-card>
            </b-card>
          </b-col>
        </b-row>

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
        :items="processes"
        :per-page="perPage"
        :current-page="currentPage"
        bordered
        responsive
        small
        :filter="filter"
        :fields="items"
        @filtered="onFiltered"
      >
        <template slot="updated_at" slot-scope="row">
          {{
          (new Date(row.item.created_at).getDate().toString().length == 1) ? "0" + new Date(row.item.created_at).getDate() : new Date(row.item.created_at).getDate()
          }}/{{
          ((new Date(row.item.created_at).getMonth() + 1).toString().length == 1) ? "0" + (new Date(row.item.created_at).getMonth()+1) : (new Date(row.item.created_at).getMonth())+1
          }}/{{
          new Date(row.item.created_at).getFullYear()
          }}
        </template>

        <template slot="divisionDetails" slot-scope="row">
          <div
            v-for="(item, index) in row.item.divisionDetails"
            :key="item.id"
            :index="index"
          >{{row.item.divisionDetails[index].name}}</div>
        </template>

        <template slot="demandDetails" slot-scope="row">
          <div
            v-for="(item, index) in row.item.demandDetails"
            :key="item.id"
            :index="index"
          >{{row.item.demandDetails[index].name}}</div>
        </template>

        <template slot="requester" slot-scope="row">
          <div>{{row.item.requester.name}}</div>
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
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

import { mapState } from "vuex";

export default {
  name: "Process",
  computed: mapState(["user"]),
  components: { PageTitle },
  data: function() {
    return {
      modalShow: false,
      btnCancelDisabled: false,
      mode: "save",
      divisions: [],
      demands: [],
      users: [],
      requester: [],
      process: {
        requester: {
          person: "PJ"
        }
      },
      processes: [],
      totalRows: 1,
      filter: null,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      items: [
        {
          key: "updated_at",
          label: "Atualizado",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "divisionDetails",
          label: "Unidade:",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "demandDetails",
          label: "Demanda:",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "number",
          label: "Processo",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "requester",
          label: "Solicitante",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "requester.addessCity",
          label: "Cidade",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "requester.addessUF",
          label: "UF",
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
    loadDivisions(tenant) {
      const url = `${baseApiUrl}/divisions?tenant=${tenant}`;
      axios.get(url).then(res => {
        this.divisions = res.data;
      });
    },
    loadDemands(tenant) {
      const url = `${baseApiUrl}/demands?tenant=${tenant}`;
      axios.get(url).then(res => {
        this.demands = res.data;
      });
    },
    loadResources() {
      const url = `${baseApiUrl}/processes`;
      axios.get(url).then(res => {
        this.processes = res.data;
        this.totalRows = res.data.length;
      });
    },
    loadResource(process, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/processes/${process._id}`;
      axios.get(url).then(res => {
        this.process = res.data;
      });
    },
    save() {
      const method = this.process._id ? "patch" : "post";
      const id = this.process._id ? `/${this.process._id}` : "";

      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/processes${id}`, this.process)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.process._id;
      axios
        .delete(`${baseApiUrl}/processes/${id}`)
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
      this.loadResources();
      this.process = {};
      this.process = {
        requester: {
          person: "PJ"
        }
      };
      this.loadDivisions(this.user.tenant);
      this.loadDemands(this.user.tenant);
    }
  },
  mounted() {
    this.firstForm();
  }
};
</script>

<style>
</style>
