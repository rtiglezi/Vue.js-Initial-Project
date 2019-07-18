<template>
  <div class="confirm">
  </div>
</template>

<script>
export default {
  name: "Confirm",
  mounted() {
    let origin = this.$route.query.origin;
    let msg = this.$route.query.msg;
    this.$toasted.global.defaultConfirm({msg});
    this.$router.push(`/admin/${origin}?refresh=true`);
  }
};
</script>

<style>
</style>
