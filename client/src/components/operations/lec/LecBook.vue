<template>
  <div>
    <Navbar></Navbar>
    <div class="row justify-content-center">
<table class="table table-hover" style="width:70%">
  <thead>
    <tr>
      <th >S.No.</th>
      <th>Name</th>
      <th>Total Copies</th>
      <th >Available Copies</th>
      <th>AssignedTo</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(book,index) in Books" v-bind:key="book._id">
     <th scope="row" >{{index+1}}</th>
      <td>{{book.title}}</td>
      <td>{{book.Nocount+book.AssignedTo.length}}</td>
      <td>{{book.Nocount}}</td>
      <td>{{book.AssignedTo.join()}}</td>

        <td v-if="book.AssignedTo.includes(userName)">
        <button class="btn btn-outline-success" @click.prevent="setBookReturn(index)">Return</button>
        </td>
        <div v-else>
          <td v-if="book.Nocount!=0&&status">
          <button class="btn btn-outline-success" @click.prevent="setBookRequest(index)">Request</button>
          </td>
          <td v-else>
          <button class="btn btn-outline-success">Waiting</button>
          </td>
        </div>
    </tr>
  </tbody>
</table>
</div>
</div>
</template>
    
    
    <script>
    import Navbar from '../../Navbar/LectureNav.vue';
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
                // {"title":"empty"}
              ]
          }
      },
    methods:{
        
          getBook(){
            //const token=localStorage.getItem('token');
            //console.log(token);
            this.userName=localStorage.getItem('Username');
            this.$http.get(`http://localhost:3000/api/Books`).then(res => {
                    this.Books=res.body;
                    console.log(this.Books);

                  }).catch(err=>{
                    console.log(err);
                  });
          },
          setBookRequest(i){
            console.log(i);
            // const token=localStorage.getItem('token');
            let Book=this.Books[i].title;
            let RequestedBy=this.userName;
            let body={Book,RequestedBy};
            console.log(body);
            //const token=localStorage.getItem('token');
            this.$http.post(`http://localhost:3000/api/Notifies/RequestBook`,body).then(res=>{
              console.log(res);
              this.status=false;
            }).catch(err=>{
              console.log(err);
            })
          },
          setBookReturn(i){
            //console.log(i);
            let Book=this.Books[i].title;
            let RequestedBy=this.userName;
            let body={Book,RequestedBy};
            console.log(body);
            //const token=localStorage.getItem('token');
            this.$http.post(`http://localhost:3000/api/Notifies/ReturnBook`,body).then(res=>{
              console.log(res);
            }).catch(err=>{
              console.log(err);
            })
          }
         
      },
      mounted() {
        this.userName=this.$store.state.Username;
        this.token=this.$store.state.token;
        this.id=this.$store.state.id;
        this.getBook();
        // const token=localStorage.getItem('token');
        // const source = new EventSource(`http://localhost:3000/api/Books/updates?access_token=${token}`);
        //   source.onmessage = (event) => {
        //   const update = JSON.parse(event.data);
        //   console.log("update data");
        //   console.log(update);
        //   //this.updates.push(update);
        // };
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