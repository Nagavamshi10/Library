'use strict';

module.exports = function(User) {
    // To create a remote hook for checking unqiue username ,RollNo
    User.beforeRemote('create', function(ctx, data, next) {
        console.log(ctx.req.body);
      const myUsername = ctx.req.body.Username;
      const myRollNo = ctx.req.body.RollNo;
      User.findOne({ where: {Username: myUsername } }, function(err, result) {
        if (err) return next(err);
        if (result) {
          const error = new Error(` This Username:'${myUsername}' already exists in the DB`);
          error.statusCode = 422;
          console.log("inside 1");
          return next(error);
        }
        next();
      });
      User.findOne({ where: { RollNo: myRollNo } }, function(err, result) {
        if (err) return next(err);
        if (result) {
          const error = new Error(` This RollNo: '${myRollNo}' already exists in the DB`);
          error.statusCode = 422;
          console.log("inside 2");
          return next(error);
        }
        next();
      });
    });

    // TO Map with Role after create user 
    User.afterRemote('create', function(context,data,next) {
        console.log(data);
        //console.log("name :"+context.result.__data.Role);
             const userID=data.__data.id;
                User.app.models.Role.findOne({where:{name:data.__data.Role}},function(err,role){
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



    User.DeleteUser=function(Username,RollNo,cb){
        //console.log(Book);
        User.findOne({where:{Username:Username,RollNo:RollNo}},function(err,data){
            if(err) {
                cb(err);
            }
            else if(data!=null){
                User.app.models.Book.find({where:{AssignedTo:{inq:['vamshi']}}},function(err,role){
                    if(err) throw err;
                    console.log(role);
                    if(role.length==0){
                        console.log(data);
                        let id=data.__data.id;
                        User.destroyById(id,function(err){
                         if(err){
                             console.log(err);
                         }
                         })
                         User.app.models.RoleMapping.findOne({where:{principalId:id}},function(err,res){
                             if(err){
                                 console.log(err);
                             }
                             let id1=res.__data.id;
                             console.log(res);
                             User.app.models.RoleMapping.destroyById(id1,function(err){
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
                return  cb(err,{"message":"No such User Avaialble in the DB"});
            }
        })

       }
    
       User.remoteMethod('DeleteUser',
      {
        accepts:[{arg:'Username',type:'string',required: true },{arg:'RollNo',type:'string',required: true }],
        returns:{arg:'user',type:'object'},
        http:{path:'/DeleteUser',verb:'post'}
      });

        };


       




