<template>
  <div class="process">
    <Header title="[e-Proc 2]" />

    <PageTitle main="progresses" />

    <div class="layer-total">Histórico de ocorrências</div>

    <div>
      <b-table id="my-table" :items="progresses" bordered responsive small :fields="items">
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
          key: "divisionName",
          label: "Unidade:",
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
    getProgresses() {
      const url = `${baseApiUrl}/progresses`;
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
  }
};
</script>

<style>
</style>
