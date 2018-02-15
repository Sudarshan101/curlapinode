var express = require('express');
var mongoose = require('mongoose');
var morgan = require('morgan');         
var mongoose = require('mongoose');
var bodyParser = require('body-parser');  
var methodOverride = require('method-override');
var app = express();

//allow cross origin requests
app.use(function(req, res, next) { 
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Max-Age", "3600");
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

// configuration
app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));               
app.use(bodyParser.json({limit: '50mb'}));                          // log every request to the console
app.use(bodyParser.urlencoded({limit: '50mb','extended':'true'}));            // parse application/x-www-form-urlencoded                                // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
mongoose.connect('mongodb://localhost/curlapi');     // connect to mongoDB database

var Schema = mongoose.Schema;

// user schema
var userSchema = new Schema({
    user_name: String,
    password: String,
    first_name: String,
    last_name: String,
    user_email:String,
    status: String,
    date: { type: Date, default: Date.now }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
app.get('/', function (req, res) {
  res.send('Hello World')
})
 

// post method pass user information in json object
app.post('/api/createUser', function(req, res) {
    User.create(req.body, function(err, user) {
            if (err){
               res.send(err);
            }
            if(user) {
               res.json(user);
            }
    });
});


// update method update user pass userid in object
app.put('/api/updateUser', function(req, res) {
    User.findByIdAndUpdate(req.body._id, req.body, {new: true}, function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user);
    });
});

// delete Methods pass user id in object 
app.delete('/api/removeUser', function(req, res) {
    User.remove({_id : req.body._id }, function(err, user) {
        if (err)
            res.send(err);
  
        res.json(user);
    });
});

// GET METHODS
app.get('/api/getUsers', function(req, res) {
    User.find(req.body,function(err, users) {
        if (err)
            res.send(err)
        res.json(users);
    });
});

app.listen(process.env.PORT || 3000, function(){console.log("App listening on port 3000");});
