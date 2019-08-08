<template>
  <div class="home">
    <PageTitle main="home" />

    <div v-for="demand in demands" :key="demand._id" class="mb-2">
      <b-card style="background-color: #eee">
        Quantidade de processos de
        <strong>{{ demand.name }}</strong> na unidade
        <strong>Nome da Unidade</strong> que aguardam as etapas a seguir:
        <hr />
        <b-row>
          <b-col
            class="mb-4"
            md="2"
            sm="12"
            v-for="(stage, index) in demand.stages"
            :index="index"
            :key="stage._id"
          >
            <b-row>
              <b-col md="10">
                <b-card class="box">
                  <div style="font-size:.9em; color:grey">etapa #{{index+1}}:</div>

                  <div class="stage_name">{{stage.name}}:</div>
                  <hr />

                  <div class="result" v-if="index-1>=0"></div>

                  <div class="result" v-if="index-1<0">--</div>
                  <span style="font-size:0.8em">aguardando...</span>
                </b-card>
              </b-col>
              <b-col md="2" class="arrow" v-if="index+1 < demand.stages.length">
                <i class="fas fa-arrow-right"></i>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "Home",
  components: { PageTitle },
  data: function() {
    return {
      demands: {},
      processes: {}
    };
  },
  methods: {
    loadDemands() {
      const url = `${baseApiUrl}/demands`;
      axios.get(url).then(res => {
        this.demands = res.data;
      });
    },
    loadProcesses() {
      const url = `${baseApiUrl}/processes`;
      axios.get(url).then(res => {
        this.processes = res.data;
      });
    }
  },
  mounted() {
    this.loadDemands();
    this.loadProcesses();
  }
};
</script>

<style>
.home .box {
  border-radius: 0px;
  background-color: #ffff99;
  text-align: center;
  -webkit-box-shadow: 1px 1px 1px 1px #ddd; /* Safari 3-4, iOS 4.0.2 - 4.2, Android 2.3+ */
  -moz-box-shadow: 1px 1px 1px 1px #ddd; /* Firefox 3.5 - 3.6 */
  box-shadow: 1px 1px 1px 1px #ddd; /* Opera 10.5, IE 9, Firefox 4+, Chrome 6+, iOS 5 */
}
.home .stage_name {
  font-weight: bold;
  font-size: 1.1em;
  color: brown;
}
.home .arrow {
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.home .result {
  font-size: 2.3em;
  font-weight: bold;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}
</style>
