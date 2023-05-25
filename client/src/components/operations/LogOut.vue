<template>
<p></p>

</template>
<script>
export default {
  methods: {
    setLogOut() {
      // remove all items from local storage
      
      let accessToken = this.$store.state.token;
       //let body={accessToken}
      //localStorage.clear();
      
      // this.$http.post(`http://localhost:3000/api/users/logout`, function(err, result) {
      //   if(err){
      //     console.log(err);
      //   }
      //   console.log(result);
      // })
      this.$store.commit('setid', '');
        this.$store.commit('settoken', '');
        this.$store.commit('setUsername','');
        this.$store.commit('setRole','');
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
