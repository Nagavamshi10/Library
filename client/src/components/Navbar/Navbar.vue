<template>
<div>
<nav class="navbar navbar-expand-lg navbar-light" style="background-color: #dee2e6;">
  
  <div class="container-fluid">
    <nav aria-label="breadcrumb">
     <ol class="navbar-nav mr-auto">
      <div v-if="role=='Admin'">
            <router-link to="/AdminHome">
              <button class="btn btn-gray">Home</button></router-link>
            <router-link to="/Notification"><button class="btn btn-gray">Notification</button></router-link>
            <router-link to="/Users"><button class="btn btn-gray">All Users</button></router-link>
            <router-link to="/logout"><button class="btn btn-gray">logout</button></router-link>
      </div>
      <div v-else-if="role=='student'">
          <router-link to="/StudentHome">
              <button class="btn btn-gray">Home</button></router-link>
            <router-link to="/logout"><button class="btn btn-gray">logout</button></router-link>
          </div>
          <div v-else>
            <router-link to="/LectureHome">
              <button class="btn btn-gray">Home</button></router-link>
            <router-link to="/logout"><button class="btn btn-gray">logout</button></router-link>
          </div>
</ol>
</nav>
  </div>
</nav>
<div marign-bottom="20px">
</div>
</div>
</template>

<script>
export default {
  name: 'Navbar',
  data(){
            return {
              role:''
            }
},
mounted(){
          this.role=this.$store.state.Role;
        }
  
}
</script>
<style>

.navbar{
  margin-bottom: 30px;
}
</style>
