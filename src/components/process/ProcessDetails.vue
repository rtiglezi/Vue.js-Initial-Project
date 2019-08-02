<template>
  <div class="processDetails">
    <b-modal
      v-model="modalShow"
      size="lg"
      v-bind:hide-footer="true"
      id="modal-1"
      title="Registro de andamento"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->

      {{ obj }}
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-card class="mb-3 box-out">
          <b-card class="box">
            <b-row>
              <b-col style="color: green" md="4" sm="12" class="box-ico">
                <i class="fa fa-flag fa-5x" aria-hidden="true"></i>
                <br />Registrando a etapa
              </b-col>
              <b-col md="8" sm="12">
                <div>Etapa:</div>
                <b-form-select
                  ref="etapa"
                  name="Etapa"
                  id="etapa"
                  v-model="obj.stageId"
                  v-validate="{ required: true }"
                  @change="chooseResults($event)"
                >
                  <option v-for="stage in stages" :value="stage._id" :key="stage._id">{{stage.name}}</option>
                </b-form-select>
                <span
                  v-if="showSpanError('Etapa')"
                  class="adm-msg-error"
                >{{ errors.first('Etapa') }}</span>

                <div>Resultados:</div>
                <b-form-select
                  ref="resultados"
                  name="Resultados"
                  id="resultados"
                  v-model="obj.stageResultId"
                  v-validate="{ required: true }"
                >
                   <option v-for="result in results" :value="result._id" :key="result._id">{{result.name}}</option>
               
                </b-form-select>
                <span
                  v-if="showSpanError('Resultados')"
                  class="adm-msg-error"
                >{{ errors.first('Resultados') }}</span>

                <b-form-group label="Faça um breve relato da ocorrência *" label-for="divisionName">
                  <b-form-textarea
                    rows="3"
                    max-rows="6"
                    class="input-text"
                    ref="occurrence"
                    name="occurrence"
                    id="occurrence"
                    v-model="obj.occurrence"
                    :readonly="mode === 'remove'"
                    v-validate="{ required: true, min: 3 }"
                  ></b-form-textarea>
                  <span
                    ref="spnOccurrence"
                    v-if="showSpanError('Ocorrência')"
                    class="adm-msg-error"
                  >{{ errors.first('Ocorrência') }}</span>
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
            <b-col md="8">{{process.divisionName}}</b-col>
          </b-row>
          <b-row>
            <b-col md="4">Localidade:</b-col>
            <b-col md="8">{{process.city}}/{{process.state}}</b-col>
          </b-row>
        </b-card>
      </b-col>
      <b-col md="8">
        <b-card class="mb-2">
          <b-row>
            <b-col md="2">Demanda:</b-col>
            <b-col md="10">{{process.demandName}}</b-col>
          </b-row>
          <b-row>
            <b-col md="2">Solicitante:</b-col>
            <b-col md="10" style="color:green">{{process.requesterName }}</b-col>
          </b-row>
          <b-row>
            <b-col md="2">Documento:</b-col>
            <b-col md="10">{{ process.requesterPerson }} - {{ process.requesterDocument }}</b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <b-card class="mb-2" style="background-color:#ccc; text-align: center">
      Última etapa registrada:
      <span
        style="color: #006799; font-weight:bold"
        v-if="stages[currentStagePosition-1]"
      >{{ stages[currentStagePosition-1].name }}</span>

      <br />

      <b-button variant="primary" size="small" v-b-toggle.collapse-3 class="m-2">Etapas do processo</b-button>

      <b-button
        variant="success"
        size="small"
        v-b-modal.modal-1
        @click="newStage()"
        class="m-2"
      >Atualizar Andamento</b-button>

      <b-collapse id="collapse-3">
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
      </b-collapse>
    </b-card>

    <div class="layer-total2">Histórico de ocorrências do processo</div>

    <b-table id="my-table" :items="progresses" bordered responsive small :fields="items">
      <template slot="updated_at" slot-scope="row">
        <div style="color:#888">
          {{
          (new Date(row.item.updated_at).getDate().toString().length == 1) ? "0" + new Date(row.item.updated_at).getDate() : new Date(row.item.updated_at).getDate()
          }}/{{
          ((new Date(row.item.updated_at).getMonth() + 1).toString().length == 1) ? "0" + (new Date(row.item.updated_at).getMonth()+1) : (new Date(row.item.updated_at).getMonth())+1
          }}/{{
          new Date(row.item.updated_at).getFullYear()
          }}
        </div>
      </template>

      <template slot="arrayStages" slot-scope="row">
        <div v-for="(item,index) in row.item.arrayStages" :key="item._id" :index="index">
          <div style="color:brown" v-if="item._id === row.item.stageId">{{ item.name}}</div>
        </div>
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
      currentStagePosition: null,
      modalShow: false,
      mode: "save",
      process: {},
      stages: {},
      stage: {},
      results: {},
      progress: {},
      progresses: {},
      obj: {},
      totalRows: 0,
      items: [
        {
          key: "updated_at",
          label: "Data Ocorrência",
          sortable: true,
          class: "text-center",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "userName",
          label: "Realizada por:",
          sortable: true,
          class: "text-center",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "divisionName",
          label: "Na unidade:",
          sortable: true,
          class: "text-center",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "arrayStages",
          label: "Ocorrência",
          sortable: true,
          class: "text-center",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "occurrence",
          label: "Observações sobre a ocorrência",
          sortable: true,
          class: "text-center",
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
        dynamicOptions.color = "#0067D9";
        dynamicOptions.icon = "fas fa-check-circle fa-2x";
      }

      // etapa corrente
      if (stagePosition == this.currentStagePosition) {
        dynamicOptions.background = "#0068D9";
        dynamicOptions.color = "white";
        dynamicOptions.icon = "fas fa-check-circle fa-2x";
      }

      // etapas posteriores à próxima
      if (stagePosition > this.currentStagePosition) {
        dynamicOptions.background = "white";
        dynamicOptions.color = "#249900";
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
          this.loadInitialData();
          this.clickModalBtn();
          this.$toasted.global.defaultSuccess({
            msg: `Registro inserido com sucesso.`
          });
        })
        .catch();
    },

    getProgresses(processId) {
      const url = `${baseApiUrl}/progresses?processId=${processId}`;
      axios.get(url).then(res => {
        this.progresses = res.data;
        this.totalRows = res.data.length;
      });
    },

    loadStages(demandId) {
      const url = `${baseApiUrl}/demands/${demandId}/stages`;
      axios.get(url).then(res => {
        this.stages = res.data;
      });
    },
    
    chooseResults(stage) {
      let st = {};
      st = this.stages.filter(x => x._id === stage);
      this.results =  st[0].results
    },

    previousStage(stagePreviousId, processStageId) {
      return stagePreviousId == processStageId ? true : false;
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

    loadInitialData() {
      this.process = this.$route.params.process;
      this.getProgresses(this.process._id);
      this.loadStages(this.process.demandId);
    }
  },
  mounted() {
    this.loadInitialData();
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
  color: darkgoldenrod;
}
</style>
