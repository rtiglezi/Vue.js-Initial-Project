<template>
  <div class="process">
    <Header title="[e-Proc 2]" />

    <PageTitle main="progresses" />

    <div>
      <b-button v-b-toggle.collapse-3 class="m-1" variant="link">
        <i class="fas fa-search mr-1"></i>pesquisar
      </b-button>
      <b-collapse visible id="collapse-3">
        <b-card style="background-color: #eee">
          <b-row>
            <b-col>
              Demanda:
              <b-form-select v-model="demand" @change="getStages($event)">
                <option
                  v-for="demand in demands"
                  :value="demand._id"
                  :key="demand._id"
                >{{demand.name}}</option>
              </b-form-select>
            </b-col>

            <b-col>
              <div v-if="demand">
                Etapa:
                <b-form-select v-model="stage" @change="chooseResults($event)">
                  <option v-for="stage in stages" :value="stage._id" :key="stage._id">{{stage.name}}</option>
                </b-form-select>
              </div>
            </b-col>

            <b-col>
              <div v-if="results.length>0">
                Resultado(s):
                <br />
                <MultiSelect
                  style="width:100%"
                  v-model="selectedResults"
                  :options="results"
                  optionLabel="name"
                  placeholder="Selecione o(s) Resultados(s)"
                  :disabled="results.length<1"
                  @change="setArrayResultsIds()"
                />
              </div>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              Usuário(s):
              <br />
              <MultiSelect
                style="width:100%"
                v-model="selectedUsers"
                :options="users"
                optionLabel="name"
                placeholder="Selecione o(s) Usuário(s)"
              />
            </b-col>
          </b-row>
        </b-card>
      </b-collapse>
    </div>

    <hr />

    <div class="layer-total">Histórico de ocorrências</div>

    <div>
      <b-table id="my-table" :items="progresses" :fields="items" responsive small>
        <template
          slot="updated_at"
          slot-scope="row"
        >{{ row.item.updated_at | moment("DD/MM/YYYY HH:mm") }}</template>

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
            <div v-for="(itm, idx) in item" :key="itm._id" :index="idx">
              <div v-if="itm._id === row.item.result">{{ itm.name }}</div>
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
  </div>
</template>

<script>
import { baseApiUrl } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

import { mapState } from "vuex";

export default {
  name: "Progress",
  computed: mapState(["user"]),
  components: { PageTitle },
  data: function() {
    return {
      demands: [],
      demand: null,
      stages: [],
      stage: null,
      arrayResultsIds: [],
      selectedResults: [],
      results: [],
      selectedUsers: [],
      users: [],
      progresses: [],
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
          key: "processNumber",
          label: "Processo",
          sortable: true,
          class: "text-left",
          thClass: "table-th2",
          tdClass: "table-td"
        },
        {
          key: "demandName",
          label: "Demanda:",
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
    getDemands() {
      const url = `${baseApiUrl}/demands`;
      axios.get(url).then(res => {
        this.demands = res.data;
      });
    },

    getStages(demand) {
      this.results = [];
      this.getProgresses({ key: "demand", value: demand });
      const url = `${baseApiUrl}/demands/${demand}/stages`;
      axios.get(url).then(res => {
        this.stages = res.data;
      });
    },

    chooseResults(stage) {
      this.getProgresses({ key: "stage", value: stage });
      let st = {};
      st = this.stages.filter(x => x._id === stage);
      this.results = st[0].results;
    },

    setArrayResultsIds() {
      this.arrayResultsIds = [];
      this.selectedResults.map(r => {
        this.arrayResultsIds.push(r._id);
      });
      const url = `${baseApiUrl}/progresses`;
      axios.get(url, {params: {"stage": this.stage, "rIds": this.arrayResultsIds}}).then(res => {
        this.progresses = res.data;
        if (res.data) {
          this.totalRows = res.data.length;
          this.progresses.sort((a, b) =>
            a.updated_at > b.updated_at ? 1 : -1
          );
          this.progresses = this.progresses.reverse();
        }
      });
    },

    getUsers() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
        this.users = res.data;
      });
    },

    getProgresses(paramSearch) {
      //alert(JSON.stringify(paramSearch))
      let query = "";
      if (paramSearch) {
        query = "?" + paramSearch.key + "=" + paramSearch.value;
      }
      const url = `${baseApiUrl}/progresses${query}`;
      axios.get(url).then(res => {
        this.progresses = res.data;
        if (res.data) {
          this.totalRows = res.data.length;
          this.progresses.sort((a, b) =>
            a.updated_at > b.updated_at ? 1 : -1
          );
          this.progresses = this.progresses.reverse();
        }
      });
    }
  },
  mounted() {
    this.getProgresses();
    this.getDemands();
    this.getUsers();
  }
};
</script>

