const express = require('express');
const cors = require('cors');
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());







const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xtmekud.mongodb.net/?retryWrites=true&w=majority`;

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
        const commentCollection= client.db('newsDB').collection('comments')
        const myCollection= client.db('newsDB').collection('mynews')

        // api for users---------------------------------------------------------------
        // ---------------------------------------------------------------------------
        app.post('/user',async(req,res)=>{
            const user=req.body;
            const result=await userCollection.insertOne(user)
            res.send(result)
        })
        app.get("/getusers/:email",async(req,res)=>{
            const userEmail=req.params.email
            
            const query={email:userEmail}
           
            const result=await userCollection.findOne(query)
            console.log(result)
            res.send(result);
        })
        // app.get('/getuser', async (req, res) => {
        //     let query={};
        //     if (req.query?.email) {
        //         query = { email: req.query.email }
        //       }
        //     console.log(query)
        //     const result = await userCollection.find(query).toArray()
        //     console.log(result)
        //     res.send(result)
        // })
    //   api for news -----------------------------------------------------------------
    // --------------------------------------------------------------------------------
        app.get('/getnews', async (req, res) => {
            
            const result = await newsCollection.find().toArray()
            res.send(result)
        })
        app.get('/news/:id',async(req,res)=>{
            const id=req.params.id
            const query={_id:new ObjectId(id)}
            const result=await newsCollection.findOne(query);
            res.send(result)
        })

        app.get('/news', async (req, res) => {
            let query = {}
            // console.log(req.query.email);
           
             if(req.query?.type){
                query={type:req.query.type}
             }
            if (req.query?.email) {
              query = { email: req.query.email }
            }
            console.log(query)
            const result = await newsCollection.find(query).toArray()
            res.send(result);
          })

        app.post('/post', async (req, res) => {
            const blog = req.body;
            const result = await newsCollection.insertOne(blog)
            res.send(result);
        })
        // api for wishlist .......................................................
        // --------------------------------------------------------------------

        app.get('/wishlist',async(req,res)=>{
            const result=await myCollection.find().toArray();
            res.send()
        })

        app.post('/wishlist',async(req,res)=>{
            const blog=req.body;
            console.log('hit wish')
            const result=await myCollection.insertOne(blog)
            res.result;
        })

        // api for the comment -----------------------------------------------
        // -------------------------------------------------------------------

        app.get('/comment',async(req,res)=>{
            let query={};
            if(req.query?.newsid){
                query={newsid:req.query?.newsid};
                console.log(query)
            }
            const result=await commentCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/comment',async(req,res)=>{
            console.log(req.body)
            const comment=req.body;
            const result=await commentCollection.insertOne(comment);
            res.send(result)
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