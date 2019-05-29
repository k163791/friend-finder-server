const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');
const larvitsmpp = require('larvitsmpp');
const LUtils = require('larvitutils');
const lUtils = new LUtils();
const log    = new lUtils.Log('debug');
const nodemailer = require('nodemailer');
// const SMS = require('sms-node');

const db = knex({
	client : 'pg',
	connection : {
		host : '127.0.0.1',
		user : 'uzair',
		password : 'khuljasimsim',
		database : 'friend-finder'
	}
})

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res)=>{
	res.send('Friend Finder App Server ... Made By Uzair,Alishan,Ahsun,Muzammil')

})



app.post('/sendMessage',(req,res)=> {
	larvitsmpp.client({
    'host':     '127.0.0.1',
    'port':     3001,
    'username': 'foo',
    'password': 'bar',
    'log':      log
}, function(err, clientSession) {
    if (err) {
        throw err;
    }
 
    clientSession.sendSms({
        'from':    '46701113311',
        'to':      '46709771337',
        'message': '«baff»',
        'dlr':     true
    }, function(err, smsId, retPduObj) {
        if (err) {
            throw err;
        }
 
        console.log('Return PDU object:');
        console.log(retPduObj);
    });

    clientSession.on('dlr', function(dlr, dlrPduObj) {
        console.log('DLR received:');
        console.log(dlr);
 
        console.log('DLR PDU object:');
        console.log(dlrPduObj);
 
        // Gracefully close connection
        clientSession.unbind();
    });
});
})



app.post('/sendMail',(req,res) => {
	const output =`
	<h3>Invitation To Friend-Finder App</h3>
	<p>Click on the link below to register and start finding new friends</p>
	<a href='http://3.86.164.44'>Click Here...</a>
	`;
	let transporter = nodemailer.createTransport({
    service : "gmail",
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: 'uzairhuxxain123@gmail.com', 
      pass: 'familyfriends' 
    }, tls : {
  	rejectUnauthorized : false
  }

  	});

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Friend Finder App👻" <uzairhuxxain123@gmail.com>', // sender address
    to: req.body.email, // list of receivers
    subject: "Hello from Friend-Finder", // Subject line
    text: "Friend Finder Invitation", // plain text body
    html: output // html body
  });

  console.log("Message sent using SMTP Protocol ");
  console.log("Preview URL: ", nodemailer.getTestMessageUrl(info));
})


app.post('/register',(req,res) => {
	const { name, email, phone_no, password } = req.body;
	db('users')
	.returning('*')
	.insert({
		name : name,
		email : email,
		phone_no : phone_no,
		password : password,
		createdat : new Date()
	}).then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).res.json(`Couldn't Register`))
})

app.post('/login',(req,res) => {
	db.select('email','password').from('users')
		.where('email','=', req.body.email)
		.then(user => {
			if(user[0].password === req.body.password)
			return res.json(user[0])
			else
			return res.json(`Couldn't Signin`);
		})
		.catch(err => res.status(400).json(`Couldn't Signin`));	
})

app.post('/retrieveID',(req,res) => {
	db.select('id').from('users')
	.where('email','=',req.body.email)
	.then(id => {
		res.json(id[0])
	}).catch(err => res.status(400).json('Something Went Wrong'))
})

app.post('/getProfile',(req,res) => {
	db.select('*').from('users').where('id','=',req.body.id)
	.then(result => {
		res.json(result[0]);
	})
	.catch(err => res.status(400).res.json(`Someting Went Wrong : `,err));
})


app.post('/updateProfile',(req,res) => {
	db('users')
	.where('id','=',req.body.id)
	.update({
		email : req.body.email,
		phone_no : req.body.phone_no,
		password : req.body.password,
		name : req.body.name,
		image : req.body.image
	}).then(updatedProfile => {
		res.json(`Success`)
	}).catch(err => res.status(400).res.json(`Error : `,err))
})

app.post('/addSkill',(req,res) => {
	db('skills')
	.returning('*')
	.insert({
		user_id : req.body.user_id,
		skill : req.body.skill
	}).then(result => res.json(`Success`))
	.catch(err => res.status(400).res.json(`Error`))
})


app.post('/addFriend',(req,res) => {
	db('friends')
	.insert({
		user_id : req.body.user_id,
		friend : req.body.friend
	}).then(result => res.json(`Success`))
	.catch(err => res.status(400).res.json(`Error : `,err))
})

app.post('/setLocation',(req,res) => {
	db('location')
	.returning('*')
	.where('user_id','=',req.body.user_id)
	.update({
		latitude : req.body.latitude,
		longitude : req.body.longitude
	}).then(newData => {
		return res.json('Success');
	}).catch(err => res.status(400).json(`Something Went Wrong`));
})


app.post('/getevents',(req,res) => {
	db.select('event','id').from('events')
	.where('user_id','=',req.body.user_id)
	.then(events => {
		res.json(events)
	}).catch(err => res.status(400).json('Something Went Wrong'))
})

app.post('/getusers',(req,res) => {
	db.select('*').from('users')
	.where('id','!=',req.body.user_id)
	.then(users => {
		res.json(users);
	}).catch(err=> res.status(400).json(`Couldn't Get Users`));
})


app.post('/getFriends',(req,res) => {
	var j=0;
	var result2 = [];
	db.select('friend').from('friends').where('user_id','=',req.body.user_id)
	.then(result => {
		for(i=0;i<result.length;i++) {
			db.select('*').from('users').where('id','=',result[i].friend)
			.then(rest => {
				j = j + 1;
				result2.push(rest[0]);
				if(j === result.length) {
					res.json(result2);
				}
			}).catch(err => res.status(400).json(`Something Went Wrong`));
		}
	})
})

app.post('/getFilteredUsers',(req,res) => {
	var result2 = [];
	var j=0;
	db.select('user_id').from('skills').where('skill','=',req.body.skill)
	.then(result => {
		for(i=0;i<result.length;i++) {
			db.select('id','email','phone_no','name','image').from('users').where('id','=',result[i].user_id)
			.then(rest => {
				j = j+1;
				result2.push(rest[0]);
				if(j===result.length) {
					res.json(result2);
				}
			}).catch(err => res.status(400).json(`Something Went Wrong`));
		}
		
	}).catch(err => res.status(400).json(`Something Went Wrong`));
})

app.post('/getSkills',(req,res)=>{
	db.select('*').from('skills')
	.where('user_id','=',req.body.user_id)
	.then(skills => {
		res.json(skills);
	}).catch(err => res.status(400).json(`Couldn't Get Skills`))
})

app.post('/event',(req,res) => {
	db('events')
	.returning('*')
	.insert({
		user_id : req.body.user_id,
		event : req.body.event,
		createdat : new Date()
	}).then(event => res.json(event[0]))
	.catch(err => res.status(400).json('Something Went Wrong'))
})

app.listen(process.env.PORT || 3001, ()=> {
	console.log('app is running on port 3001');
});