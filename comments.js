// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB database
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'blog';
const client = new MongoClient(url, { useNewUrlParser: true });
let db;

client.connect(function(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Connected successfully to server');
    db = client.db(dbName);
});

// Get all comments
app.get('/comments', function(req, res) {
    let collection = db.collection('comments');
    collection.find({}).toArray(function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(docs);
    });
});

// Get comments for a specific post
app.get('/comments/:postId', function(req, res) {
    let collection = db.collection('comments');
    collection.find({ postId: req.params.postId }).toArray(function(err, docs) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(docs);
    });
});

// Add a new comment
app.post('/comments', bodyParser.json(), function(req, res) {
    if (!req.body) {
        res.status(400).send('Bad Request');
        return;
    }
    let collection = db.collection('comments');
    collection.insertOne(req.body, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(201).json(result.ops);
    });
});

// Update a comment
app.put('/comments/:id', bodyParser.json(), function(req, res) {
    if (!req.body) {
        res.status(400).send('Bad Request');
        return;
    }
    let collection = db.collection('comments');
    collection.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { returnOriginal: false }, function(err, result) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(result.value);
    });
});

// Delete a comment
app.delete