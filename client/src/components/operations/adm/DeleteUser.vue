<template>
    <div>
      <Navbar/>
    <div class="row justify-content-center">
<table class="table table-striped" style="width:70%">
  <thead class="thead-dark">
    <tr>
      <th >S.No.</th>
      <th>Name</th>
      <th >Role</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(user,index) in Users" v-bind:key="user._id">
     <th scope="row" >{{index+1}}</th>
      <td>{{user.Username}}</td>
      <td>{{user.Role}}</td>
        <td v-if="user.Role!='Admin'">
        <button class="btn btn-warning"  @click.prevent="toDeleteUser(index)">Delete</button>
        </td>
        <td v-else></td>

    </tr>
  </tbody>
  <tfoot>
      <tr>
        <td colspan="8" align="center"><router-link to="/Register"><button class="btn btn-dark">Add User</button></router-link></td>
      </tr>
    </tfoot>
</table>
<div v-if="status">
              <p style="color:red;align-items: center;">{{message}}</p>
</div>
</div>
</div>
</template>

<script>
import Navbar from '../../Navbar/Navbar.vue'
  export default{
    data() {
      return {
        Users:[],
        status:false,
        userName:'',
        token:'',
        id:'',
        message:''
      }
    },
    methods:{
      toDeleteUser(i){
        let Username=this.Users[i].Username;
        let RollNo=this.Users[i].RollNo;
        let body={Username,RollNo}
         console.log(body);
        //const token=localStorage.getItem('token');
        this.$http.post(`http://localhost:3000/api/users/DeleteUser`, body)
        .then(res => {
            //console.log("inside delete");
           console.log(res.body.user.message);
           this.message=res.body.user.message;
           this.status=true;
           setTimeout(this.getClear,1500)
           this.getUsers();
        }).catch(err=>{
            console.log(err);
        })
      },
      getUsers(){
           // const token=localStorage.getItem('token');
            this.$http.get(`http://localhost:3000/api/users`).then(res=>{
              console.log(res);
              this.Users=res.body;
              // this.getUsers();
              console.log(this.Users)
            }).catch(err=>{
              console.log(err);
            })
          },
          getClear(){
            this.message='';
            this.status=false;

          }

    },mounted(){
      this.userName=this.$store.state.Username;
        this.token=this.$store.state.token;
        this.id=this.$store.state.id;
      this.getUsers();
    },
    updated(){
        setTimeout(() => {
          this.getUsers();
        }, 15000);
        
      },
    components:{
      Navbar
    }
  }
</script>

<style>
.form-group{
    padding-bottom: 10px;
}
.box{
    padding-top: 30px;
}
</style>
