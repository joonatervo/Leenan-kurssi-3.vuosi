var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var flash             = require('connect-flash'); 
var crypto            = require('crypto'); 
var passport          = require('passport'); 
var LocalStrategy     = require('passport-local').Strategy; 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var Palautteet=require('./routes/Palautteet');

var expressValidator = require('express-validator');
var app = express();
var cors=require('cors');
var Palautteet=require('./routes/Palautteet');
var connection = require('./lib/dbconn');
var sess = require('express-session'); 
var BetterMemoryStore = require('session-memory-store')(sess); 

app.use(cors());

app.use(sess({ 
    store: new BetterMemoryStore({ 
      checkPeriod: 86400000, 
      // prune expired entries every 24h 
    }), 
    secret: 'MYSECRETISVERYSECRET', 
    resave: false, 
    saveUninitialized: false 
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(flash()); 
app.use(passport.initialize()); 
app.use(passport.session());




app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/node_modules', express.static(__dirname + '/node_modules')); 
app.use('/style', express.static(__dirname + '/style'));


passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true //passback entire req to call back
} , function (req, username, password, done){
      if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }
      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
      connection.query("select * from user where username = ?", [username], function(err, rows){
          console.log(err); console.log(rows);
        if (err) return done(req.flash('message',err));
        if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
        salt = salt+''+password;
        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        var dbPassword  = rows[0].password;
        if(!(dbPassword == encPassword)){
            return done(null, false, req.flash('message','Invalid username or password.'));
         }
         req.session.user = rows[0];
        return done(null, rows[0]);
      });
    }
));

passport.serializeUser(function(user, done){
   done(null, user.id);
});

passport.deserializeUser(function(id, done){
    connection.query("select * from user where id = "+ id, function (err, rows){
        done(err, rows[0]);
    });
});

app.get('/signin', function(req, res){ 
  res.render('login/index',{'message' :req.flash('message')}); 
});

app.post("/signin", passport.authenticate('local', {
    successRedirect: '/Palautteet', /*Muutettu 21.11.*/
    failureRedirect: '/signin',
    failureFlash: true
}), function(req, res, info){

    res.render('login/index',{'message' :req.flash('message')});

});

app.get('/logout', function(req, res) { 
    req.session.destroy(); 
    req.logout(); 
    res.redirect('/signin'); 
}) 
;


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/Palautteet',Palautteet);
app.use('/Palautteet',Palautteet);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;