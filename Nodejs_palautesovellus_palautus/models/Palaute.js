var db = require('../lib/dbconn'); //reference of dbconnection.js 

var Palaute = { 
    getAllPalaute: function(callback) { 
    return db.query("select * from palaute", callback); 
  }, 
  getPalauteById: function(id, callback) { 
    return db.query("select * from palaute where id=?", [id], callback); 
  }, 
  addPalaute: function(Palaute, callback) { 
  return db.query("insert into palaute (sisalto) values(?)", [Palaute.sisalto], callback); 
},
  deletePalaute: function(id, callback) { 
    return db.query("delete from palaute where id=?", [id], callback); 
  }, 
  /*updateTask: function(id, Task, callback) { 
    return db.query("update task set title=?,status=? where id=?", [Task.title, Task.status, id], callback); 
  } */
}; 
module.exports = Palaute;