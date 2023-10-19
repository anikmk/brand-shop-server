const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@anik.34iapyi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
    const carsCollection = client.db("carsDB").collection("cars");
    const userCollection = client.db("userDB").collection("user");
    const updateCollection = client.db("updateDB").collection("updateProduct")

  try {
    // Connect the client to the server	(optional starting in v4.7)
   app.get('/products',async(req,res)=>{
        const cursor = carsCollection.find();
        const result = await cursor.toArray();
        res.send(result)
   })

// ......
//    app.get('/products', async(req, res) => {
//     const brandname = req.query.brandname;
//     console.log(brandname)
//     const query = {brandname: brandname}
//     const result = await carsCollection.find(query).toArray();
//     res.send(result);
//         })

// .......
   app.get('/products/:id',async(req,res)=>{
    const id = req.params.id;
    const query = {_id: new ObjectId(id)};
    const result = await carsCollection.findOne(query);
    res.send(result)
   })
    app.post('/products',async(req,res)=>{
        const products = req.body;
        const result = await carsCollection.insertOne(products);
        res.send(result)
    })

    // update user releted apis
    app.post('/update',async(req,res) => {
        const update = req.body;
        console.log(update)
        const result = await updateCollection.insertOne(update);
        res.send(result)
    })

    // user releted apis
    app.post('/user',async(req,res)=>{
      const user = req.body;
      console.log(user)
      const result = userCollection.insertOne(user);
      res.send(result);
    })

    // await client.connect();..........
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('automotive server is running')
})

app.listen(port,()=>{
    console.log(`automotive server is runnig on port: ${port}`)
})