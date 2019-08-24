<template>
  <div class="process">
    <Header title="[e-Proc 2]" />

    <PageTitle v-on:childToParent="getResources" main="processes" />

    <b-modal
      v-model="modalShow"
      size="lg"
      v-bind:hide-footer="true"
      id="modal-1"
      style="font-weight: bold"
      title="Registro coletivo de andamento nos processos selecionados."
    >
      <div v-if="allowSend && stagesSelectBox.length>0">
        <div style="color: red">
          Atenção!!! Você está realizando registro coletivo em {{selectedProcesses.length}} processo(s).
          <br />Tenha em mente que cada um dos processos selecionados terá seu atual andamento atualizado.
          <br />Antes de continuar, tenha certeza de que todos os processos selecionados devem ser mesmo alterados.
          <hr />
        </div>

        <!-- INICIO FORMULÁRIO DE CADASTRO -->
        <b-form v-on:submit.prevent="onSubmit">
          <b-row>
            <b-col style="color: red" md="4" sm="12" class="box-ico"></b-col>
          </b-row>
          <b-row>
            <b-col md="6">
              <b-form-group
                id="fieldset-etapa"
                label="Etapa a ser registrada:"
                label-for="etapa"
                description="Etapa que você acabou de realizar."
              >
                <b-form-select id="etapa" v-model="obj.stageId" @change="chooseResults($event)">
                  <option
                    v-for="stage in stagesSelectBox"
                    :value="stage._id"
                    :key="stage._id"
                    v-show="stage != stages[0]"
                  >{{stage.name}}</option>
                </b-form-select>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group
                v-if="results.length > 0"
                id="fieldset-resultado"
                label="Resultado gerado:"
                label-for="resultado"
                description="Informe qual foi o resultado gerado."
              >
                <b-form-select id="resultado" v-model="obj.stageResultId">
                  <option
                    v-for="result in results"
                    :value="result._id"
                    :key="result._id"
                  >{{result.name}}</option>
                </b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group
                id="fieldset-ocorrencia"
                label="Ocorrência:"
                label-for="ocorrência"
                description="Faça um breve relato da ocorrência"
              >
                <b-form-textarea
                  rows="5"
                  max-rows="5"
                  class="input-text"
                  id="ocorrencia"
                  v-model="obj.occurrence"
                ></b-form-textarea>
              </b-form-group>
            </b-col>
          </b-row>

          <div class="text-right">
            <b-button variant="danger" class="ml-2" @click="saveProgress">
              <i class="fa fa-check fa-lg"></i>
              Registrar o andamento no(s) {{selectedProcesses.length}} processo(s)
            </b-button>
            <b-button class="ml-2" variant="secondary" @click="clickModalBtn()">Cancelar</b-button>
          </div>
        </b-form>
      </div>
      <div v-else>
        Não é possível prosseguir.
        <div v-if="!allowSend">
          Os processos selecionados são demandas diferentes.
          <br />Por favor, selecione apenas processos pertencentes a mesma demanda.
        </div>
        <div v-if="stagesSelectBox.length==0">
          Não há nenhuma etapa planejada para a demanda do(s) processo(s) selecionado(s).
          <br />Por favor, fale com o administrador para adicionar as etapas dessa demanda.
        </div>
        <hr />
        <b-button class="ml-2" variant="secondary" @click="clickModalBtn()">Fechar</b-button>
      </div>
    </b-modal>

    <b-modal
      v-bind:hide-footer="true"
      id="myModalSend"
      v-model="modalShowSend"
      title="Tramitação de processos"
    >
      Tramitar {{ selectedProcesses.length }} processo(s) selecionado(s) à Unidade:
      <b-form-select @change="sendProcessesToDivision($event)">
        <option
          v-for="division in divisions"
          :value="division._id"
          :key="division._id"
          :disabled="division._id == user.lastDivision"
        >{{division.name}}</option>
      </b-form-select>

      <br />
      <br />

      <div class="text-right">
        <b-button @click="fncSend()" class="btn-main ml-2">
          <i class="fa fa-send"></i>
          Tramitar
        </b-button>
        <b-button class="ml-2" variant="secondary" @click="clickModalSend()">Cancelar</b-button>
      </div>
    </b-modal>

    <b-modal
      v-bind:hide-footer="true"
      id="myModalAssign"
      v-model="modalShowAssign"
      title="Atribuição de processos"
    >
      Atribuir {{ selectedProcesses.length }} processo(s) selecionado(s) ao usuário:
      <b-form-select @change="assignProcessesToUser($event)">
        <option v-for="user in users" :value="user._id" :key="user._id">{{user.name}}</option>
      </b-form-select>

      <br />
      <br />

      <div class="text-right">
        <b-button @click="fncAssign()" class="btn-main ml-2">
          <i class="fa fa-send"></i>
          Atribuir
        </b-button>
        <b-button class="ml-2" variant="secondary" @click="clickModalAssign()">Cancelar</b-button>
      </div>
    </b-modal>

    <b-modal
      size="lg"
      v-bind:hide-footer="true"
      id="myModalProcess"
      v-model="modalShowProcess"
      title="Cadastro de Processo"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-row>
          <b-col md="12" sm="12">
            <b-card class="mb-2 box-out">
              <b-card class="box">
                <b-row>
                  <b-col md="3" sm="12" class="box-ico">
                    <i class="fab fa-buffer fa-5x" aria-hidden="true"></i>
                    <br />Processo
                  </b-col>
                  <b-col md="9" sm="12">
                    <b-form-group label="Data do protocolo *" label-for="processProtocolDate">
                      <b-form-input
                        type="date"
                        ref="processProtocolDate"
                        name="Data"
                        id="processProtocolDate"
                        class="input-text"
                        :value="today"
                        :readonly="mode === 'remove'"
                        v-validate="{ required: true, min: 3 }"
                      ></b-form-input>
                      <span
                        ref="spnProtocolDate"
                        v-if="showSpanError('Data')"
                        class="adm-msg-error"
                      >{{ errors.first('Data') }}</span>
                    </b-form-group>
                    <b-form-group label="Número do Processo *" label-for="processNumber">
                      <b-form-input
                        v-mask="'#####.######/####-##'"
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
                    <b-form-group label="Unidade *" label-for="process-division">
                      <b-form-select
                        name="Unidade"
                        :disabled="mode === 'remove'"
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
                    <b-form-group label="Demanda *" label-for="process-demand">
                      <b-form-select
                        :disabled="mode === 'remove'"
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
          <b-col md="12" sm="12">
            <b-card class="mb-3 box-out">
              <b-card class="box">
                <b-row>
                  <b-col md="3" sm="12" class="box-ico">
                    <i :class="getIconRequester(process.requester.person)" aria-hidden="true"></i>
                    <br />Solicitante
                  </b-col>

                  <b-col md="8" sm="12">
                    <b-row>
                      <b-col>
                        <b-form-group label="Tipo de solicitante:">
                          <b-form-radio
                            @change="changePerson($event)"
                            v-model="process.requester.person"
                            name="requester-person"
                            value="PJ"
                          >Pessoa Jurídica</b-form-radio>
                          <b-form-radio
                            @change="changePerson($event)"
                            v-model="process.requester.person"
                            name="requester-person"
                            value="PF"
                          >Pessoa Física</b-form-radio>
                        </b-form-group>
                        <b-form-group
                          :label="lblDoc(process.requester.person)"
                          label-for="requesterDocument"
                        >
                          <b-form-input
                            v-if="process.requester.person == 'PJ'"
                            v-mask="'##.###.###/####-##'"
                            ref="requesterDocument"
                            name="Documento"
                            id="requesterDocument"
                            class="input-text"
                            v-model="process.requester.document"
                            :readonly="mode === 'remove'"
                            v-validate="{ required: true }"
                            @input="fillCityUF"
                          ></b-form-input>
                          <b-form-input
                            v-if="process.requester.person == 'PF'"
                            v-mask="'###.###.###-##'"
                            ref="requesterDocument"
                            name="Documento"
                            id="requesterDocument"
                            class="input-text"
                            v-model="process.requester.document"
                            :readonly="mode === 'remove'"
                            v-validate="{ required: true }"
                            @input="fillCityUF"
                          ></b-form-input>
                          <span
                            ref="spnDocumento"
                            v-if="showSpanError('Documento')"
                            class="adm-msg-error"
                          >{{ errors.first('Documento') }}</span>

                          <span
                            v-if="validarCNPJ(process.requester.document) && !process.requester.name"
                          >
                            <b-button
                              v-if="!loading"
                              variant="link"
                              @click="addEvent(process.requester.document)"
                            >
                              <i class="fas fa-file-import mr-1"></i>Importar dados
                            </b-button>
                            <img v-if="loading" src="@/assets/loading.gif" width="80" alt="loading" />
                          </span>
                        </b-form-group>

                        <b-form-group
                          :label="lblName(process.requester.person)"
                          label-for="requesterName"
                        >
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
                            <b-form-group label="Cidade *" label-for="City">
                              <b-form-input
                                ref="city"
                                name="Cidade"
                                id="city"
                                class="input-text"
                                v-model="process.city"
                                :readonly="mode === 'remove'"
                                v-validate="{ required: true, min: 3 }"
                              ></b-form-input>
                              <span
                                ref="spnCidade"
                                v-if="showSpanError('Cidade')"
                                class="adm-msg-error"
                              >{{ errors.first('Cidade') }}</span>
                            </b-form-group>
                          </b-col>
                          <b-col md="3">
                            <b-form-group label="UF *" label-for="State">
                              <b-form-input
                                ref="state"
                                name="UF"
                                id="state"
                                class="input-text"
                                v-model="process.state"
                                :readonly="mode === 'remove'"
                                v-validate="{ required: true, min: 2 }"
                              ></b-form-input>
                              <span
                                ref="spnUF"
                                v-if="showSpanError('UF')"
                                class="adm-msg-error"
                              >{{ errors.first('UF') }}</span>
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
          <b-button
            :disabled="!validarCNPJ(this.process.requester.document) && !validarCPF(this.process.requester.document)"
            class="btn-main ml-2"
            v-if="mode === 'save'"
            @click="save"
          >
            <i class="fa fa-send"></i>
            Inserir
          </b-button>
          <b-button
            :disabled="!validarCNPJ(this.process.requester.document) && !validarCPF(this.process.requester.document)"
            class="btn-main ml-2"
            v-if="mode === 'edit'"
            @click="save"
          >
            <i class="fas fa-save"></i>
            Salvar Edição
          </b-button>
          <b-button variant="danger" class="ml-2" v-if="mode === 'remove'" @click="remove">
            <i class="far fa-trash-alt"></i>
            Excluir?
          </b-button>
          <b-button class="ml-2" variant="secondary" @click="clickModalProcess()">Cancelar</b-button>
        </div>
      </b-form>
      <!-- FINAL FORMULÁRIO DE CADASTRO -->
    </b-modal>

    <!-- INÍCIO DA LISTA -->
    <div>
      <b-row>
        <b-col>
          <div style="text-align:left">
            <b-button
              v-b-popover.hover.top="'Adicionar processo'"
              size="sm"
              class="mr-1 button-bar"
              v-b-modal="'myModalProcess'"
            >
              <i class="fas fa-plus"></i>
            </b-button>
            <b-button
              v-b-popover.hover.top="'Pesquisar processo'"
              size="sm"
              class="mr-1 button-bar"
              v-b-modal="'myModalProcess'"
            >
              <i class="fas fa-search"></i>
            </b-button>

            <b-button
              v-if="selectedProcesses.length"
              v-b-popover.hover.top="'Atualizar o andamento'"
              size="sm"
              class="button-bar mr-1"
              v-b-modal.modal-1
              @click="getStages()"
            >
              <i class="fas fa-flag"></i>
            </b-button>

            <b-button
              v-b-popover.hover.top="'Atribuir processo(s)'"
              size="sm"
              v-if="selectedProcesses.length"
              class="mr-1 button-bar"
              v-b-modal="'myModalAssign'"
            >
              <i class="fas fa-share"></i>
              <i class="fas fa-user-check"></i>
            </b-button>

            <b-button
              v-b-popover.hover.top="'Tramitar processo(s)'"
              size="sm"
              v-if="selectedProcesses.length"
              class="mr-1 button-bar"
              v-b-modal="'myModalSend'"
            >
              <i class="fas fa-share"></i>
              <i class="fas fa-sitemap"></i>
            </b-button>

            <b-button
              size="sm"
              variant="link"
              @click="selectedProcesses=[]"
              v-if="selectedProcesses.length"
              class="mr-1"
            >
              <i class="fas fa-times mr-1"></i>
              Limpar seleção de {{ (selectedProcesses.length) ? selectedProcesses.length : '0' }} processo(s)
            </b-button>
          </div>
        </b-col>
      </b-row>

      <div class="layer-total mt-2">
        <i class="fab fa-buffer mr-2"></i>
        Cadastro de Processos - {{ totalRows }} registro(s)
      </div>

      <b-table
        id="my-table"
        :items="processes"
        :per-page="perPage"
        :current-page="currentPage"
        responsive
        small
        hover
        :fields="items"
      >
        <template
          slot="updated_at"
          slot-scope="row"
        >{{ row.item.updated_at | moment("DD/MM/YYYY HH:mm") }}</template>

        <template slot="progresses" slot-scope="row">
          <div v-for="(item, index) in row.item.progresses" :index="index" :key="item._id">
            <div
              style="color: brown"
              v-if="(index == row.item.progresses.length-1) "
            >{{ getStageName(item.demand, item.stage) }}</div>
          </div>
        </template>

        <template slot="HEAD_checks" slot-scope="row">
          <a
            style="width:30px; cursor:pointer"
            variant="link"
            size="sm"
            :name="row.item"
            @click="toggleSelect()"
          >
            <i v-if="selectedProcesses.length" class="fas fa-times" style="color:red"></i>
            <i v-else class="fas fa-check" style="color:blue"></i>
          </a>
        </template>

        <template slot="checks" slot-scope="row">
          <b-form-checkbox-group stacked v-model="selectedProcesses" name="checks">
            <b-form-checkbox size="sm" :key="row.item._id" :value="row.item._id"></b-form-checkbox>
          </b-form-checkbox-group>
        </template>

        <template slot="number" slot-scope="row">
          <a
            :style="{color: (row.item.submitted) ? 'red' : ''}"
            href="#"
            @click.prevent="goToProcess(row.item)"
          >{{row.item.number}}</a>
        </template>

        <template slot="actions" slot-scope="data">
          <a
            href="#"
            v-b-modal="'myModalProcess'"
            variant="danger"
            class="ml-1"
            @click.prevent="getResource(data.item, 'edit')"
          >
            <i class="far fa-edit" title="Editar o registro."></i>
          </a>
          <a
            href="#"
            v-b-modal="'myModalProcess'"
            variant="danger"
            class="ml-1"
            @click.prevent="getResource(data.item, 'remove')"
            style="color:red"
          >
            <i class="far fa-trash-alt" title="Excluir o registro."></i>
          </a>
        </template>
      </b-table>
    </div>

    <b-row>
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
import moment from "moment";

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
      today: moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"),
      selectedProcesses: [],
      loading: false,
      modalShow: false,
      modalShowSend: false,
      modalShowAssign: false,
      modalShowProcess: false,
      btnCancelDisabled: false,
      mode: "save",
      divisions: [],
      demands: [],
      stages: [],
      stagesSelectBox: [],
      obj: {},
      allowSend: true,
      results: [],
      users: [],
      assign: {},
      send: {},
      requester: [],
      process: {
        requester: {
          person: "PJ"
        }
      },
      processes: [],
      number: "",
      totalRows: 1,
      filter: null,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      items: [
        {
          key: "checks",
          label: "",
          sortable: false,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "updated_at",
          label: "Atualizado",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "divisionName",
          label: "Unidade",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "number",
          label: "Processo",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },

        {
          key: "demandName",
          label: "Demanda",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "requesterName",
          label: "Solicitante",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "city",
          label: "Cidade",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "state",
          label: "UF",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "progresses",
          label: "Última etapa",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "userName",
          label: "Atribuição",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "actions",
          label: "Ações",
          sortable: false,
          class: "text-left",
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
    clickModalProcess() {
      this.modalShowProcess = false;
    },
    clickModalAssign() {
      this.modalShowAssign = false;
    },
    clickModalSend() {
      this.modalShowSend = false;
    },
    getUsers() {
      const url = `${baseApiUrl}/users/assign`;
      axios.get(url).then(res => {
        this.users = res.data;
      });
    },
    getDivisions(tenant) {
      const url = `${baseApiUrl}/divisions?tenant=${tenant}`;
      axios.get(url).then(res => {
        this.divisions = res.data;
      });
    },
    getDemands(tenant) {
      const url = `${baseApiUrl}/demands?tenant=${tenant}`;
      axios.get(url).then(res => {
        this.demands = res.data;
      });
    },
    getResources(passedParam) {
      //alert("passedParam=" + passedParam);
      //alert("route.params=" + this.$route.params.passedParam);

      if (!passedParam) {
        passedParam = "all";
        if (this.$route.params.passedParam) {
          passedParam = undefined;
        }
      }

      let url = "";
      if (!passedParam && !this.$route.params.passedParam) {
        url = `${baseApiUrl}/processes`;
        this.$toasted.global.defaultInfo({
          msg: `Listando todos os processos da unidade atual.`
        });
      } else {
        if (passedParam) {
          url = `${baseApiUrl}/processes?number=${passedParam}`;
        } else {
          if (this.$route.params.passedParam == "mine") {
            url = `${baseApiUrl}/processes?user=${this.$route.params.passedParam}`;
            this.$toasted.global.defaultInfo({
              msg: `Listando os processos atribuídos a você.`
            });
          } else if (this.$route.params.passedParam == "all") {
            url = `${baseApiUrl}/processes`;
            this.$toasted.global.defaultInfo({
              msg: `Listando todos os processos da unidade atual.`
            });
          } else {
            url = `${baseApiUrl}/processes?number=${this.$route.params.passedParam}`;
          }
        }
      }

      if (passedParam == "all") {
        url = `${baseApiUrl}/processes`;
        this.$toasted.global.defaultInfo({
          msg: `Listando todos os processos da unidade atual.`
        });
      }

      if (passedParam == "mine") {
        url = `${baseApiUrl}/processes?user=mine`;
        this.$toasted.global.defaultInfo({
          msg: `Listando os processos atribuídos a você.`
        });
      }

      axios.get(url).then(res => {
        this.processes = res.data;
        this.totalRows = res.data.length;
      });
    },
    getResource(process, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/processes/${process._id}`;
      axios.get(url).then(res => {
        this.process = res.data;
        let td = res.data.protocolDate;
        this.today = moment(td).format("YYYY-MM-DD");
      });
    },
    getStageName(demand, stage) {
      let stageName = "";
      this.demands.map(d => {
        if (d._id == demand) {
          d.stages.map(s => {
            if (s._id == stage) {
              stageName = s.name;
            }
          });
        }
      });
      return stageName;
    },

    saveProgress() {
      let index = 0;
      this.selectedProcesses.map(r => {
        axios
          .patch(`${baseApiUrl}/processes/${r}/updateprgrs`, this.obj)
          .then(() => {
            index++;
            this.getResources();
            this.$toasted.global.defaultSuccess({
              msg: `${index}&#176; andamento realizado com sucesso.`
            });
            this.selectedProcesses = [];
            this.clickModalBtn();
          })
          .catch();
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

    addEvent(e) {
      this.loading = true;

      let doc = e;
      doc = doc.replace(".", "");
      doc = doc.replace(".", "");
      doc = doc.replace(".", "");
      doc = doc.replace("/", "");
      doc = doc.replace("-", "");
      if (this.validarCNPJ(doc)) {
        axios
          .get(
            `${"https://cors-anywhere.herokuapp.com/"}https://www.receitaws.com.br/v1/cnpj/${doc}`
          )
          .then(res => {
            this.process.requester.name = res.data.nome;
            this.process.city = res.data.municipio;
            this.process.state = res.data.uf;
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
            this.$toasted.global.defaultError({
              msg: `Não foi possível obter resposta. Tente novamente em alguns minutos.`
            });
          });
      }
    },

    validarCPF(cpf) {
      if (cpf && this.process.requester.person == "PF") {
        cpf = cpf
          .replace(".", "")
          .replace(".", "")
          .replace(".", "")
          .replace("-", "");
        let digitos_iguais = 1;
        if (cpf.length < 11) return false;
        for (let i = 0; i < cpf.length - 1; i++)
          if (cpf.charAt(i) != cpf.charAt(i + 1)) {
            digitos_iguais = 0;
            break;
          }
        if (!digitos_iguais) {
          let numeros = cpf.substring(0, 9);
          let digitos = cpf.substring(9);
          let soma = 0;
          for (let i = 10; i > 1; i--) soma += numeros.charAt(10 - i) * i;
          let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
          if (resultado != digitos.charAt(0)) return false;
          numeros = cpf.substring(0, 10);
          soma = 0;
          for (let i = 11; i > 1; i--) soma += numeros.charAt(11 - i) * i;
          resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
          if (resultado != digitos.charAt(1)) return false;
          return true;
        } else return false;
      }
    },

    validarCNPJ(cnpj) {
      if (cnpj) {
        cnpj = cnpj.replace(/[^\d]+/g, "");

        if (cnpj == "") return false;

        if (cnpj.length != 14) return false;

        // Elimina CNPJs invalidos conhecidos
        if (
          cnpj == "00000000000000" ||
          cnpj == "11111111111111" ||
          cnpj == "22222222222222" ||
          cnpj == "33333333333333" ||
          cnpj == "44444444444444" ||
          cnpj == "55555555555555" ||
          cnpj == "66666666666666" ||
          cnpj == "77777777777777" ||
          cnpj == "88888888888888" ||
          cnpj == "99999999999999"
        )
          return false;

        // Valida DVs
        let tamanho = cnpj.length - 2;
        let numeros = cnpj.substring(0, tamanho);
        let digitos = cnpj.substring(tamanho);
        let soma = 0;
        let pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2) pos = 9;
        }
        let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(0)) return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (let i = tamanho; i >= 1; i--) {
          soma += numeros.charAt(tamanho - i) * pos--;
          if (pos < 2) pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
        if (resultado != digitos.charAt(1)) return false;

        return true;
      }
    },

    fillCityUF() {
      if (this.process.requester.person == "PJ") {
        if (!this.validarCNPJ(this.process.requester.document)) {
          this.process.requester.name = "";
          this.process.city = "";
          this.process.state = "";
        }
      }
    },

    lblDoc(val) {
      if (val) {
        if (val == "PF") {
          return "CPF *";
        } else {
          return "CNPJ *";
        }
      }
    },

    lblName(val) {
      if (val) {
        if (val == "PF") {
          return "Nome *";
        } else {
          return "Razão Social *";
        }
      }
    },

    getIconRequester(val) {
      if (val) {
        if (val == "PF") {
          return "fa fa-user-tie fa-5x";
        } else {
          return "fa fa-building fa-5x";
        }
      }
    },

    changePerson(val) {
      this.process.requester.person = val;
    },

    firstForm() {
      this.clickModalProcess();
      this.mode = "save";
      this.getResources();
      this.process = {};
      this.process = {
        requester: {
          person: "PJ"
        }
      };
      this.getDivisions(this.user.tenant);
      this.getDemands(this.user.tenant);
    },

    receive(process) {
      axios
        .post(`${baseApiUrl}/processes/${process._id}/receive`, {})
        .then(() => {
          this.$router.push({ name: "processDetails", params: { process } });
        })
        .catch();
    },

    goToProcess(process) {
      if (process.submitted) {
        this.receive(process);
      } else {
        this.$router.push({ name: "processDetails", params: { process } });
      }
    },

    toggleSelect() {
      if (this.selectedProcesses.length) {
        this.selectedProcesses = [];
      } else {
        this.processes.map(p => {
          this.selectedProcesses.push(p._id);
        });
      }
    },

    getStages() {
      this.allowSend = true;
      let demandId = null;

      this.processes.map(r => {
        if (this.allowSend) {
          if (this.selectedProcesses.indexOf(r._id) != -1) {
            if (demandId == null) {
              demandId = r.demandId;
            }
            if (r.demandId.toString() != demandId.toString()) {
              this.allowSend = false;
            }
          }
        }
      });

      if (this.allowSend) {
        const url = `${baseApiUrl}/demands/${demandId}/stages`;
        axios.get(url).then(res => {
          this.stages = res.data;
          this.stagesSelectBox = this.stages.slice();
          this.stagesSelectBox.splice(0, 1);
        });
      }
    },

    chooseResults(stage) {
      let st = {};
      st = this.stages.filter(x => x._id === stage);
      this.results = st[0].results;
    },

    sendProcessesToDivision(division) {
      this.send = {
        divisionId: division,
        processesId: this.selectedProcesses
      };
    },

    fncSend() {
      axios
        .post(`${baseApiUrl}/processes/send`, this.send)
        .then(() => {
          this.$toasted.global.defaultSuccess({
            msg: `Trâmite realizado com sucesso.`
          });
          this.selectedProcesses = [];
          this.getResources();
          this.clickModalSend();
        })
        .catch();
    },

    assignProcessesToUser(user) {
      this.assign = {
        userId: user,
        processesId: this.selectedProcesses
      };
    },

    fncAssign() {
      axios
        .post(`${baseApiUrl}/processes/assign`, this.assign)
        .then(() => {
          this.$toasted.global.defaultSuccess({
            msg: `Atribuição realizada com sucesso.`
          });
          this.selectedProcesses = [];
          this.getResources();
          this.clickModalAssign();
        })
        .catch();
    }
  },

  mounted() {
    this.firstForm();
    this.getUsers();
  }
};
</script>

<style>
.button-bar {
  color: #555;
  width: 50px;
  height: 35px;
  border-radius: 2px;
  background-color: white;
}
</style>
