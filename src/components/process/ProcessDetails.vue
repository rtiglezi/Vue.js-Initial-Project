<template>
  <div class="processDetails">
    <PageTitle main="processes" />

    <b-modal
      v-bind:hide-footer="true"
      id="myModalSend"
      v-model="modalShowSend"
      title="Tramitação de processos"
    >
      Tramitar o processo à Unidade:
      <b-form-select @change="sendProcessesToDivision($event)">
        <option
          v-for="division in divisions"
          :value="division._id"
          :key="division._id"
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
      Atribuir este processo ao usuário:
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
      v-model="modalShow"
      size="lg"
      v-bind:hide-footer="true"
      id="modal-1"
      style="color: green; font-weight: bold"
      title="Registro de andamento no processo"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit">
        <b-row>
          <b-col style="color: green" md="4" sm="12" class="box-ico"></b-col>
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
              <b-form-select id="resultado" v-model="obj.resultId">
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
                :readonly="mode === 'remove'"
              ></b-form-textarea>
            </b-form-group>
          </b-col>
        </b-row>

        <div class="text-right">
          <b-button variant="success" class="ml-2" v-if="mode === 'save'" @click="save">
            <i class="fa fa-check fa-lg"></i>
            Registrar Andamento
          </b-button>
          <b-button class="ml-2" variant="secondary" @click="clickModalBtn()">Cancelar</b-button>
        </div>
      </b-form>
      <!-- FINAL FORMULÁRIO DE CADASTRO -->
    </b-modal>

    <b-row>
      <b-col md="4">
        <b-card class="mb-2">
          <b-row>
            <b-col md="4">Processo:</b-col>
            <b-col md="8" style="font-weight:bold; color:green">{{process.number}}</b-col>
          </b-row>

          <b-row>
            <b-col md="4">Unidade:</b-col>
            <b-col md="8">{{process.divisionName.toString()}}</b-col>
          </b-row>

          <b-row>
            <b-col md="4">Atribuição:</b-col>
            <b-col md="8">{{process.userName.toString()}}</b-col>
          </b-row>

          <b-row>
            <b-col md="4">Etapa atual:</b-col>
            <b-col md="8">
              <div v-for="stage in stages" :key="stage" :value="stages">
                <div
                  style="color: brown; font-weight: bold"
                  v-if="process.progresses[process.progresses.length-1].stage == stage._id"
                >{{stage.name.toUpperCase()}}</div>
              </div>
            </b-col>
          </b-row>

          <b-row>
            <b-col md="4">Resultado:</b-col>
            <b-col md="8">
              <div v-for="stage in stages" :key="stage" :value="stages">
                <div
                  style="color: brown; font-weight: bold"
                  v-if="process.progresses[process.progresses.length-1].stage == stage._id"
                >{{stage.name.toUpperCase()}}</div>
              </div>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col md="8">
        <b-card class="mb-2">
          <b-row>
            <b-col md="2">Demanda:</b-col>
            <b-col md="10">{{process.demandName.toString()}}</b-col>
          </b-row>
          <b-row>
            <b-col md="2">Solicitante:</b-col>
            <b-col md="10" style="color:green">{{process.requesterName }}</b-col>
          </b-row>
          <b-row>
            <b-col md="2">Documento:</b-col>
            <b-col md="10">{{ process.requesterPerson }} - {{ process.requesterDocument }}</b-col>
          </b-row>
          <b-row>
            <b-col md="2">Localidade:</b-col>
            <b-col md="10">{{process.city}}/{{process.state}}</b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <div class="text-center">
      <b-button
        v-b-popover.hover.bottom="'Atualizar o andamento'"
        size="sm"
        class="button-bar mr-1 mb-2"
        @click="newStage()"
        v-b-modal.modal-1
      >
        <i class="fas fa-flag"></i>
      </b-button>

      <b-button
        v-b-popover.hover.bottom="'Ver atual andamento'"
        size="sm"
        v-b-toggle.collapse-3
        class="button-bar mr-1 mb-2"
        @click="newStage()"
      >
        <i class="fas fa-check-double"></i>
      </b-button>

      <b-button
        v-b-popover.hover.bottom="'Atribuir'"
        size="sm"
        class="button-bar mr-1 mb-2"
        v-b-modal="'myModalAssign'"
      >
        <i class="fas fa-share"></i>
        <i class="fas fa-user-check"></i>
      </b-button>

      <b-button
        v-b-popover.hover.bottom="'Tramitar'"
        size="sm"
        class="button-bar mr-1 mb-2"
        v-b-modal="'myModalSend'"
      >
        <i class="fas fa-share"></i>
        <i class="fas fa-sitemap"></i>
      </b-button>

      <b-button
        v-b-popover.hover.bottom="'Listar todos os processos'"
        size="sm"
        class="button-bar mr-1 mb-2"
        @click="navigate('/processes')"
      >
        <i class="fab fa-buffer fa-lg"></i>
      </b-button>
    </div>

    <b-collapse id="collapse-3">
      <b-card class="mb-2" style="background-color:green; text-align: center">
        <div class="mt-2 mb-2">
          <b-row>
            <b-col
              class="mt-3 mb-3"
              md="2"
              sm="12"
              v-for="(stage, index) in stages"
              :index="index"
              :key="stage._id"
            >
              <b-row>
                <b-col md="10">
                  <div v-for="(obj) in whoAmI(stages, index)" :key="obj">
                    <b-card
                      v-bind:style="{ 
                      background: obj.dynamicOptions.background,
                      color: obj.dynamicOptions.color,
                      'text-align': 'center'
                      }"
                    >
                      <span>{{ obj.stageName }}</span>
                      <br />
                      <i :class="obj.dynamicOptions.icon"></i>
                    </b-card>
                  </div>
                </b-col>
                <b-col md="2" class="arrow" v-if="index+1 < stages.length">
                  <i class="fas fa-share"></i>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </div>
      </b-card>
    </b-collapse>

    <div class="layer-total">Histórico de ocorrências</div>

    <b-table id="my-table" :items="allProgresses" bordered responsive small :fields="items">
      <template
        slot="updated_at"
        slot-scope="row"
      >{{ row.item.updated_at | moment("DD/MM/YYYY HH:MM") }}</template>

      <template slot="arrayStages" slot-scope="row">
        <div
          v-if="
          (row.item.stage == 'Atribuição') 
          || 
          (row.item.stage == 'Tramitação')
          || 
          (row.item.stage == 'Recebimento')
          "
          style="color:#888"
        >[{{ row.item.stage}}]</div>
        <div v-for="(item,index) in row.item.arrayStages" :key="item._id" :index="index">
          <div style="font-weight:bold" v-if="item._id === row.item.stage">
            <i class="fas fa-flag mr-1"></i>
            {{ item.name}}
          </div>
        </div>
      </template>

      <template slot="arrayResults" slot-scope="row">
        <div v-for="(item,index) in row.item.arrayResults" :key="item._id" :index="index">
          <div v-if="item.length > 0">
            <div v-for="(itm, idx) in item" :key="itm._id" :index="idx">
              <div v-if="itm._id === row.item.result">{{ itm.name }}</div>
            </div>
          </div>
        </div>
      </template>

      <template slot="occurrence" slot-scope="row">
        <div
          v-if="
          (row.item.stage == 'Atribuição') 
          || 
          (row.item.stage == 'Tramitação')
          || 
          (row.item.stage == 'Recebimento')
          "
          style="color:#888"
        >[{{ row.item.occurrence}}]</div>
        <div v-else>{{ row.item.occurrence}}</div>
      </template>
    </b-table>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "ProcessDetails",
  components: { PageTitle },
  data: function() {
    return {
      modalShowAssign: false,
      modalShowSend: false,
      assign: {},
      send: {},
      currentStagePosition: null,
      modalShow: false,
      mode: "save",
      process: {},
      stages: [],
      stagesSelectBox: [],
      users: [],
      divisions: [],
      stage: {},
      results: [],
      progress: {},
      progresses: [],
      automatics: [],
      allProgresses: [],
      obj: {},
      totalRows: 0,
      items: [
        {
          key: "updated_at",
          label: "Data/hora:",
          sortable: true,
          class: "text-left",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "userName",
          label: "Responsável:",
          sortable: true,
          class: "text-left",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "divisionName",
          label: "Unidade:",
          sortable: true,
          class: "text-left",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "arrayStages",
          label: "Ocorrência:",
          sortable: true,
          class: "text-left",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "arrayResults",
          label: "Resultado:",
          sortable: true,
          class: "text-left",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "occurrence",
          label: "Observações sobre a ocorrência:",
          sortable: true,
          class: "text-left",
          thClass: "table-th2",
          tdClass: "table-td"
        }
      ]
    };
  },
  methods: {
    whoAmI(stages, index) {
      let stagePosition = index + 1;
      let stageId = stages[index]._id;
      let stageName = stages[index].name;
      let lastProgress = this.progresses[this.progresses.length - 1].stage;
      let currentStage = false;

      currentStage = stages[index]._id == lastProgress ? true : false;

      this.currentStagePosition = currentStage
        ? stagePosition
        : this.currentStagePosition;

      let whoAmI = {};
      let dynamicOptions = {};

      // etapas anteriores à corrente
      if (stagePosition < this.currentStagePosition) {
        dynamicOptions.background = "white";
        dynamicOptions.color = "#555";
        dynamicOptions.icon = "fas fa-check-circle fa-2x";
      }

      // etapa corrente
      if (stagePosition == this.currentStagePosition) {
        dynamicOptions.background = "white";
        dynamicOptions.color = "red";
        dynamicOptions.icon = "fas fa-check-circle fa-2x";
      }

      // etapas posteriores à próxima
      if (stagePosition > this.currentStagePosition) {
        dynamicOptions.background = "white";
        dynamicOptions.color = "#888";
        dynamicOptions.icon = "fas fa-clock fa-2x";
      }

      let obj = {
        stageId,
        stageName,
        currentStage,
        stagePosition,
        currentStagePosition: this.currentStagePosition,
        dynamicOptions: dynamicOptions
      };

      whoAmI.obj = obj;

      return whoAmI;
    },

    clickModalBtn() {
      this.modalShow = false;
    },

    newStage() {
      let stageId = this.stages[this.currentStagePosition]
        ? this.stages[this.currentStagePosition]._id
        : this.stages[0]._id;

      let stageName = this.stages[this.currentStagePosition]
        ? this.stages[this.currentStagePosition].name
        : this.stages[0].name;

      this.chooseResults(stageId);

      this.obj = {
        processId: this.process._id,
        stageId,
        stageName,
        action: "new"
      };

    },

    save() {
      axios
        .patch(
          `${baseApiUrl}/processes/${this.obj.processId}/updateprgrs`,
          this.obj
        )
        .then(() => {
          this.getInitialData();
          this.clickModalBtn();
          this.$toasted.global.defaultSuccess({
            msg: `Registro inserido com sucesso.`
          });
        })
        .catch(err => {
          alert(err);
        });
    },

    getProgresses(processId) {
      const url = `${baseApiUrl}/progresses?processId=${processId}`;
      axios
        .get(url)
        .then(res => {
          this.progresses = res.data;
          this.totalRows = res.data.length;
        })
        .then(() => {
          const url = `${baseApiUrl}/automatics?processId=${processId}`;
          axios.get(url).then(res => {
            this.automatics = res.data;
            this.progresses = this.progresses.concat(this.automatics);

            this.progresses.sort((a, b) =>
              a.updated_at > b.updated_at ? 1 : -1
            );

            this.allProgresses = this.progresses.slice();
            this.allProgresses = this.allProgresses.reverse();
          });
        });
    },

    navigate(link) {
      this.$router.push(link);
    },

    getStages(demandId) {
      const url = `${baseApiUrl}/demands/${demandId}/stages`;
      axios.get(url).then(res => {
        this.stages = res.data;
        this.stagesSelectBox = this.stages.slice();
        this.stagesSelectBox.splice(0, 1);
      });
    },

    chooseResults(stage) {
      let st = {};
      st = this.stages.filter(x => x._id === stage);
      this.results = st[0].results;
    },

    sendProcessesToDivision(division) {
      this.send = {
        divisionId: division,
        processesId: [this.process._id]
      };
    },

    fncSend() {
      axios
        .post(`${baseApiUrl}/processes/send`, this.send)
        .then(() => {
          this.selectedProcesses = [];
          this.clickModalSend();
          this.getInitialData();
        })
        .catch();
    },

    assignProcessesToUser(user) {
      this.assign = {
        userId: user,
        processesId: [this.process._id]
      };
    },

    fncAssign() {
      axios
        .post(`${baseApiUrl}/processes/assign`, this.assign)
        .then(() => {
          this.clickModalAssign();
          this.getInitialData();
        })
        .catch();
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

    getDivisions() {
      const url = `${baseApiUrl}/divisions`;
      axios.get(url).then(res => {
        this.divisions = res.data;
      });
    },

    getProcess(id) {
      const url = `${baseApiUrl}/processes/${id}`;
      axios.get(url).then(res => {
        this.process = res.data;
      });
    },

    getInitialData() {
      this.getProcess(this.$route.params.process._id);
      this.getProgresses(this.$route.params.process._id);
      this.getStages(this.$route.params.process.demandId[0]);
      this.getDivisions();
    }
  },

  mounted() {
    !this.$route.params.process ? this.$router.push("/processes") : "";
    this.getInitialData();
    this.getUsers();
  }
};
</script>

<style>
.processDetails .box {
  border-radius: 0px;
  background-color: white;
  text-align: center;
}
.processDetails .stage_name {
  font-weight: bold;
  color: brown;
}
.processDetails .arrow {
  margin-top: 21px;
  color: white;
}
</style>
