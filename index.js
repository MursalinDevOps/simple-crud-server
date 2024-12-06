const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
// mursalindev
// yTOzokXSPwpUy72b

const uri =
  "mongodb+srv://mursalindev:yTOzokXSPwpUy72b@cluster0.mzx0h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB");
    const userCollection = database.collection("users");

    app.get('/users', async(req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })


    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("NEW USER", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    app.delete('/users/:id', (req, res) => {
      const id = req.params.id;
      console.log("Deleting user with ID:", id);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("CRUD server is running ...");
});

app.listen(port, () => {
  console.log(`CRUD server is running on ${port}`);
});
