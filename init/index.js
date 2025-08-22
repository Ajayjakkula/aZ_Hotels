const mongoose=require("mongoose")
const Listing = require("../models/listing.js");
const initdata = require("./data.js");

mongoose.connect('mongodb://127.0.0.1:27017/Hotel')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

const initDB=async()=>{
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"68a5acc79d10b6ea2ccd014a"}));  //reinitializing the data totally instead of aqdding ower for evry individual data here data is an array 
   await Listing.deleteMany({});
   await Listing.insertMany(initdata.data);

}
initDB();