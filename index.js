const bodyParser = require('body-parser');
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;


const port = 5000;
const app = express()
app.use(bodyParser.json())
app.use(cors())
//database related code
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.1znel.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const serviceCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION}`);
  const checkoutCollection = client.db(`${process.env.DB_NAME}`).collection("checkout");
  const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("review");
  const adminCollection = client.db(`${process.env.DB_NAME}`).collection("admin");
  //start writing code here...
  app.post('/add-service', (req, res) => {
    const data = req.body;
    serviceCollection.insertOne(data)
      .then(result => console.log(result.insertedCount > 0))
  });
  app.get('/all-services', (req, res) => {
    serviceCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });
  app.get('/service/:id', (req, res) => {
    serviceCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0])
      })
  })
  app.delete('/delete/:id', (req, res) => {
    serviceCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => console.log(result.deletedCount > 0))
  });
  //checkout
  app.post('/checkout', (req, res) => {
    const data = req.body;
    checkoutCollection.insertOne(data)
      .then(result => console.log(result.insertedCount > 0))
  });
  app.get('/checkout/:userInfo', (req, res) => {
    checkoutCollection.find({ email: req.params.userInfo })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })
  app.get('/checkout', (req, res) => {
    checkoutCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });
  app.patch('/update/:id', (req, res) => {
    checkoutCollection.updateOne({ _id: ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    )
      .then(result => console.log(result.modifiedCount > 0))
  });
  //review
  app.post('/add-review', (req, res) => {
    const data = req.body;
    reviewCollection.insertOne(data)
      .then(result => console.log(result.insertedCount > 0))
  });
  app.get('/all-review', (req, res) => {
    reviewCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  });
  //admin
  app.post('/add-admin', (req, res) => {
    const data = req.body;
    adminCollection.insertOne(data)
      .then(result => console.log(result.insertedCount > 0))
  });
  app.get('/admin/:email', (req, res) => {
    adminCollection.find({ adminEmail: req.params.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  });
});
//testing code
app.get('/', (req, res) => {
  res.send('server is working...')
});

app.listen(process.env.PORT || port);