<template>
  <div>
    <Navbar/>
    <div class="container box">
        <form>
            <strong><h4>ADD USER</h4></strong>
            <div class="form-row display">
              <div class="form-group col-md-5">
                <label for="Username">Username</label>
                <input type="text" class="form-control" id="Username" name="Username" v-model="employee.Username" placeholder="Username" autocomplete="off">
              </div>
              <div class="form-group col-md-5">
                <label for="email">Email</label>
                <input type="email" class="form-control" id="email" name="email" v-model="employee.email" placeholder="Email" autocomplete="off">
              </div>
              <div class="form-group col-md-5">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" name="password" v-model="employee.password" placeholder="Password" autocomplete="off">
              </div>
              <div class="form-group col-md-5">
                <label for="text">Role</label>
                <br>
                <select class="custom-select my-1 mr-sm-2" id="Role" name="Role" v-model="employee.Role">
                    <option value="student">student</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Admin" selected>Admin</option>
                 </select>
              </div>
              <div class="form-group col-md-5">
                <label for="RollNo">RollNo</label>
                <input type="text" class="form-control" id="RollNo" name="RollNo" v-model="employee.RollNo" placeholder="RollNo" autocomplete="off">
              </div>
            </div>
            <button type="submit" @click.prevent="submitUser" class="btn btn-primary">Sign up</button>
          </form>
          <div v-if="register">
              <p style="color:green;">successfully created!</p>
          </div>
          <div v-if="registerf">
            <p style="color:red;">{{message}}</p>
          </div>
    </div>
    </div>
</template>

<script>
import Navbar from '../../Navbar/Navbar.vue'
  export default{
    
    data() {
      return {
        register:false,
        registerf:false,
        employee:{
          Username:'',
          email: '',
          password: '',
          Role: '',
          RollNo: ''
        },
        message:''
      }
    },
    methods:{
      submitUser(){
        console.log(this.employee);
        this.$http.post('http://localhost:3000/api/users', this.employee)
        .then(res => {
          console.log(res);
          this.register=true;
          this.$router.push({
                      name: 'Users'
                      })
        }, err => {
          console.log(err);
          this.message=err.body.error.message;
          this.registerf=true;
          setTimeout(this.letClear,1500)
        })

      },
      clearPassword(){
            this.employee.email = '',
              this.employee.password = '',
              this.employee.Username="",
              this.employee.RollNo='',
              this.ispasswordtrue = false,
              this.register=false,
              this.registerf=false
          },
          letClear(){
            this.message='';
          this.registerf=false;
          }

    },components:{
      Navbar
    }
  }
</script>

<style lang="css" scoped>
body {
    font-family: "Lato", sans-serif;
}
.main-head{
    height: 150px;
    background: #FFF;
   
}

.sidenav {
    height: 100%;
    background-color: #000;
    overflow-x: hidden;
    padding-top: 20px;
}


.main {
    padding: 0px 10px;
}

@media screen and (max-height: 450px) {
    .sidenav {padding-top: 15px;}
}

@media screen and (max-width: 450px) {
    .login-form{
        margin-top: 10%;
    }

    .register-form{
        margin-top: 10%;
    }
}

@media screen and (min-width: 768px){
    .main{
        margin-left: 40%; 
    }

    .sidenav{
        width: 40%;
        position: fixed;
        z-index: 1;
        top: 0;
        left: 0;
    }

    .login-form{
        margin-top: 80%;
    }

    .register-form{
        margin-top: 20%;
    }
}


.login-main-text{
    margin-top: 20%;
    padding: 60px;
    color: #fff;
}

.login-main-text h2{
    font-weight: 300;
}

.btn-black{
    background-color: #000 !important;
    color: #fff;
}
</style>