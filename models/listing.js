const mongoose=require("mongoose");
const { type } = require("os");
const Review=require("./review")

const listingSchema=new mongoose.Schema(
    {
        title:{
            type:String,
          //  required:true
        },
        description:{
            type:String,
            //required:true
        },
         image: {
  type: String,
  default: "https://media.istockphoto.com/id/1442179368/photo/maldives-island.jpg"
}
,
        price:{
            type:Number,
           // required:true
        },
        location:{
            type:String,
           // required:true
        },
        country:{
            type:String,
           // required:true
        },
        review:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }]
    }
);

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.review } });
  }
});


const listingmodel=mongoose.model("listingmodel",listingSchema);

module.exports=listingmodel;

