<template>
  <div class="processDetails">
    <PageTitle icon="fa fa-home" main="ProcessDetails" sub="Detalhes do processo" />

    <b-modal size="lg" v-bind:hide-footer="true" id="modal-1" title="Registro de andamento">
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-card class="mb-3 box-out">
          <b-card class="box">
            <b-row>
              <b-col style="color: green" md="4" sm="12" class="box-ico">
                <i class="fa fa-forward fa-5x" aria-hidden="true"></i>
                <br />Registrar
                <strong>{{stage.name}}</strong>
                <br />no processo
                <br />
                {{ process.number }}
              </b-col>
              <b-col md="8" sm="12">
                <b-form-group label="Faça um breve relato da ocorrência *" label-for="divisionName">
                  <b-form-textarea
                    rows="3"
                    max-rows="6"
                    class="input-text"
                    ref="occurrence"
                    name="occurrence"
                    id="occurrence"
                    v-model="stage.occurrence"
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

    <b-row>
      <b-col md="4">
        <b-card class="mb-2">
          <b-row>
            <b-col md="4">Processo:</b-col>
            <b-col md="8" style="font-weight:bold; color:#006999">{{process.number}}</b-col>
          </b-row>
          <b-row>
            <b-col md="4">Demanda:</b-col>
            <b-col md="8">{{process.demandName}}</b-col>
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
            <b-col md="2">Solicitante:</b-col>
            <b-col md="10" style="color:green">{{process.requesterName}}</b-col>
          </b-row>
          <b-row>
            <b-col md="2">Tipo:</b-col>
            <b-col md="10"></b-col>
          </b-row>
          <b-row>
            <b-col md="2">Documento:</b-col>
            <b-col md="10"></b-col>
          </b-row>
          <b-row>
            <b-col md="2">Documento:</b-col>
            <b-col md="10"></b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>

    <div class="mt-2 mb-2">
      <b-card style="background-color: #ffff99">
        <b-row>
          <b-col
            class="mt-3 mb-3"
            md="3"
            sm="12"
            v-for="(stage, index) in stages"
            :index="index"
            :key="stage._id"
          >
            <b-row>
              <b-col md="10">
                <b-card class="box">
                  <div class="stage_name mb-1">{{stage.name}}</div>
                  <div v-if="stage._id == process.stageId">
                    <i style="color:orange" class="fas fa-check-circle fa-2x"></i>
                    <hr />
                    <div>
                      <b-button size="sm" variant="link" v-b-toggle.collapse-1>+detalhes</b-button>
                      <b-collapse style="font-size: 0.8em" id="collapse-1" class="mt-2">
                        Por 
                        <strong>{{ progresses[0].userName }}</strong>, 
                        em {{ progresses[0].updated_at }}. 
                        <hr/>
                        Relato: "{{ progresses[0].occurrence }}"
                      </b-collapse>
                    </div>
                  </div>
                  <div v-if="stage._id != process.stageId">
                    <i style="color:#ccc" class="fas fa-clock fa-2x"></i>
                  </div>
                  <div style="text-align:center">
                    <div v-if="index-1>=0">
                      <b-button
                        class="mt-2"
                        variant="success"
                        size="sm"
                        v-b-modal.modal-1
                        @click="newStage(stage)"
                      >
                        Registrar {{ stage.name }}
                        <i
                          style="color: white"
                          class="fas fa-check fa-lg ml-1"
                        ></i>
                      </b-button>
                      <b-button
                        class="mt-2"
                        variant="danger"
                        size="sm"
                        v-if="previousStage(stages[index-1]._id, process.stageId)"
                      >
                        <i style="color: white" class="fas fa-backward fa-lg mr-1"></i>
                        Devolver
                      </b-button>
                    </div>
                  </div>
                </b-card>
              </b-col>
              <b-col md="2" class="arrow" v-if="index+1 < stages.length">
                <i class="fas fa-arrow-right"></i>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
    </div>

    <div class="layer-total">Histórico de ocorrências do processo</div>

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

      <template slot="number" slot-scope="row">
        <a
          style="color:#006999; font-weight: bold"
          href="#"
          v-b-modal="'mymodal'"
          @click.prevent="goToProcess(row.item)"
        >{{row.item.number}}</a>
      </template>

      <template slot="actions" slot-scope="data">
        <a
          href="#"
          v-b-modal="'mymodal'"
          variant="danger"
          class="ml-1"
          @click.prevent="loadResource(data.item, 'edit')"
        >
          <i class="far fa-edit" title="Editar o registro."></i>
        </a>
        <a
          href="#"
          v-b-modal="'mymodal'"
          variant="danger"
          class="ml-1"
          @click.prevent="loadResource(data.item, 'remove')"
          style="color:red"
        >
          <i class="far fa-trash-alt" title="Excluir o registro."></i>
        </a>
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
      mode: "save",
      process: {},
      stages: {},
      stage: {},
      progress: {},
      progresses: {},
      totalRows: 0,
      items: [
        {
          key: "updated_at",
          label: "Data Ocorrência",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "userName",
          label: "Realizada por:",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "divisionName",
          label: "Na unidade:",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "arrayStages",
          label: "Ocorrência",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "occurrence",
          label: "Observações sobre a ocorrência",
          sortable: true,
          class: "text-center",
          thClass: "table-th",
          tdClass: "table-td"
        }
      ]
    };
  },
  methods: {
    newStage(stage) {
      this.stage = stage;
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
    }
  },
  mounted() {
    this.process = this.$route.params.process;
    this.getProgresses(this.process._id);
    this.loadStages(this.process.demandId);
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
}
</style>
