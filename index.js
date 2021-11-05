const express = require('express')
const app = express()
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hopim.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const port = process.env.PORT || 5055

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const eventsCollection = client.db("volunteer").collection("events");

app.get('/events',(req, res)=>{
    eventsCollection.find()
    .toArray((err,items)=>{
      res.send(items)
    })
})

app.post('/addEvent',(req,res) => {
const newEvent = req.body;
eventsCollection.insertOne(newEvent)
.then(result => {
    res.send(result.insertedCount > 0)
})

})

app.delete('deleteEvent/:id',(req, res)=>{
    const id = ObjectID(req.params.id);
    console.log('delete this',id);
    eventsCollection.findOneAndDelete({_id: id})
    .then(documents => {
        res.send(!!documents.value)
    })
})
 });



app.listen(port)