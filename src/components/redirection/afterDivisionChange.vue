<template>
    <div style="text-align: center">
          <PageTitle
      main=""
    />
        A unidade foi alterada com sucesso!<br>
        Os processos e todos os dados a serem exibidos agora serão os da unidade recém-escolhida, conforme selecionado acima.<br>
        <hr>
        <b-button @click="go()">Ver processos da Unidade escolhida</b-button>
    </div>
</template>

<script>
import PageTitle from "../template/PageTitle";

export default {
    name: 'AfterDivisionChange',
    components: { PageTitle },
    methods: {
        go(){
            this.$router.push('/processes');
        }
    }
}
</script>

<style>

</style>
