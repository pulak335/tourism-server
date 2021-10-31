const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express()
require('dotenv').config()
const PORT = process.env.PORT||4000

//midleware
app.use(cors());
app.use(express.json());



const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uoagi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

 const run = async ()=> {
    try {
        await client.connect();
        const database = client.db("travel");
        const server = database.collection("service");
        // create a document to insert
  
        app.get('/services', async (req, res) => {
          const cursor = server.find({});
          const service = await cursor.toArray();
          res.send(service);
        });

              //get api for single service

      app.get('/services/:id', async (req, res) => {
        const id =req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await server.findOne(query);
        res.send(service);

    });


        // post method 
        app.post('/services', async(req, res) => {
          const service = req.body;
          const result = await server.insertOne(service); 
          res.json(result)
        });


        //delete method

        app.delete('/services/:id', async (req, res) => {
          const id = req.params.id;
          const query = {_id:ObjectId(id)};
          const result = await server.deleteOne(query);
          res.send(result)
      });
      
        console.log(`server is running`);
      } finally {
      //   await client.close();
      }
    }
    run().catch(console.dir);
  
    app.get('/', (req, res) => {
      res.send('server is running')	
    });
  
  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })