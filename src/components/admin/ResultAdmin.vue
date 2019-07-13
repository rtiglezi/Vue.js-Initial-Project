<template>
  <div class="result-admin">
    <!-- INICIO FORMULÁRIO DE CADASTRO -->
    <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
      <b-row>
        <b-col>
          <draggable class="row">
            <input type="hidden" v-model="request.stages" />

            <draggable class="col-12">
              <draggable tag="ul" :list="list" class="list-group" handle=".handle">
                <li
                  class="list-group-item mb-1"
                  v-for="(element, idx) in list"
                  :key="element.position"
                  style="background-color: #eee"
                >
                  <b-row>
                    <b-col md="1">
                      <i
                        class="fa fa-arrows handle mr-3"
                        style="cursor: pointer"
                        title="Arrastar..."
                      ></i>
                    </b-col>
                    <b-col md="5">
                      <input
                        type="text"
                        class="form-control"
                        v-model="element.name"
                        style="width:100%"
                        size="sm"
                      />
                    </b-col>
                    <b-col md="5">
                      <b-form-checkbox
                        :id="'checkbox-'+idx"
                        v-model="element.entailsConclusion"
                        :name="'checkbox-'+idx"
                        value="true"
                        unchecked-value="false"
                        class="mt-1"
                        style="color: grey"
                      >Gera a conclusão do processo na(s) unidade(s)</b-form-checkbox>
                    </b-col>
                    <b-col md="1">
                      <i
                        class="fa fa-times close ml-3"
                        style="color:red"
                        title="Excluir..."
                        @click="removeAt(idx)"
                      ></i>
                    </b-col>
                  </b-row>
                </li>

                <b-row>
                  <b-col md="4">
                    <b-badge href="#" variant="link" class="mt-1" @click="add">
                      <i class="fa fa-plus mr-1"></i>Adicionar Resultado
                    </b-badge>
                  </b-col>
                </b-row>
              </draggable>
            </draggable>
          </draggable>
        </b-col>
      </b-row>
    </b-form>
    <!-- FINAL FORMULÁRIO DE CADASTRO -->
  </div>
</template>

<script>
import Confirm from "./Confirm";

let position = 1;

import draggable from "vuedraggable";

export default {
  name: "ResultAdmin",
  props: ["stage"],
  components: { Confirm, draggable },
  display: "Handle",
  data: function() {
    return {
      request: {},
      list: [{}],
      dragging: false
    };
  },
  computed: {
    draggingInfo() {
      return this.dragging ? "under drag" : "";
    }
  },
  methods: {
    removeAt(idx) {
      this.list.splice(idx, 1);
    },
    add: function() {
      position++;
      this.list.push({ name: "Novo resultado...", position });
    }
  },
  mounted() {
    this.list = this.stage.results;
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