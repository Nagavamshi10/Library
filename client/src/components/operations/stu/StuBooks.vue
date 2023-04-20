<template>
  <div>
    <Navbar></Navbar>
    <div class="row justify-content-center">
<table class="table table-striped" style="width:75%">
  <thead class="thead-dark">
    <tr>
      <th >S.No.</th>
      <th>Name</th>
      <th>Total Copies</th>
      <th >Available Copies</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(book,index) in Books" v-bind:key="book._id">
     <th scope="row" >{{index+1}}</th>
      <td>{{book.title}}</td>
      <td>{{book.Nocount+book.AssignedTo.length}}</td>
      <td>{{book.Nocount}}</td>

        <td v-if="book.AssignedTo.includes(userName)">
        <button class="btn btn-warning" @click.prevent="bookReturn(index)">Return</button>
        </td>
        <div v-else>
          <div v-if="Note.every(obj => obj.Book!=book.id)">
            <button class="btn btn-success" @click.prevent="bookRequest(index)">Request</button>
          </div>
          <div v-else>
            <b style="color: red; ">pending...</b>
          </div>
        </div>
    </tr>
  </tbody>
</table>
</div>
</div>
</template>
    
    
    <script>
    import Navbar from '../../Navbar/StudentNav.vue'
    export default{
      data()
      {
          return {
            status:true,
            userName:'',
            token:'',
            id:'',
            countBook:{},
              Books: [
                {"title":""}
              ],
              Note:[
                {
                  title:'',
                  name:''
                }

              ]
          }
      },
    methods:{
          getBook(){
            //const token=localStorage.getItem('token');
            // console.log("inside ");
            // console.log(this.$store.state.Username);
            // console.log("outside");
            this.$http.get(`http://localhost:3000/api/Books`).then(res => {
                    this.Books=res.body;
                    //console.log(this.Books);

                  }).catch(err=>{
                    console.log(err);
                  });
          },
          bookRequest(index){
            //console.log(index);
            // const token=localStorage.getItem('token');
           // console.log
            let Book_id=this.Books[index].id;
            let RequestedBy_id=this.id;
            let body={Book_id,RequestedBy_id};
            console.log(body);
            //const token=localStorage.getItem('token');
            this.$http.post(`http://localhost:3000/api/Notifies/RequestBook`,body).then(res=>{
              console.log(res);
              this.getNotification()
              this.status=false;
            }).catch(err=>{
              console.log(err);
            })
          },
          bookReturn(index){
            //console.log(i);
            let Book_id=this.Books[index].id;
            let RequestedBy_id=this.id;
            let body={Book_id,RequestedBy_id};
            console.log(body);
            this.$http.post(`http://localhost:3000/api/Notifies/ReturnBook`,body).then(res=>{
              console.log(res);
              this.getBook();
              this.getNotification();
            }).catch(err=>{
              console.log(err);
            })
          },
          getNotification(){
            let body={id:this.id};
            this.$http.post(`http://localhost:3000/api/Notifies/PendingStatus`,body)
                  .then(res => {
                    //console.log(res.body.user);
                    this.Note=res.body.user;
                    console.log("...");
                    console.log(this.Note);
                  }).catch(err=>{
                    console.log(err);
                  });
          }
          
         
      },
      mounted() {
        this.userName=this.$store.state.Username;
        this.token=this.$store.state.token;
        this.id=this.$store.state.id;
        this.getBook();
        this.getNotification();
        // const token=localStorage.getItem('token');
        // const source = new EventSource(`http://localhost:3000/api/Books/updates?access_token=${token}`);
        //   source.onmessage = (event) => {
        //   const update = JSON.parse(event.data);
        //   console.log("update data");
        //   console.log(update);
          //this.updates.push(update);
        //};
      },
      updated(){
        setTimeout(() => {
          this.getBook();
        }, 15000);       
      },
      components:{
        Navbar
      }
  }
    
    </script>
    
    
    
    <style>
    
    
    </style>