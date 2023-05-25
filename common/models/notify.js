'use strict';
const email = require('../../server/email');
const l = require("loopback");
const { findById } = require("loopback-datasource-juggler/lib/dao");
module.exports = function(Notify) {
    // chance bookid to book name and userid to user name 
    Notify.afterRemote('find', function(ctx, data, next) {
      Notify.app.models.Users.find((err,result)=>{
            if(err){
              console.log(err);
            }
            Notify.app.models.Book.find((err,book)=>{
              if(err){
                console.log(err);
              }
              // console.log(result);
              for(let i=0;i<data.length;i++){
                result.find(o => {
                  // console.log(o.id);
                      if(o.id.toString() === data[i].RequestedBy.toString()) {
                      // console.log(o);
                      data[i].name=o.Username;
                    }
                  })
                  book.find(o => {
                    //console.log(data[i].__data.Book);
                        if(o.id.toString() === data[i].__data.Book.toString()) {
                        // console.log(o);
                        data[i].title=o.title;
                      }
                    })
              }
                next();
              // }
              });
            

          });
        });
    // request Book by student or lecture
    Notify.RequestBook=function(Book_id,RequestedBy_id,Bookname,username,cb)
       {
        //console.log(Book);
        // findById('id', function (err,data))
        Notify.app.models.Book.findOne({where:{_id:Book_id}},function(err,data){
            if(err) {
                cb(err);
            }
            else if(data!=null){
               //console.log(data.__data.bookstatus);
                if(data.Nocount>0){
                    Notify.create({Book:Book_id,RequestedBy:RequestedBy_id},function(err,user){
                     if(err) return cb(err);
            // console.log(user);
                      const to = 'battuvamshi08@gmail.com';
                      const subject = 'BOOK Request by '+username;
                      const text = Bookname+' is requested By '+username;
                      email.sendEmail(to, subject, text);
            
                    return cb(null,user);
                    });
                }else{
                    return cb(err,{"message":"Book is Already assigned"});
                }

            }else{
                return  cb(err,{"message":"No such Book Avaialble in the DB"});
            }
        })

       }
    
       Notify.remoteMethod('RequestBook',
      {
        accepts:[{arg:'Book_id',type:'string',required: true },{arg:'RequestedBy_id',type:'string',required: true },{arg:'Bookname',type:'string' },{arg:'username',type:'string' }],
        returns:{arg:'user',type:'object'},
        http:{path:'/RequestBook',verb:'post'}
      });

      // return Book by student or lecture
      Notify.ReturnBook=function(Book_id,RequestedBy_id,Bookname,username,cb)
      {
       //console.log(Book);
       Notify.app.models.Book.findOne({where:{_id:Book_id}},function(err,data){
           if(err) {
               cb(err);
           }
           else if(data!=null){
            for(let i=0;i<data.AssignedTo.length;i++){
              if(data.AssignedTo[i].toString()===RequestedBy_id){
                let index=data.AssignedTo.indexOf(RequestedBy_id);
  
                let array=[];
                array=[...array,...data.AssignedTo];
                array.splice(index, 1);
                console.log(array);
                let count=data.__data.Nocount+1;
                Notify.app.models.Book.updateAll({title:data.__data.title}, { Nocount:count,AssignedTo:array}, function(err,result){
                    if (err) {
                      cb(err);
                    } else {
                      const to = 'battuvamshi08@gmail.com';
                      const subject = 'BOOK Return By '+username;
                      const text = Bookname+' is returned By '+username;
                      email.sendEmail(to, subject, text);
                      return cb(err,{"message":"Successfully returned the book"});
                    }
                  });
              }
            }

           }else{
            return cb(err,{"message":"You Can't return this Book"});
           }
       })

      }
   
      Notify.remoteMethod('ReturnBook',
     {
       accepts:[{arg:'Book_id',type:'string',required: true },{arg:'RequestedBy_id',type:'string',required: true },{arg:'Bookname',type:'string' },{arg:'username',type:'string' }],
       returns:{arg:'user',type:'object'},
       http:{path:'/ReturnBook',verb:'post'}
     });


     // monitor the request and return and assigning book by admin
     Notify.VerifyRequest=function(Book_id,RequestedBy_id,cb)
      {
       //console.log(Book);
       Notify.app.models.Book.findOne({where:{_id:Book_id}},function(err,data){
           if(err) {
            console.log("1");
               cb(err);
           }
           else if(data!=null){
            console.log(data);
              if(data.Nocount>0){
                //console.log(Book);
                let array=[];
                array=[...array,...data.AssignedTo]
                array.push(RequestedBy_id);
                let count=data.__data.Nocount-1;
                Notify.app.models.Book.updateAll({title:data.title}, { AssignedTo:array,Nocount:count}, function(err,result){
                    if (err) {
                        console.log("2");
                      cb(err);
                    } else {
                        Notify.findOne({Where:{Book:Book_id,RequestedBy:RequestedBy_id}}, function (err, docs){
                            if(err){
                                console.log("3");
                                throw err;
                            }else{
                                Notify.destroyById(docs.__data.id.toString(),function(err) {
                                    if (err) throw err;
                                  
                                    console.log('Model deleted successfully');
                                  });
                            }
                        });
                        Notify.app.models.Users.findOne({where:{_id:RequestedBy_id}},function(err,data1){
                          if(err){
                            console.log(err);
                          }
                          const to = data1.email;
                          const subject = 'BOOK REQUEST ACCEPTED';
                        const text = data.title+" is assigned to you" ;
                      email.sendEmail(to, subject, text);

                        })
                        
                      return cb(err,{"message":"Successfully Assigned the book"});
                    }
                  });
              }else{
                Notify.destroyById(id,function(err){
                  if(err){
                      console.log(err);
                  }
                  })
                return cb(err,{"message":"You Can't assign this Book.Out of stock"});
              }

           }else{
               return  cb(err,{"message":"No such Book Avaialble in the DB"});
           }
       });

      }
   
      Notify.remoteMethod('VerifyRequest',
     {
       accepts:[{arg:'Book_id',type:'string',required: true },{arg:'RequestedBy_id',type:'string',required: true }],
       returns:{arg:'user',type:'object'},
       http:{path:'/VerifyRequest',verb:'post'}
     });

     Notify.DeleteNote=function(Book_id,RequestedBy_id,cb)
      {
       console.log(Book_id);
       console.log(RequestedBy_id);
       Notify.findOne({Where:{Book:Book_id,RequestedBy:RequestedBy_id}}, function (err, docs){
        if(err){
            console.log("3");
            throw err;
        }else{
            Notify.destroyById(docs.id.toString(),function(err) {
                if (err) throw err;
                Notify.app.models.Users.findOne({where:{_id:RequestedBy_id}},function(err,data1){
                  if(err){
                    console.log(err);
                  }
                  Notify.app.models.Book.findOne({where:{_id:Book_id}},function(err,data2){
                    if(err){
                      console.log(err);
                    }
                    const to = data1.email;
                    const subject = 'BOOK REQUEST REJECTED';
                    const text = data2.title+" is can't be assigned to you right now . Contact the Admin" ;
                    email.sendEmail(to, subject, text);
                  })
              //     const to = data1.email;
              //     const subject = 'BOOK REQUEST ACCEPTED';
              //   const text = data.title+"is assigned to you" ;
              // email.sendEmail(to, subject, text);

                })
                console.log('Model deleted successfully');
              });
        }
    });

      }
   
      Notify.remoteMethod('DeleteNote',
     {
       accepts:[{arg:'Book_id',type:'string',required: true },{arg:'RequestedBy_id',type:'string',required: true }],
       returns:{arg:'user',type:'object'},
       http:{path:'/DeleteNote',verb:'post'}
     });
     
     Notify.PendingStatus=function(id,cb){
      //console.log('sample',id);
      Notify.find({RequestedBy:id}, function (err, docs){
        if(err){
            console.log("3");
            throw err;
        }else{
          // console.log('started');
          // console.log(docs);
          // console.log('ended');
          let array=[];
          docs.forEach((sample)=>{
            if(sample.RequestedBy.toString() == id){
              array.push(sample);
            }
          })
            return cb(err,array);
        }
    });
     }
     Notify.remoteMethod('PendingStatus',
     {
       accepts:[{arg:'id',type:'string',required: true }],
       returns:{arg:'user',type:'object'},
       http:{path:'/PendingStatus',verb:'post'}
     });

     //forget password
    

};
