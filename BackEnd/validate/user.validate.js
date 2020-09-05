module.exports.postCreate = function(req,res,next){
    var errors = [];
    if (!req.body.userName) {
        errors.push('Name is required.');
      }
    
      if (!req.body.password) {
        errors.push('Password is required');
      }
      if (!req.body.email) {
        errors.push('email is required');
      }
      if (errors.length) {
        res.render('users/dangki', {
          errors: errors,
          values: req.body
        });
        return;
      }
    
      res.locals.success = true;
    
      next();
};
module.exports.postPhone = function(req,res,next){
  var errors = [];
  
  if (!req.body.userName) {
      errors.push('Name is required.');
    }
  
    if (!req.body.password) {
      errors.push('Password is required');
    }
    if (!req.body.email) {
      errors.push('email is required');
    }
    if (errors.length) {
      res.render('users/dangki', {
        errors: errors,
        values: req.body
      });
      return;
    }
  
    res.locals.success = true;
  
    next();
};