<template>
  <div class="stage-admin">
    <PageTitle
      icon="fa fa-flag"
      main="Cadastro de Etapas"
      sub="Área administrativa de acesso restrito"
    />
    <!-- INICIO FORMULÁRIO DE CADASTRO -->
    <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
      <b-card class="mb-2 box-out">
        <b-card class="box">
          <b-row>
            <b-col md="3" sm="12" class="box-ico">
              <i class="fa fa-flag fa-5x" aria-hidden="true"></i>
              <br />A Demanda
              <div class="descDemand">{{ demand.name }}</div>tem
              <span style="font-size:1.3em; font-weight:bold">{{list.length}}</span> etapa(s) adicionada(s)
            </b-col>
            <b-col md="9" sm="12">
              <input type="hidden" v-model="demand.stages" />

              <div class="text-right">
                <a href="#" v-on:click.prevent="expandAll">
                  <i class="fa fa-plus-square mr-1"></i>Expandir
                </a>
                |
                <a href="#" v-on:click.prevent="collapseAll">
                  <i class="fa fa-minus-square mr-1"></i>Esconder
                </a>
              </div>

              <draggable tag="ul" :list="list" class="list-group" handle=".handle" animation="500">
                <li
                  class="list-group-item mb-3"
                  v-for="(element, idx) in list"
                  :key="element.position"
                >
                  <b-row>
                    <b-col md="1">
                      <i
                        class="fas fa-arrows-alt handle mr-3"
                        style="cursor: pointer"
                        title="Arrastar..."
                      ></i>
                    </b-col>
                    <b-col md="10">
                      <input
                        type="text"
                        class="form-control"
                        v-model="element.name"
                        style="width:100%"
                      />
                    </b-col>
                    <b-col md="1">
                      <i
                        class="fas fa-trash-alt close ml-3"
                        style="color:red"
                        title="Excluir..."
                        @click="removeAt(idx)"
                      ></i>
                    </b-col>
                  </b-row>

                  <hr />

                  <div>
                    <b-button
                      variant="link"
                      v-b-toggle="'division_' + element._id"
                      size="sm"
                      class="pl-2 pr-2 pt-0 pb-0"
                    >
                      <b-badge
                        variant="primary"
                        class="mr-1"
                      >{{element.allowedDivisions ? element.allowedDivisions.length : "" }}</b-badge>Unidade(s) responsável(veis)
                    </b-button>
                    <b-collapse ref="collapsible" :id="'division_' + element._id" class="mt-2 ml-5">
                      <b-form-checkbox-group
                        stacked
                        id="user-allowedDivisions"
                        v-model="element.allowedDivisions"
                        name="divisions"
                      >
                        <b-form-checkbox
                          v-for="division in divisions"
                          :key="division._id"
                          :value="division._id"
                        >{{ division.name }}</b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-collapse>
                  </div>

                  <hr />

                  <div>
                    <b-button
                      variant="link"
                      v-b-toggle="'result_' + element._id"
                      size="sm"
                      class="pl-2 pr-2 pt-0 pb-0"
                    >
                      <b-badge
                        variant="primary"
                        class="mr-1"
                      >{{element.results ? element.results.length : "" }}</b-badge>Resultado(s)
                    </b-button>
                    <b-collapse ref="collapsible" :id="'result_' + element._id" class="mt-2">
                      <ResultAdmin :stage="element"></ResultAdmin>
                    </b-collapse>
                  </div>
                </li>
              </draggable>

              <br/>

              <b-row>
                <b-col md="4">
                  <b-button variant="success" style="width:100%" class="mt-1" @click="add">
                    <i class="fa fa-plus mr-1"></i>Adicionar Etapa
                  </b-button>
                </b-col>
                <b-col md="4">
                  <b-button variant="primary" style="width:100%" class="mt-1" @click="save">
                    <i class="fas fa-save mr-1"></i>Salvar Alterações
                  </b-button>
                </b-col>
                <b-col md="4">
                  <b-button
                    variant="secondary"
                    style="width:100%"
                    class="mt-1"
                    @click="backToDemands()"
                  >
                    Voltar ao Cadastro de Demandas
                    <i class="fa fa-arrow-right fa-lg ml-1"></i>
                  </b-button>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-card>
      </b-card>
    </b-form>
    <!-- FINAL FORMULÁRIO DE CADASTRO -->
  </div>
</template>

<script>
import { baseApiUrl } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
import ResultAdmin from "./ResultAdmin";

let position = 1;

import draggable from "vuedraggable";

export default {
  name: "StageAdmin",
  components: {
    PageTitle,
    draggable,
    ResultAdmin
  },
  display: "Handle",
  divisions: [],
  data: function() {
    return {
      demand: {},
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
    loadDemand(demand) {
      const url = `${baseApiUrl}/demands/${demand._id}`;
      axios.get(url).then(res => {
        this.demand = res.data;
        const url2 = `${baseApiUrl}/demands/${demand._id}/stages`;
        axios.get(url2).then(res2 => {
          this.list = res2.data;
        });
      });
    },
    save() {
      axios["put"](`${baseApiUrl}/demands/${this.demand._id}/stages`, this.list)
        .then(() => {
          this.$toasted.global.defaultSuccess({
            msg: `Alterações registradas com sucesso!`
          });
        })
        .catch();
    },
    backToDemands() {
      this.$router.push({ name: "demandAdmin", params: { showCad: false } });
    },
    removeAt(idx) {
      this.list.splice(idx, 1);
      this.loadDivisions();
    },
    add: function() {
      position++;
      this.list.push({
        name: "Nova etapa...",
        results: [],
        allowedDivisions: [],
        position
      });
      this.loadDivisions();
    },
    collapseAll() {
      this.$refs.collapsible.map(c => {
        c.visible = false;
      });
    },
    expandAll() {
      this.$refs.collapsible.map(c => {
        c.visible = true;
      });
    }
  },
  mounted() {
    this.demand = this.$route.params.demand;
    this.loadDemand(this.demand);
    this.loadDivisions();
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
.descDemand {
  font-weight: bold;
  font-size: 1.3em;
}
</style>