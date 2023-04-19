<template>
    <div>
      <Navbar/>
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
        <td v-if="book.AssignedTo.length==0">
        <button class="btn btn-outline-success" @click.prevent="setToDeleteBook(index)">Delete</button>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td colspan="8" align="center"><router-link to="/AddBooks"><button class="btn btn-outline-primary">Add Books</button></router-link></td>
      </tr>
    </tfoot>
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
              userName:'',
              countBook:{},
              token:'',
              id:'',
                Books: [
                  // {"title":"empty"}
                ]
            }
        },
      methods:{
          
          getBooks(){
              //const token=localStorage.getItem('token');
              //console.log(token);
              //this.userName=localStorage.getItem('Username');
              this.$http.get(`http://localhost:3000/api/Books`).then(res => {
                      this.Books=res.body;
                      console.log(this.Books);
  
                    }).catch(err=>{
                      console.log(err);
                      
                    });
            },
            setToDeleteBook(index){
              console.log(index);
              //const token=localStorage.getItem('token');
              let title=this.Books[index].title
              console.log(title);
              let body={title};
              this.$http.post(`http://localhost:3000/api/Books/deleteBook`,body).then(res=>{
                console.log(res);
                this.getBooks();
              }).catch(err=>{
                console.log(err);
              })
            }
           
        },
        mounted() {
          this.userName=this.$store.state.Username;
        this.token=this.$store.state.token;
        this.id=this.$store.state.id;
      this.getBooks();
    },
    updated(){
        setTimeout(() => {
          this.getBooks();
        }, 15000);
        
      },
    components:{
      Navbar
    }
    }
      
      </script>
      
      
      
      <style>
      
      
      </style>