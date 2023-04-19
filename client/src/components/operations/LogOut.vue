<template>
<p></p>

</template>
<script>
export default {
  methods: {
    setLogOut() {
      // remove all items from local storage
      this.$store.commit('setid', '');
      this.$store.commit('settoken', '');
      this.$store.commit('setUsername','');
      this.$store.commit('setRole','');
      //localStorage.clear();
      this.$router.push('/');
      // redirect to login page or do other actions
    }
  },mounted(){
    this.setLogOut();
  }
}


</script>
<style>
</style>
