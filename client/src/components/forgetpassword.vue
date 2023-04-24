<template>
<div class="card text-center" style="width: 400px; margin: auto;border: 3px solid green;padding: 10px;">
<div class="card-header h5 text-white bg-primary">Password Reset</div>
    <div class="card-body px-5">
        <p class="card-text py-2">
            Enter your email address and we'll send you an email with instructions to reset your password.
        </p>
        <div class="form-outline">
            <input type="email" id="typeEmail" class="form-control my-3" v-model="password.email" />
            <label class="form-label" for="typeEmail" >Email input</label>
        </div> 
        <button type="submit" @click.prevent="forgetPassword" class="btn btn-primary" >Reset Password</button>
        <br>
    </div>
    <div>
            <button type="submit" @click.prevent="loginRoute" class="btn btn-link" > ⬅ Login page</button>
        </div>
        <div v-if="passwordstatus">
            <p style="color:green;"> Link successfully sent to your Email</p>
        </div>
</div>

</template>

<script>
export default{
      data()
      {
          return {
              password:{
                email:''
              },
              passwordstatus:false
          }
      },
      methods:{
        loginRoute(){
          this.$router.push('/');
        },
        forgetPassword(){
            let body=this.password;
            console.log(body);
            this.$http.post(`http://localhost:3000/api/users/forgetPassword`,body).then(res=>{
              console.log(res);
              this.passwordstatus=true;
              //this.$router.push('/');
            }).catch(err=>{
              console.log(err);
            })
        }
         
      }
  }
</script>

<style>


</style>