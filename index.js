const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u9zre.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());


const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send("Retro Blog")
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const blogsCollection = client.db("retroBlog").collection("blogs");
  const adminsCollection = client.db("retroBlog").collection("admins");

  app.get('/blogs', (req, res) => {
    blogsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.get('/:id', (req, res) => {
    blogsCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.post('/addBlogs', (req, res) => {
    const newBlog = req.body;
    blogsCollection.insertOne(newBlog)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  app.post('/addAdmins', (req, res) => {
    const admin = req.body;
    adminsCollection.insertOne(admin)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

});


app.listen(port)