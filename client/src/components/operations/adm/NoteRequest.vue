<template>
   <div>
    <Navbar></Navbar>
      <div class="row justify-content-center">
  <table class="table table-striped" style="width:70%">
    <thead class="thead-dark">
      <tr>
        <th >S.No.</th>
        <th>Book</th>
        <th >RequestBy</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(book,index) in Note" v-bind:key="book._id">
       <th scope="row" >{{index+1}}</th>
        <td>{{book.title}}</td>
        <td>{{book.name}}</td>
        <td>
      <button class="btn btn-success" @click.prevent="toAccept(index)">Accept</button>
      </td>
      <td>
      <button class="btn btn-warning" @click.prevent="toReject(index)">Reject</button>
      </td>
      </tr>
    </tbody>
  </table>
  </div>
  </div>
</template>
    
    
    <script>
    import Navbar from '../../Navbar/Navbar.vue'
    export default{
      data()
      {
          return {
              Note: [
                {"title":"empty"}
              ],
              token:'',
              id:'',
              userName:''

          }
      },
    methods:{
        
          getNotification(){
            //const token=localStorage.getItem('token');
            this.$http.get(`http://localhost:3000/api/Notifies`)
                  .then(res => {
                    this.Note=res.body;
                    console.log(this.Books);

                  }).catch(err=>{
                    console.log(err);
                  });
          },
          toAccept(i){
            console.log("test1")
            let Book_id=this.Note[i].Book;
            let RequestedBy_id=this.Note[i].RequestedBy;
            let body={Book_id,RequestedBy_id};
            console.log(body);
            console.log("test1")
            //const token=localStorage.getItem('token');
            this.$http.post(`http://localhost:3000/api/Notifies/VerifyRequest`,body).then(res=>{
              console.log(res);
              this.getNotification();
            }).catch(err=>{
              console.log(err);
            })

          },
          toReject(i){
            console.log(this.Note);
            //http://localhost:3000/api/Notifies/DeleteNote?
            let Book_id=this.Note[i].Book;
            let RequestedBy_id=this.Note[i].RequestedBy;
            let body={Book_id,RequestedBy_id};
            console.log(body);
            //const token=localStorage.getItem('token');
            this.$http.post(`http://localhost:3000/api/Notifies/DeleteNote`,body).then(res=>{
              console.log(res);
              this.getNotification();
            }).catch(err=>{
              console.log(err);
            })
          }
         
      },
      created() {
    this.getNotification();
  },
  watch(){
    this.getNotification();
  },
  updated(){
        setTimeout(() => {
          this.getNotification();
        }, 15000);
        
      },
  components:{
      Navbar
    },mounted(){
      this.userName=this.$store.state.Username;
        this.token=this.$store.state.token;
        this.id=this.$store.state.id;
    }
  }
    
    </script>

    
    <style>
    
    
    </style>