<template>
<div class="card text-center" style="width: 400px; margin: auto;border: 3px solid green;padding: 10px;">
<div class="card-header h5 text-white bg-primary">Password Reset</div>
    <div class="card-body px-5">
        <p class="card-text py-2">
            Enter your email address and we'll send you an email with instructions to reset your password.
        </p>
        <div class="form-outline">
            <input type="email" id="typeEmail" class="form-control my-3" v-model="forgetEmail.email" />
            <label class="form-label" for="typeEmail" >Email input</label>
        </div> 
        <button type="submit" @click.prevent="forgetPassword" class="btn btn-primary" >Reset Password</button>
        <br>
    </div>
    <div>
            <router-link to="'/'"><button type="submit"  class="btn btn-link" > ⬅ Login page</button></router-link>
        </div>
        <div >
            <p style="color:green;"> {{successMessage}}</p>
        </div>
</div>

</template>

<script>
export default{
      data()
      {
          return {
              forgetEmail:{
                email:''
              },
              successMessage:''
          }
      },
      methods:{
        forgetPassword(){
            let body=this.forgetEmail;
            console.log(body);
            this.$http.post(`http://localhost:3000/api/users/forgetPassword`,body).then(res=>{
              console.log(res.body.user);
              this.successMessage=res.body.user.message;

              
              //this.passwordstatus=true;
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