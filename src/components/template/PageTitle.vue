<template>
  <div class="page-title text-center">
    <h1>
      <i v-if="icon" :class="icon"></i>
      {{ main }} 
      <div class="page-subtitle">{{sub}}</div>
    </h1>
    <hr>
  </div>
</template>

<script>
export default {
  name: "PageTitle",
  props: ["icon", "main", "sub"]
};
</script>

<style>
.page-title h1 {
  font-size: 1rem;
  font-weight: bold;
  color: rgb(1, 155, 1);
}

.page-subtitle {
  margin-top: 3px;
  font-size: 1rem;
  font-weight: normal;
  color: rgb(1, 155, 1);
}

.page-title hr {
  border: 0;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(186, 149, 40, 0),
    rgba(186, 149, 40, 0.75),
    rgba(186, 149, 40, 0)
  );
}

</style>
