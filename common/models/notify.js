'use strict';
const email = require('../../server/email');

module.exports = function(Notify) {
  // Convert user IDs to usernames and book IDs to book titles
  Notify.afterRemote('find', function(ctx, notifications, next) {
    if (!notifications || notifications.length === 0) {
      return next();
    }

    // Use Promise.all to fetch users and books in parallel for better performance
    Promise.all([
      new Promise((resolve, reject) => {
        Notify.app.models.Users.find((err, users) => {
          if (err) return reject(err);
          resolve(users);
        });
      }),
      new Promise((resolve, reject) => {
        Notify.app.models.Book.find((err, books) => {
          if (err) return reject(err);
          resolve(books);
        });
      })
    ]).then(([users, books]) => {
      // Create lookup maps for O(1) access
      const userLookupMap = new Map();
      const bookLookupMap = new Map();
      
      users.forEach(user => {
        userLookupMap.set(user.id.toString(), user.Username);
      });
      
      books.forEach(book => {
        bookLookupMap.set(book.id.toString(), book.title);
      });

      // Efficiently map user IDs to usernames and book IDs to titles
      notifications.forEach(notification => {
        if (notification.RequestedBy) {
          notification.name = userLookupMap.get(notification.RequestedBy.toString()) || 'Unknown User';
        }
        
        const bookId = notification.Book || (notification.__data && notification.__data.Book);
        if (bookId) {
          notification.title = bookLookupMap.get(bookId.toString()) || 'Unknown Book';
        }
      });

      next();
    }).catch(err => {
      next(err);
    });
  });
  // Request a book by student or lecturer
  Notify.RequestBook = function(bookId, requestedById, bookName, username, callback) {
    if (!bookId || !requestedById) {
      return callback(new Error('Book ID and Requested By ID are required'));
    }

    Notify.app.models.Book.findOne({ where: { _id: bookId } }, function(err, book) {
      if (err) {
        return callback(err);
      }

      if (!book) {
        return callback(null, { message: 'No such book available in the database' });
      }

      if (book.Nocount <= 0) {
        return callback(null, { message: 'Book is already fully assigned' });
      }

      Notify.create({ Book: bookId, RequestedBy: requestedById }, function(err, notification) {
        if (err) {
          return callback(err);
        }

        // Send notification email
        const adminEmail = 'battuvamshi08@gmail.com';
        const subject = `Book Request by ${username}`;
        const text = `${bookName} is requested by ${username}`;
        email.sendEmail(adminEmail, subject, text);

        callback(null, notification);
      });
    });
  };
    
  Notify.remoteMethod('RequestBook', {
    accepts: [
      { arg: 'Book_id', type: 'string', required: true },
      { arg: 'RequestedBy_id', type: 'string', required: true },
      { arg: 'Bookname', type: 'string' },
      { arg: 'username', type: 'string' }
    ],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/RequestBook', verb: 'post' }
  });

  // Return a book by student or lecturer
  Notify.ReturnBook = function(bookId, requestedById, bookName, username, callback) {
    if (!bookId || !requestedById) {
      return callback(new Error('Book ID and Requested By ID are required'));
    }

    Notify.app.models.Book.findOne({ where: { _id: bookId } }, function(err, book) {
      if (err) {
        return callback(err);
      }

      if (!book) {
        return callback(null, { message: "You can't return this book" });
      }

      // Check if the user is assigned to this book
      const assignedToArray = book.AssignedTo || [];
      const userIndex = assignedToArray.findIndex(userId => userId.toString() === requestedById);

      if (userIndex === -1) {
        return callback(null, { message: "You are not assigned to this book" });
      }

      // Remove user from assigned list efficiently
      const updatedAssignedTo = assignedToArray.filter((userId, index) => index !== userIndex);
      const updatedCount = book.Nocount + 1;

      Notify.app.models.Book.updateAll(
        { title: book.title },
        { Nocount: updatedCount, AssignedTo: updatedAssignedTo },
        function(err, result) {
          if (err) {
            return callback(err);
          }

          // Send notification email
          const adminEmail = 'battuvamshi08@gmail.com';
          const subject = `Book Return by ${username}`;
          const text = `${bookName} is returned by ${username}`;
          email.sendEmail(adminEmail, subject, text);

          callback(null, { message: "Successfully returned the book" });
        }
      );
    });
  };
   
  Notify.remoteMethod('ReturnBook', {
    accepts: [
      { arg: 'Book_id', type: 'string', required: true },
      { arg: 'RequestedBy_id', type: 'string', required: true },
      { arg: 'Bookname', type: 'string' },
      { arg: 'username', type: 'string' }
    ],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/ReturnBook', verb: 'post' }
  });

  // Verify and approve book request by admin
  Notify.VerifyRequest = function(bookId, requestedById, callback) {
    if (!bookId || !requestedById) {
      return callback(new Error('Book ID and Requested By ID are required'));
    }

    Notify.app.models.Book.findOne({ where: { _id: bookId } }, function(err, book) {
      if (err) {
        return callback(err);
      }

      if (!book) {
        return callback(null, { message: 'No such book available in the database' });
      }

      if (book.Nocount <= 0) {
        // Remove the notification request since book is out of stock
        Notify.findOne({ where: { Book: bookId, RequestedBy: requestedById } }, function(err, notification) {
          if (!err && notification) {
            Notify.destroyById(notification.id, function() {});
          }
        });
        return callback(null, { message: "You can't assign this book. Out of stock" });
      }

      // Add user to assigned list
      const updatedAssignedTo = [...(book.AssignedTo || []), requestedById];
      const updatedCount = book.Nocount - 1;

      Notify.app.models.Book.updateAll(
        { title: book.title },
        { AssignedTo: updatedAssignedTo, Nocount: updatedCount },
        function(err, result) {
          if (err) {
            return callback(err);
          }

          // Remove the notification request
          Notify.findOne({ where: { Book: bookId, RequestedBy: requestedById } }, function(err, notification) {
            if (err) {
              return callback(err);
            }

            if (notification) {
              Notify.destroyById(notification.id, function(err) {
                if (err) {
                  return callback(err);
                }
              });
            }

            // Send confirmation email to user
            Notify.app.models.Users.findOne({ where: { _id: requestedById } }, function(err, user) {
              if (!err && user && user.email) {
                const subject = 'BOOK REQUEST ACCEPTED';
                const text = `${book.title} is assigned to you`;
                email.sendEmail(user.email, subject, text);
              }

              callback(null, { message: "Successfully assigned the book" });
            });
          });
        }
      );
    });
  };
   
  Notify.remoteMethod('VerifyRequest', {
    accepts: [
      { arg: 'Book_id', type: 'string', required: true },
      { arg: 'RequestedBy_id', type: 'string', required: true }
    ],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/VerifyRequest', verb: 'post' }
  });

  // Delete/reject a book request
  Notify.DeleteNote = function(bookId, requestedById, callback) {
    if (!bookId || !requestedById) {
      return callback(new Error('Book ID and Requested By ID are required'));
    }

    Notify.findOne({ where: { Book: bookId, RequestedBy: requestedById } }, function(err, notification) {
      if (err) {
        return callback(err);
      }

      if (!notification) {
        return callback(null, { message: 'No such request found' });
      }

      Notify.destroyById(notification.id, function(err) {
        if (err) {
          return callback(err);
        }

        // Get user and book details for email notification
        Promise.all([
          new Promise((resolve, reject) => {
            Notify.app.models.Users.findOne({ where: { _id: requestedById } }, function(err, user) {
              if (err) return reject(err);
              resolve(user);
            });
          }),
          new Promise((resolve, reject) => {
            Notify.app.models.Book.findOne({ where: { _id: bookId } }, function(err, book) {
              if (err) return reject(err);
              resolve(book);
            });
          })
        ]).then(([user, book]) => {
          if (user && user.email && book) {
            const subject = 'BOOK REQUEST REJECTED';
            const text = `${book.title} cannot be assigned to you right now. Please contact the admin.`;
            email.sendEmail(user.email, subject, text);
          }

          callback(null, { message: 'Request deleted successfully' });
        }).catch(err => {
          // Still return success even if email fails
          callback(null, { message: 'Request deleted successfully' });
        });
      });
    });
  };

  Notify.remoteMethod('DeleteNote', {
    accepts: [
      { arg: 'Book_id', type: 'string', required: true },
      { arg: 'RequestedBy_id', type: 'string', required: true }
    ],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/DeleteNote', verb: 'post' }
  });

  // Get pending book requests for a user
  Notify.PendingStatus = function(userId, callback) {
    if (!userId) {
      return callback(new Error('User ID is required'));
    }

    Notify.find({ where: { RequestedBy: userId } }, function(err, requests) {
      if (err) {
        return callback(err);
      }

      // Filter is redundant since we're already querying by RequestedBy
      // But keeping for safety in case of data inconsistencies
      const filteredRequests = requests.filter(request => 
        request.RequestedBy && request.RequestedBy.toString() === userId
      );

      callback(null, filteredRequests);
    });
  };

  Notify.remoteMethod('PendingStatus', {
    accepts: [{ arg: 'id', type: 'string', required: true }],
    returns: { arg: 'user', type: 'object' },
    http: { path: '/PendingStatus', verb: 'post' }
  });
};
