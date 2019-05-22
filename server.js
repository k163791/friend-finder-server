const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const cors = require('cors');

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
	console.log(res.json());
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

app.post('/getevents',(req,res) => {
	db.select('event','id').from('events')
	.where('user_id','=',req.body.user_id)
	.then(events => {
		res.json(events)
	}).catch(err => res.status(400).json('Something Went Wrong'))
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

app.listen(3001, ()=> {
	console.log('app is running on port 3001');
});