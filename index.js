const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config()
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;





// Mongobd Connect Start
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sozmemk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});
async function run() {
      try {
            await client.connect();


            const userCollection = client.db('edublink').collection('users')
            
            app.post('/jwt', async (req, res) => {
                  const user = req.body;
                  const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                        expiresIn: '1hr'
                  })
                  res.send({ token })
            })





            app.put("/users", async (req, res) => {
                  const user = req.body;
                  const query = { email: user?.email };
                  const isExist = await userCollection.findOne(query);
                  if (isExist) {
                        return res.send(isExist);
                  } else {
                        const options = { upsert: true };
                        const updateDoc = {
                              $set: {
                                    ...user,
                                    timestamp: Date.now(),
                              },
                        };
                        const result = await userCollection.updateOne(
                              query,
                              updateDoc,
                              options
                        );
                        res.send(result);
                  }
            });

            app.get('/users/:email', async (req, res) => {
                  const email = req.params.email;
                  const query = { email }
                  const result = await userCollection.findOne(query)
                  res.send(result)
            })

            app.get('/users', async (req, res) => {
                  const result = await userCollection.find().toArray();
                  res.send(result)
            })




            await client.db("admin").command({ ping: 1 });
            console.log("Mongodb Connected successfully!");
      } finally {
      }
}
run().catch(console.dir);
// Mongobd Connect End




app.get('/', (req, res) => {
      res.send('EduBlink is Running!')
})
app.listen(port, () => {
      console.log(`EduBlink is Sitting On Port ${port}`)
})