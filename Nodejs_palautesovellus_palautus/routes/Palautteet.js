var express = require('express');  
var router = express.Router();  
var Palaute = require('../models/Palaute');  
router.get('/:id?', function(req, res, next) {  
if (req.params.id) {  
Task.getPalauteById(req.params.id, function(err, rows) {  
if (err) {  
res.json(err);  
} else {  
res.json(rows);  
}  
});  
} else {  
Palaute.getAllPalaute(function(err, rows) {  
if (err) {  
res.json(err);  
} else {  
res.json(rows);  
}  
});  
}  
});  
router.get('/', isAuthenticated, function(req, res, next) {

  var username   = req.session.user.username;
  var full_name  = req.session.user.full_name;
  
  res.render('Palaute', { username: username, full_name: full_name });

});

function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
  res.redirect('/signin');
}

router.post('/', function(req, res, next) {  
Palaute.addPalaute(req.body, function(err, count) {  
if (err) {  
res.json(err);  
} else {  
res.json(req.body); //or return count for 1 & 0  
}  
});  
});  

router.delete('/:id', function(req, res, next) {  
Palaute.deletePalaute(req.params.id, function(err, count) {  
if (err) {  
res.json(err);  
} else {  
res.json(count);  
}  
});  
});  

router.put('/:id', function(req, res, next) {  
Palaute.updatePalaute(req.params.id, req.body, function(err, rows) {  
if (err) {  
res.json(err);  
} else {  
res.json(rows);  
}  
});  
});  
module.exports = router;