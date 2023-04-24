<template>
 
 <section class="vh-100">
  <div class="container-fluid h-custom">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-md-9 col-lg-6 col-xl-5">
        <img src="https://www.skoolbeep.com/blog/wp-content/uploads/2020/12/HOW-DO-YOU-DESIGN-A-LIBRARY-MANAGEMENT-SYSTEM-min.png"
          class="img-fluid" alt="Sample image">
      </div>
      <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
        <form>
          <div class="form-outline mb-4">
            <label class="form-label" for="email">Email address</label>
            <input type="email" class="form-control" name="email" id="email" v-model="employee.email" placeholder="Enter email" autocomplete="off">
          </div>
          <div class="form-outline mb-3">
            <label class="form-label"  for="password">Password</label>
            <input type="password" class="form-control " name="password" id="password" v-model="employee.password" placeholder="Password" autocomplete="off">
          </div>
          <div v-if="ispasswordtrue">
              <p style="color:red;">Incorrect email or password,Please try again!</p>
          </div>
          <br>
          <div class="d-flex justify-content-between align-items-center">
            <!-- Checkbox -->
            <div class="form-check mb-0">
              <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
              <label class="form-check-label" for="form2Example3">
                Remember me
              </label>
            </div>
            <button type="submit" @click.prevent="forgetRoute" class="btn btn-default">Forgot password?</button>
          </div>
          <div class="text-center text-lg-start mt-4 pt-2">
            <button type="submit" @click.prevent="checkLogin" class="btn btn-primary btn-lg" style="padding-left: 2.5rem; padding-right: 2.5rem;">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div
    class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
    <div class="text-white mb-3 mb-md-0">
      Copyright © 2023. All rights reserved.
    </div>
  </div>
</section>
   
</template>

<script> 
import { eventBus } from '../main.js';  
  export default{
      data()
      {
          return {
              employee: {
                  email: '',
                  password: '',
              },
              ispasswordtrue: false
          }
      },
      methods:{
        forgetRoute(){
          this.$router.push('/forget');
        },
        checkLogin(){
            //console.log(this.employee);
              this.$http.post("http://localhost:3000/api/users/login", this.employee)
                  .then(res => {
                    //console.log(res.body.Username);
                    const id=res.body.userId;
                    const token=res.body.id;
                    //localStorage.setItem('token',res.body.id);
                   // localStorage.setItem('id',res.body.userId);

                   this.$store.commit('setid', res.body.userId);
                   this.$store.commit('settoken', res.body.id);

                    const userId=res.body.userId;
                    this.$http.get(`http://localhost:3000/api/users/${userId}`,{id:userId}).then(res=>{
                      console.log(res.body);
                      // const Username=res.body.Username;
                      // const Role=res.body.Role;
                      //eventBus.$emit('my-event', { message: 'Hello, world!'});
                      //localStorage.setItem('Username',res.body.Username);

                     this.$store.commit('setUsername', res.body.Username);
                     this.$store.commit('setRole',res.body.Role);
                      //console.log("inside login");

                      this.$router.push({
                      name: 'MainDash'
                      })
                      //this.$router.push(`/studentdashboard/:{res.body.Role}`);


                    }).catch(err=>{
                      console.log(err);
                    })
                  }).catch(error=>{
                    this.ispasswordtrue = true,
                    console.log(error);
                           this.$router.push('/');
                          setTimeout(this.clearPassword,1500)
                  })
          },
          clearPassword(){
            this.employee.email = '',
              this.employee.password = '',
              this.ispasswordtrue = false
          }
         
      }
  }
</script>

<style>.divider:after,
.divider:before {
content: "";
flex: 1;
height: 1px;
background: #eee;
}
.h-custom {
height: calc(100% - 73px);
}
@media (max-width: 450px) {
.h-custom {
height: 100%;
}
}
</style>