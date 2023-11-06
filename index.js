const express = require('express');
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/',(req,res)=>{
    res.send("news server is runing")
})
app.listen(port,()=>{
    console.log('news blog is comeing',{port})
})