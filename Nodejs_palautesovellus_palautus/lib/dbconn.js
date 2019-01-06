var mysql        = require('mysql'); 

var connection   = mysql.createConnection({ 
  supportBigNumbers: true, 
  bigNumberStrings: true, 
  host     : "magnesium", 
  user     : "16bjereb", 
  password : "salasana", 
  database : "db16bjereb" 
}); 

module.exports = connection;