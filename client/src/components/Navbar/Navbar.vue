<template>
 <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li  class="breadcrumb-item">
            <router-link to="/AdminHome">Home</router-link>
        </li>
        <li class="breadcrumb-item">
            <router-link to="/Notification">Notification</router-link>
        </li>
        <li class="breadcrumb-item">
            <router-link to="/Users">All Users</router-link>
        </li>
        <li class="breadcrumb-item">
            <router-link to="/logout">logout</router-link>
        </li>
        <li class="breadcrumb-item active" aria-current="page">
        </li>
      </ol>
    </nav>
  </div>
</nav>
</template>

<script>
export default {
  name: 'Navbar',
  props:{
    Role:String,
  },
  methods:{
    getRender(){
      
    }
  }
}

</script>
<style>


</style>
