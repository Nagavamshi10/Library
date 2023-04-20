'use strict';

module.exports = function(Book) {
    // to check for multiple records
    Book.beforeRemote('create', function(ctx, data, next) {
        //console.log(ctx.req.body);
      const myUniquePropertyValue = ctx.req.body.title;
  
      Book.findOne({ where: { title: myUniquePropertyValue } }, function(err, result) {
        if (err) return next(err);
        if (result) {
          const error = new Error(` '${myUniquePropertyValue}' already exists in the DB`);
          error.statusCode = 422;
          return next(error);
        }
        next();
      });
    });


    // change userid to usernames
    Book.afterRemote('find', function(ctx, data, next) {
      //console.log("ctx data");
      //console.log(ctx);
      Book.app.models.Users.find((err,result)=>{
        if(err){
          console.log(err);
        }
        const array=result;
       // console.log(result);
        for(let i=0;i<data.length;i++){
          //console.log("1");
              for(let j=0;j<data[i].AssignedTo.length;j++){
                //console.log("2");
                // console.log(data[i].AssignedTo[j])
                array.find(o => {
                  //console.log(o);
                  if(o.id.toString() == data[i].AssignedTo[j]) {
                    //console.log(o.Username);
                    data[i].AssignedTo[j]=o.Username;
                  }
                });
                
              }
          }
          //console.log('final data',data[0].AssignedTo);
          next();
        //});
        //console.log('final data',data);
      });
    });

    // to delete the book
    Book.deleteBook=function(title,cb)
       {
        console.log('title',title);
        Book.findOne({where:{title: title}
        }, function(err, user) {
            if (err) throw err;
            console.log(user);
            //console.log(user.__data.id);
            if(user==null){
                return cb(null,"No such Book");
            }
            else{
            Book.destroyById(user.__data.id,cb);
            }
          });
       }
    
       Book.remoteMethod('deleteBook',
      {
        accepts:{arg:'title',type:'string',required:true},
        returns:{arg:'Message',type:'string'},
        http:{path:'/deleteBook',verb:'post'}
      });



      Book.CountBook=function(cb,err)
       {
        
        Book.find({},function(err,res){
          if(err){
            console.log(err);
            cb(err);
          }
          let avaialblecount=0;
          let assigncount=0;
          let individualbooks=res.length;
          for(let i=0;i<res.length;i++){
            avaialblecount+=res[i].Nocount;
            assigncount+=res[i].AssignedTo.length;
          }
          
          // cb(test);
         return cb(err,{avaialblecount,assigncount,individualbooks});
          //console.log(individualbooks);
        })
       }
    
       Book.remoteMethod('CountBook',
      {
        returns:{arg:'Message',type:'object'},
        http:{path:'/CountBook',verb:'get'}
      });

      // update purpose
//       User.observe('after save', function(ctx, next) {
//         // Check if this is a create operation
//         if (ctx.isNewInstance) {
//           const user = ctx.instance;
//         }
//         // Call the next function to continue
//         next();
//       });
};
