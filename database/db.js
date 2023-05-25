const mongoose = require("mongoose");
const dotenv = require ("dotenv");

dotenv.config(); 

const URL=process.env.DATABASE_URL;

const connection=async()=>{ mongoose.connect(URL, {
    useNewUrlParser:true,
    useUniFiedTopology:true
}).then(console.log("database conneted successfully")).catch((err)=> console.log(err));}


module.exports=connection;