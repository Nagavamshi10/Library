<template>
    <div class="card text-center" style="width: 400px; margin: auto;border: 3px solid green;padding: 10px;">
    <div class="card-header h5 text-white bg-primary">Password Reset</div>
        <div class="card-body px-5">
            <p class="card-text py-2">
                Enter your new password and we'll update your password.
            </p>
            <div class="form-outline">
                <input type="password" id="typeEmail" class="form-control my-3" v-model="body.password" />
                <label class="form-label" for="password" >New Password</label>
            </div> 
            <div class="form-outline">
                <input type="text" id="typeEmail" class="form-control my-3" v-model="password1" />
                <label class="form-label" for="text" >Confirm Password</label>
            </div> 
            <button type="submit" @click.prevent="updatePassword" class="btn btn-primary" >Update Password</button>
            <br>
        </div>
        <div>
            <div v-if="status">
            <p style="color:red;">Password Doesn't match</p>
        </div>
        <div v-else-if="status1">
        <p style="color: green;">Successfully Updated</p>
        </div>
        <div v-else>

        </div>
       <button type="submit" @click.prevent="loginRoute" class="btn btn-link" > ⬅ Login page</button>
        </div>
    </div>
    
    </template>
    
    <script>
    export default{
          data()
          {
              return {
                  body:{
                    password:'',
                    id:this.$route.query.id
                  },
                  password1:'',
                  status:false,
                  status1:false
                  
              }
          },
          methods:{
            loginRoute(){
              this.$router.push('/');
            },
            updatePassword(){
                if(this.body.password===this.password1){
                    this.status=false;
                    let body1=this.body;
                    //console.log(body1);
                   // console.log(this.body.id);
                    this.$http.post('http://localhost:3000/api/users/resetPassword',body1,function(err,data){
                        if(err){
                            console.log(err);
                        }else{
                        
                        console.log(result);
                        }
                    });
                    this.status1=true;

                }else{
                    console.log("inside else");
                    this.status=true;
                    //setTimeout(this.clearPassword(),3000)
                }
                
            }
             
          }
      }
    </script>
    
    <style>
    
    
    </style>