const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // load data dynamically on the update profile route
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      console.log("NEW USER", user);
      const result = await userCollection.insertOne(user);
      res.send(result);
    });
    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log('Recieved ID', id)
      const updatedUserInfo = req.body;
    
      // Log the input data for debugging
      console.log(updatedUserInfo);
    
      // Ensure the ObjectId is valid
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid ID format' });
      }
    
      const filter = { _id: new ObjectId(id) }; // Corrected field name
      const options = { upsert: true }; // Create a new user if not found
      const updatedUser = {
        $set: {
          name: updatedUserInfo.name,
          email: updatedUserInfo.email,
        },
      };
    
      try {
        const result = await userCollection.updateOne(filter, updatedUser, options);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to update user' });
      }
    });
    
    // delete an user by identifying with id
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleting user with ID:", id);
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
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
