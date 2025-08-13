const mongoose=require("mongoose")
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

mongoose.connect('mongodb://127.0.0.1:27017/Hotel')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const initDB=async()=>{
   await Listing.deleteMany({});
   await Listing.insertMany(initdata.data);

}
initDB();