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
              <br />Etapas da Demanda
              
              <div class="descRequest">{{ request.name }}</div>
            </b-col>
            <b-col md="9" sm="12">
              <draggable class="row">
                <input type="hidden" v-model="request.stages" />

                <draggable class="col-12">
                  <draggable tag="ul" :list="list" class="list-group" handle=".handle">
                    <li
                      class="list-group-item mb-3"
                      v-for="(element, idx) in list"
                      :key="element.position"
                    >
                      <b-row>
                        <b-col md="1">
                          <i
                            class="fa fa-arrows handle mr-3"
                            style="cursor: pointer"
                            title="Arrastar..."
                          ></i>
                        </b-col>
                        <b-col md="9">
                          Etapa:
                          <input
                            type="text"
                            class="form-control"
                            v-model="element.name"
                            style="width:100%;"
                          />
                        </b-col>
                        <b-col md="2">
                          <i
                            class="fa fa-times close ml-3"
                            style="color:red"
                            title="Excluir..."
                            @click="removeAt(idx)"
                          ></i>

                        </b-col>
                      </b-row>
                      <hr/>
                      <ResultAdmin :stage="element"></ResultAdmin>
                    </li>

                    <br />

                    <b-row>
                      <b-col md="4">
                        <b-button variant="success" style="width:100%" class="mt-1" @click="add">
                          <i class="fa fa-plus mr-1"></i>Adicionar Etapa
                        </b-button>
                      </b-col>
                      <b-col md="4">
                        <b-button variant="primary" style="width:100%" class="mt-1" @click="save">
                          <i class="fa fa-save mr-1"></i>Salvar Alterações
                        </b-button>
                      </b-col>
                      <b-col md="4">
                        <b-button
                          variant="secondary"
                          style="width:100%"
                          class="mt-1"
                          @click="backToRequests()"
                        >
                          Voltar ao Cadastro de Demandas
                          <i class="fa fa-arrow-right fa-lg ml-1"></i>
                        </b-button>
                      </b-col>
                    </b-row>
                  </draggable>
                </draggable>
              </draggable>
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
import Confirm from "./Confirm";
import ResultAdmin from "./ResultAdmin";

let position = 1;

import draggable from "vuedraggable";

export default {
  name: "StageAdmin",
  components: { PageTitle, Confirm, draggable, ResultAdmin },
  display: "Handle",
  data: function() {
    return {
      request: {},
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
    loadRequest(request) {
      const url = `${baseApiUrl}/requests/${request._id}`;
      axios.get(url).then(res => {
        this.request = res.data;
        const url2 = `${baseApiUrl}/requests/${request._id}/stages`;
        axios.get(url2).then(res2 => {
          this.list = res2.data;
        });
      });
    },
    save() {
      axios["put"](
        `${baseApiUrl}/requests/${this.request._id}/stages`,
        this.list
      )
        .then(() => {
          alert("Alterações salvas com sucesso!");
        })
        .catch();
    },
    backToRequests() {
      this.$router.push({ name: "requestAdmin", params: { showCad: false } });
    },
    removeAt(idx) {
      this.list.splice(idx, 1);
    },
    add: function() {
      position++;
      this.list.push({ name: "Nova etapa...", position });
    }
  },
  mounted() {
    this.request = this.$route.params.request;
    this.loadRequest(this.request);
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
.descRequest {
  font-weight: bold;
  font-size: 1.3em;
}
</style>