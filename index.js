const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config()
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;





// Mongobd Connect Start
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

            // Collection Section
            const userCollection = client.db('edublink').collection('users')
            const courseCollection = client.db('edublink').collection('course')
            const addTeacherCollection = client.db('edublink').collection('teacher')

            // JWT Token
            app.post('/jwt', async (req, res) => {
                  const user = req.body;
                  const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
                        expiresIn: '1hr'
                  })
                  res.send({ token })
            })



            // User Related Data
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

            app.delete('/users/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: new ObjectId(id) }
                  const result = await userCollection.deleteOne(query)
                  res.send(result)
            })





            // Admin & User Role Condition
            app.patch('/users/admin/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: new ObjectId(id) }
                  const updateDoc = {
                        $set: {
                              role: 'admin'
                        }
                  }
                  const result = await userCollection.updateOne(query, updateDoc)
                  res.send(result)
            })




            // Add Course Data
            app.post('/course', async (req, res) => {
                  const addCourse = req.body
                  const result = await courseCollection.insertOne(addCourse)
                  res.send(result)
            })

            app.get('/course', async (req, res) => {
                  const result = await courseCollection.find().toArray()
                  res.send(result)
            })

            app.delete('/course/:id', async (req, res) => {
                  const id = req.params.id
                  const query = { _id: new ObjectId(id) }
                  const result = await courseCollection.deleteOne(query)
                  res.send(result)
            })

            app.patch("/course/:id", async (req, res) => {
                  const item = req.body;
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const updatedDoc = {
                        $set: {
                              title: item.title,
                              description: item.description,
                              category: item.category,
                              level: item.level,
                              price: item.price,
                              duration: item.duration,
                              instructorName: item.instructorName,
                              email: item.email,
                              image: item.image,
                              enrollmentCount: item.enrollmentCount,
                              language: item.language,
                              lessons: item.lessons,
                              submitDate: item.submitDate,
                        },
                  };
                  const result = await courseCollection.updateOne(filter, updatedDoc);
                  res.send(result);
            });

            app.get('/course/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) }
                  const result = await courseCollection.findOne(query)
                  res.send(result)
            })



            app.get('/course/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await courseCollection.findOne(query)
                  res.send(result)
            })








            // Add Teacher Data
            app.post('/teacher', async (req, res) => {
                  const addCourse = req.body
                  const result = await addTeacherCollection.insertOne(addCourse)
                  res.send(result)
            })

            app.get('/teacher', async (req, res) => {
                  const result = await addTeacherCollection.find().toArray()
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