'use strict';

module.exports = function(Book) {
  // Check for duplicate records before creating a book
  Book.beforeRemote('create', function(ctx, data, next) {
    const bookTitle = ctx.req.body.title;
    
    if (!bookTitle) {
      const error = new Error('Book title is required');
      error.statusCode = 400;
      return next(error);
    }

    Book.findOne({ where: { title: bookTitle } }, function(err, existingBook) {
      if (err) return next(err);
      
      if (existingBook) {
        const error = new Error(`Book '${bookTitle}' already exists in the database`);
        error.statusCode = 422;
        return next(error);
      }
      
      next();
    });
  });

  // Convert user IDs to usernames in the response
  Book.afterRemote('find', function(ctx, books, next) {
    if (!books || books.length === 0) {
      return next();
    }

    Book.app.models.Users.find(function(err, users) {
      if (err) {
        return next(err);
      }

      // Create a lookup map for O(1) user ID to username conversion
      const userLookupMap = new Map();
      users.forEach(user => {
        userLookupMap.set(user.id.toString(), user.Username);
      });

      // Convert user IDs to usernames
      books.forEach(book => {
        if (book.AssignedTo && Array.isArray(book.AssignedTo)) {
          book.AssignedTo = book.AssignedTo.map(userId => {
            return userLookupMap.get(userId.toString()) || userId;
          });
        }
      });

      next();
    });
  });

  // Delete a book by title
  Book.deleteBook = function(title, callback) {
    if (!title) {
      return callback(new Error('Book title is required'));
    }

    Book.findOne({ where: { title: title } }, function(err, book) {
      if (err) {
        return callback(err);
      }

      if (!book) {
        return callback(null, 'No such book found');
      }

      Book.destroyById(book.id, function(err) {
        if (err) {
          return callback(err);
        }
        callback(null, `Book '${title}' deleted successfully`);
      });
    });
  };

  Book.remoteMethod('deleteBook', {
    accepts: { arg: 'title', type: 'string', required: true },
    returns: { arg: 'Message', type: 'string' },
    http: { path: '/deleteBook', verb: 'post' }
  });

  // Get book count statistics
  Book.CountBook = function(callback) {
    Book.find({}, function(err, books) {
      if (err) {
        return callback(err);
      }

      const stats = books.reduce((acc, book) => {
        acc.availableCount += book.Nocount || 0;
        acc.assignedCount += (book.AssignedTo && book.AssignedTo.length) || 0;
        return acc;
      }, {
        availableCount: 0,
        assignedCount: 0,
        totalBooks: books.length
      });

      callback(null, stats);
    });
  };

  Book.remoteMethod('CountBook', {
    returns: { arg: 'Message', type: 'object' },
    http: { path: '/CountBook', verb: 'get' }
  });
};
