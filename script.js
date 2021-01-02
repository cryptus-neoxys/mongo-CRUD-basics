// * Lets get started with mongoDB

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Todo = require('./models/todo');

const app = express();

var port = process.env.PORT || 8080;

console.log('Todo required => ', Todo);
console.log('Todo from mongoose => ', mongoose.model('TodoModel'));

mongoose.connect(process.env.MONOG_URL, { useNewUrlParser: true });

app.use('/', express.static(path.resolve(__dirname, 'assets')));

app.use(bodyParser.json());

app.post('/api/create', async (req, res) => {
	const record = req.body;
	console.log(record);
	// CreateRUD (CRUD)

	const response = await Todo.create(record);
	console.log(response);

	res.json({ status: 'ok' })
});

app.get('/api/get', async (req, res) => {
	//CReadUD
	const records = await Todo.find({});
	console.log('Response => ', records);
	res.json(records);
});

app.post('/api/modify', async (req, res) => {
	//CRUpdateD
	const { old: oldTitle, new: newTitle } = req.body

	const response = await Todo.updateOne(
		{
			record: oldTitle
		},
		{
			$set: {
				record: newTitle
			}
		}
	)

	console.log(response);

	res.json({ status: 'ok' });
});

app.post('/api/delete', async (req, res) => {
	// CRUDelete
	const { record: record } = req.body;
	console.log(record, '/api/delete');

	const response = await Todo.deleteOne({ record });

	console.log(response, '/api/delete');

	res.json({ status: 'ok' });
})

app.listen(port, () => {
	console.log('server up at http://localhost:8080/');
});
