'use strict';
const email = require('../../server/email');

module.exports = function(User) {
  // Validate unique username and roll number before creating user
  User.beforeRemote('create', function(ctx, data, next) {
    const username = ctx.req.body.Username;
    const rollNo = ctx.req.body.RollNo;

    if (!username || !rollNo) {
      const error = new Error('Username and Roll Number are required');
      error.statusCode = 400;
      return next(error);
    }

    // Use Promise.all to ensure both validations complete before proceeding
    Promise.all([
      new Promise((resolve, reject) => {
        User.findOne({ where: { Username: username } }, function(err, existingUser) {
          if (err) return reject(err);
          if (existingUser) {
            const error = new Error(`Username '${username}' already exists in the database`);
            error.statusCode = 422;
            return reject(error);
          }
          resolve();
        });
      }),
      new Promise((resolve, reject) => {
        User.findOne({ where: { RollNo: rollNo } }, function(err, existingUser) {
          if (err) return reject(err);
          if (existingUser) {
            const error = new Error(`Roll Number '${rollNo}' already exists in the database`);
            error.statusCode = 422;
            return reject(error);
          }
          resolve();
        });
      })
    ]).then(() => {
      next();
    }).catch(err => {
      next(err);
    });
  });

  // Map user to role after user creation
  User.afterRemote('create', function(context, userData, next) {
    if (!userData || !userData.Role) {
      return next();
    }

    const userId = userData.id;
    
    User.app.models.Role.findOne({ where: { name: userData.Role } }, function(err, role) {
      if (err) {
        return next(err);
      }

      if (!role) {
        return next();
      }

      User.app.models.RoleMapping.create({
        principalType: User.app.models.RoleMapping.USER,
        principalId: userId,
        roleId: role.id
      }, function(err, roleMapping) {
        if (err) {
          return next(err);
        }
        next();
      });
    });
  });



  // Delete user and clean up associated data
  User.DeleteUser = function(username, userId, callback) {
    if (!username || !userId) {
      return callback(new Error('Username and User ID are required'));
    }

    User.findOne({ where: { Username: username } }, function(err, user) {
      if (err) {
        return callback(err);
      }

      if (!user) {
        return callback(null, { message: 'No such user available in the database' });
      }

      // Check if user has any assigned books
      User.app.models.Book.find({ where: { AssignedTo: { inq: [userId] } } }, function(err, assignedBooks) {
        if (err) {
          return callback(err);
        }

        if (assignedBooks.length > 0) {
          return callback(null, { message: "You can't delete the user. User has assigned books." });
        }

        // Proceed with deletion - use Promise.all for parallel cleanup
        const userIdToDelete = user.id;

        Promise.all([
          // Delete user notifications
          new Promise((resolve, reject) => {
            User.app.models.Notify.find({ where: { RequestedBy: userId } }, function(err, notifications) {
              if (err) return reject(err);
              
              if (notifications.length === 0) {
                return resolve();
              }

              const deletePromises = notifications.map(notification => {
                return new Promise((resolveDelete, rejectDelete) => {
                  User.app.models.Notify.destroyById(notification.id, function(err) {
                    if (err) return rejectDelete(err);
                    resolveDelete();
                  });
                });
              });

              Promise.all(deletePromises).then(resolve).catch(reject);
            });
          }),

          // Delete role mapping
          new Promise((resolve, reject) => {
            User.app.models.RoleMapping.findOne({ where: { principalId: userIdToDelete } }, function(err, roleMapping) {
              if (err) return reject(err);
              if (!roleMapping) return resolve();

              User.app.models.RoleMapping.destroyById(roleMapping.id, function(err) {
                if (err) return reject(err);
                resolve();
              });
            });
          }),

          // Delete the user
          new Promise((resolve, reject) => {
            User.destroyById(userIdToDelete, function(err) {
              if (err) return reject(err);
              resolve();
            });
          })
        ]).then(() => {
          callback(null, { message: 'Successfully deleted' });
        }).catch(err => {
          callback(err);
        });
      });
    });
  };

  User.remoteMethod('DeleteUser', {
    accepts: [
      { arg: 'Username', type: 'string', required: true },
      { arg: 'id', type: 'string', required: true }
    ],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/DeleteUser', verb: 'post' }
  });

  // Send password reset email
  User.forgetPassword = function(userEmail, callback) {
    if (!userEmail) {
      return callback(new Error('Email is required'));
    }

    User.findOne({ where: { email: userEmail } }, function(err, user) {
      if (err) {
        return callback(err);
      }

      if (!user) {
        return callback(null, { message: 'No such user available in the database' });
      }

      const subject = 'Password Reset';
      const resetLink = `http://localhost:8080/reset?id=${user.id}`;
      const text = `Click the link to reset your password: ${resetLink}`;
      
      email.sendEmail(userEmail, subject, text);
      
      callback(null, { message: 'Reset link sent to your email' });
    });
  };

  User.remoteMethod('forgetPassword', {
    accepts: [{ arg: 'email', type: 'string', required: true }],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/forgetPassword', verb: 'post' }
  });

  // Reset user password
  User.resetPassword = function(userId, newPassword, callback) {
    if (!userId || !newPassword) {
      return callback(new Error('User ID and new password are required'));
    }

    User.findById(userId, function(err, user) {
      if (err) {
        return callback(err);
      }

      if (!user) {
        return callback(new Error('User not found'));
      }

      user.updateAttribute('password', newPassword, function(err, updatedUser) {
        if (err) {
          return callback(err);
        }
        
        callback(null, { message: 'Password successfully reset' });
      });
    });
  };

  User.remoteMethod('resetPassword', {
    accepts: [
      { arg: 'id', type: 'string', required: true },
      { arg: 'password', type: 'string', required: true }
    ],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/resetPassword', verb: 'post' }
  });
};
