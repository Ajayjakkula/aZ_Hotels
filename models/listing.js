const mongoose=require("mongoose");
const { type } = require("os");

const listingSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
         image: {
  type: String,
  default: "https://media.istockphoto.com/id/1442179368/photo/maldives-island.jpg"
}
,
        price:{
            type:Number,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }
    }
);

const listingmodel=mongoose.model("listingmodel",listingSchema);

module.exports=listingmodel;