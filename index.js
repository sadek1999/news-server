const express = require('express');
const cors = require('cors');

const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());




console.log(process.env.DB_PASS)


const uri = `mongodb+srv://newsBlog:UesUR8PBvSDZqYQ3@cluster0.xtmekud.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const newsCollection = client.db('newsDB').collection('news')
        const userCollection= client.db('newsDB').collection('users')
        // api for users......
        app.post('/singup',async(req,res)=>{
            const user=req.body;
            const result=await userCollection.insertOne(user)
            res.send(result)
        })
        app.get('/login/:email',async(req,res)=>{
            const userEmail=req.params.email
            const query={email:userEmail}
            const result=await userCollection.findOne(query);
            res.send(result);
        })
    //   api for news ......
        app.get('/get', async (req, res) => {
            const result = await newsCollection.find().toArray()
            res.send()
        })
        app.post('/post', async (req, res) => {
            const blog = req.body;
            const result = await newsCollection.insertOne(blog)
            res.send(result);
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send("news server is runing")
})
app.listen(port, () => {
    console.log('news blog is comeing', { port })
})