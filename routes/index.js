var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'aa1u6ul5pxc0jpb.c6ozj4dryzjc.us-east-2.rds.amazonaws.com',
  user     : 'HW1Admin',
  password : 'hbasdf74',
  port     : '3306',
  database : 'ebdb'
});

connection.connect(function(err){
  if(!err) {
      console.log("Database is connected ... nn");
  } else {
      console.log(err);
      console.log("Error connecting database ... nn");
  }
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome!' });
});

router.post('/loginBT', function(req, res) {
  res.render('login', { title: 'Welcome!' });
});


router.post('/signupBT', function(req, res) {
  res.render('signup', { title: '' });
});

router.post('/login', function(req, res) {
  if(req.body.Username && req.body.Password){
    let username = req.body.Username;
    let password = req.body.Password;

    connection.query("SELECT * FROM users WHERE username=\'"+username+"\' AND users.password = \'"+password+"\';", async function (error, results, fields) {
      if (error) {
        res.render('login', { title: 'Error: connection issue' });
      }else if(results[0] != null) {
        let result = JSON.parse(JSON.stringify(results[0]));
        let firstName = result.firstName;
        let lastName = result.lastName;
        let email = result.email;
        console.log(result);
        res.render('display', { title: ("Username: "+username+" | Password: "+password+" | First Name: "+firstName+" | Last Name: "+lastName+" | Email: "+email) });
      } else {
        res.render('login', { title: 'Error: erroneous username and password' });
      }
    });
  }
});

router.post('/signupCheck', function(req, res) {
  if(req.body.Username && req.body.Password && req.body.FirstName && req.body.LastName && req.body.Email){
    let username = req.body.Username;
    let password = req.body.Password;
    let firstName = req.body.FirstName;
    let lastName = req.body.LastName;
    let email = req.body.Email;


    var users={
      "username":username,
      "password":password,
      "firstName":firstName,
      "lastName":lastName,
      "email":email
    }

    connection.query('SELECT userName FROM users WHERE username = \''+username+'\'', function (error, results, fields) {
      console.log(results);
        console.log(results.size);
        console.log(fields);
      if (error) {
        console.log(error);
       res.render('signup', { title: 'Error: connection issue' });
      } else if(results[0] != null) {
        res.render('signup', { title: 'Error: User exists with that name' });
     } else {
      connection.query('INSERT INTO users (username, password, firstName, lastName, email) VALUES (\''+username+'\',\''+password+'\',\''+firstName+'\',\''+lastName+'\',\''+email+'\')', function (error, results, fields) {
        if (error) {
          res.render('signup', { title: 'Error: connection issue' });
        } else {
         res.render('display', { title: ("Username: "+username+" | Password: "+password+" | First Name: "+firstName+" | Last Name: "+lastName+" | Email: "+email) });
       }
       });
     }
     });
  

   
  }
});

module.exports = router;