'use strict';
const email1 = require('../../server/email');
module.exports = function(User) {
    // To create a remote hook for checking unqiue username ,RollNo
    User.beforeRemote('create', function(ctx, data, next) {
        console.log("before create");
        //console.log(ctx.req.body);
      const myUsername = ctx.req.body.Username;
      const myRollNo = ctx.req.body.RollNo;
      console.log(myUsername+" "+myRollNo);
      User.findOne({ where: {Username: myUsername } }, function(err, result) {
        if (err){
            console.log("err 1");
            return  next(err);
        } 
        //next(err);
        if (result) {
          const error = new Error(` This Username:'${myUsername}' already exists in the DB`);
          error.statusCode = 422;
          console.log("inside 1");
          return next(error);
        }
      });
      User.findOne({ where: { RollNo: myRollNo } }, function(err, result) {
        if (err) return next(err);
        if (result) {
          const error = new Error(` This RollNo: '${myRollNo}' already exists in the DB`);
          error.statusCode = 422;
          console.log("inside 2");
          return next(error);
        }
        //next();
      });
      next();
    });

    // TO Map with Role after create user 
    User.afterRemote('create', function(context,data,next) {
        console.log(data);
        //console.log("name :"+context.result.__data.Role);
             const userID=data.id;
                User.app.models.Role.findOne({where:{name:data.Role}},function(err,role){
                    if(err) throw err;
                    console.log(role);
                    if(role!=null&&role.__data!=null){
                        User.app.models.RoleMapping.create({
                            principalType:User.app.models.RoleMapping.USER,
                            principalId : userID,
                            roleId:role.__data.id
                            },function(err,result){
                            if(err) throw err;
                            console.log(result);
                        });    
                    }
                })
                next();
            });



    User.DeleteUser=function(Username,id,cb){
        //console.log(Book);
        User.findOne({where:{Username:Username}},function(err,data){
            if(err) {
                cb(err);
            }
            else if(data!=null){
                User.app.models.Book.find({where:{AssignedTo:{inq:[id]}}},function(err,role){
                    if(err) throw err;
                    console.log(role);
                    if(role.length==0){
                        console.log(data);
                        let id1=data.__data.id;
                        User.destroyById(id1,function(err){
                         if(err){
                             console.log(err);
                         }
                         })
                         User.app.models.Notify.find({Where:{RequestedBy:id}}, function (err, docs){
                            if(err){
                                console.log("3");
                                throw err;
                            }else{
                                console.log(",.....dtata.....")
                                console.log(docs)
                                let array=[];
                                docs.forEach((sample)=>{
                                  if(sample.RequestedBy.toString() == id){
                                    User.app.models.Notify.destroyById(sample.id,function(err) {
                                    if (err){
                                        console.log(err);
                                    }
                                    });
                                  }
                                })
                            }
                        });
                         User.app.models.RoleMapping.findOne({where:{principalId:id1}},function(err,res){
                             if(err){
                                 console.log(err);
                             }
                             let id2=res.id;
                             console.log(res);
                             User.app.models.RoleMapping.destroyById(id2,function(err){
                                 if(err){
                                     console.log(err);
                                 }
                             });
                         });
                        
                        cb(err,{"message":"Successfully deleted"});
                 
                    }else{
                        cb(err,{"message":"You can't delete The User."});
                    }
                })
            }else{
                console.log(data);
                return  cb(err,{"message":"No such User Avaialble in the DB"});
            }
        })

       }
    
       User.remoteMethod('DeleteUser',
      {
        accepts:[{arg:'Username',type:'string',required: true },{arg:'id',type:'string',required: true }],
        returns:{arg:'user',type:'object'},
        http:{path:'/DeleteUser',verb:'post'}
      });



      //forget password

      User.forgetPassword=function(email,cb){
        console.log(email);
        User.findOne({where:{email:email}},function(err,data){
            if(err) {
                cb(err);
            }
            else if(data!=null){
                    const to = email;
                    const subject = 'Password Reset';
                    const text = `Click the link  http://localhost:8080/reset?id=${data.id}` ;
                    email1.sendEmail(to, subject, text);
                    return cb(err,{"message":"Link sent to your mail"});
            }else{
              console.log(data);
                return  cb(err,{"message":"No such User Avaialble in the DB"});
            }
        })
  
       }
  
  
      User.remoteMethod('forgetPassword',
      {
        accepts:[{arg:'email',type:'string',required: true }],
        returns:{arg:'user',type:'object'},
        http:{path:'/forgetPassword',verb:'post'}
      });


      //reset password
      User.resetPassword=function(id,password,cb){
       // console.log(email);
        User.findById(id,function(err,data){
            if(err){
                console.log(err);
            }
            data.updateAttribute('password',password,function(err,result){
                if(err){
                    console.log(err);
                }
                console.log(result);
            })
        return cb(err,{"message":"Successfully Reset"});
        })
  
       }
  
  
      User.remoteMethod('resetPassword',
      {
        accepts:[{arg:'id',type:'string',required: true },{arg:'password',type:'string',required: true }],
        returns:{arg:'user',type:'object'},
        http:{path:'/resetPassword',verb:'post'}
      });


    };


       




