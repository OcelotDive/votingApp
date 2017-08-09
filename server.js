//create a db connection string

var db = 'mongodb://localhost/votingapp';

//create port

var port = process.env.port || 443;

//load router

var api = require('./routes/api');
//modules


var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var dotenv = require('dotenv');

//enviro variables

//create express app

var app = express();
dotenv.config({
    verbose: true
});


//connect to mongodb


mongoose.connect(process.env.MONGOLAB_URI(err) {
    if (err) {
        console.log(err)
    };

});

mongoose.connection.on('connected', function () {
    console.log('Successfully opened a connection to ' + db);
});

mongoose.connection.on('disconnected', function () {
    console.log('Successfully disconnected from ' + db);
});

mongoose.connection.on('error', function () {
    console.log('An error has occured attempting to connect to ' + db);
});

//express middleware
app.use(morgan('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extend: false
}));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/public'));
app.use('/api', api);
app.get('*', function (request, resp) {
    resp.sendFile(__dirname + '/public/index.html');
});


//server start

app.listen(port, function () {
    console.log('Server started on port ' + port);
})
console.log(process.env.secret);
