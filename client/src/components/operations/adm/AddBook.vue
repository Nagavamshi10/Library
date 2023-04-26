<template>
  <div>
    <Navbar/>
    <div class="container box">
        <form>
            <strong><h3><u>Register</u></h3></strong>
            <div class="form-row display">
              <div class="form-group col-md-5">
                <label for="title">title</label>
                <input type="text" class="form-control" id="title" name="title" v-model="Book.title" placeholder="title" autocomplete="off">
              </div>
              <div class="form-group col-md-5">
                <label for="Nocount">Number of Copies</label>
                <input type="number" class="form-control" id="Nocount" name="Nocount" v-model="Book.Nocount" placeholder="0" autocomplete="off">
              </div>
            </div>
            <button type="submit" @click.prevent="submit" class="btn btn-primary">➕ Add</button>
          </form>
          <div v-if="register">
              <p style="color:green;">successfully created!</p>
          </div>
          <div v-if="registerf">
            <p style="color:red;">{{ message }}</p>
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
        userName:'',
        token:'',
        id:'',
        Book:{
          title:'',
          Nocount:0,
          AssignedTo:[]

        },
        message:''
      }
    },
    methods:{
      submit(){
        console.log(this.Book);
        //const token=localStorage.getItem('token');
        this.$http.post(`http://localhost:3000/api/Books`, this.Book)
        .then(res => {
          console.log(res);
          this.register=true;
          setTimeout(this.clearPassword,1500);
        }, err => {
          console.log(err);
          this.registerf=true;
          this.message=err.body.error.message;
          setTimeout(this.clearPassword,1500)
        })

      },
      clearPassword(){
            this.Book.title = '',
              this.Book.Nocount = 0,
              this.register=false,
              this.registerf=false,
              this.message=''
      }

    },components:{
      Navbar
    },mounted(){
      this.userName=this.$store.state.Username;
        this.token=this.$store.state.token;
        this.id=this.$store.state.id;

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
.button-bar {
  display: flex;
  justify-content: right;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 1rem;
}
</style>