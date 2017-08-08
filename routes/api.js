var express = require('express');
var router = express.Router({ caseSensitive: true});
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Poll = require('../models/polls');
var dataToJson = '';



//poll page



//test populate



router.put('/update', function(req,res) {
var param =  req.body;
console.log("diverted to update route");


console.log(param)


    
    
    console.log(param.options[0].votes)

       var conditions = {name: param.name};

    Poll.update(conditions, param)
     .then(doc => {
        
        if (!doc){return res.status(404).end();}
        console.log("model updated");
        console.log(param);
        
        dataToJson = param;
       
       
      
        
        return res.status(200).json(doc);
    })
    .catch(err => next(err));
    
   })
router.get('/update', function(req,res) {
    if(req) {
        let dataToReturn = dataToJson;
        return res.status(200).send(dataToReturn);
        
    }
   
    res.end();
});


//get all polls

router.get('/polls', function(req,res) {
    
    Poll.find({}, function(err, polls) {
        if(err) {
            return res.status(400).send(err);
        }
        if(polls.length < 1) {
            return res.status(400).send('No Polls Posted Yet.');
        }
       
           // console.log(polls[0]);
        
        
        return res.status(200).send(polls);
       
    })
})


//update poll


//Create a poll


router.post('/polls', authenticate, function(req, res) {
    
    console.log(req.body);
   if (!req.body.options || !req.body.name) {
       return res.status(400).send('No poll data supplied');
   }
     var poll = new Poll();
    poll.name = req.body.name;
    poll.options = req.body.options;
    poll.user = req.body.id;
    
   
 
   
    poll.save(function(err, document) {
       
        if(err) {
            return res.status(400).send(err);
          
        } else {
         
        return res.status(201).send({
         message: "Successfully created a poll",
            data: document
           
        })
        }
    })
  
})





//verification route

router.post('/verify', function(req,res){
   if (!req.body.token) {
       return res.status(400).send('Token not provided');
   }
    jwt.verify(req.body.token, process.env.secret, function(err, decoded) {
        if(err) {
            return res.status(400).send('Token Error');
        }
        return res.status(200).send(decoded);
    })
})

//login post request

router.post('/login', function(req,res) {
    if(req.body.name && req.body.password) {
        User.findOne({ name: req.body.name }, function(err, user) {
            if(err){
                return res.status(400).send('An error has occured. Please try again.');
            }
            else if (!user){
                return res.status(404).send('No user registered with these credentials');
            }
            else if (bcrypt.compareSync(req.body.password, user.password)){
               var token = jwt.sign({
                   data: user
               }, process.env.secret, { expiresIn: 3600 })
                  return res.status(200).send(token);
            }
            return res.status(400).send('Password is invalid');
        })
    }
    else {
        return res.status(400).send('Please enter valid credentials!!');
    }
})





//register post request

router.post('/register', function (req, res) {
    if(req.body.name && req.body.password) {
        var user = new User();
        user.name = req.body.name;
        console.time('bcryptHashing');
        user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
        console.timeEnd('bcryptHashing');
        user.save(function(err, document) {
            if(err){return res.status(400).send(err)}
            else{
                var token = jwt.sign({
                    data: document
                }, process.env.secret, { expiresIn: 3600 })
                return res.status(201).send(token);
            }
        })
    }
    else {
        return res.status(400).send({
            message: 'Invalid credentials'
        });
    }
})

//Authentication

function authenticate(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(400).send('No Token Supplied') 
            
        }
        if (req.headers.authorization.split(' ')[1]) {
            var token = req.headers.authorization.split(' ')[1]
            jwt.verify(token, process.env.secret, function(err, decoded) {
                if(err) {
                    return res.status(400).send(err)
                }
                console.log('Continuing with chain');
                next();
            })
        }
    
}




module.exports = router;