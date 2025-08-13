const express = require("express");
const methodOverride = require("method-override");
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const ejsmate=require("ejs-mate")

const app = express(); 


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method")); 

mongoose.connect('mongodb://127.0.0.1:27017/Hotel')
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs",ejsmate)

app.get("/listings", async (req, res) => {
    let totaldata = await Listing.find({});
    res.render("home", { totaldata });
});

app.get("/listings/add/new", (req, res) => {
    res.render("addnewlisting.ejs");
});

app.post("/listings/add/newdata", async (req, res) => {
    try {
        await Listing.create(req.body);
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating listing");
    }
});

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let totaldata = await Listing.findById(id);
    res.render("Briefinfo", { totaldata });
});

app.get("/listings/edit/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send("Listing not found");
        }
        res.render("editcurrent", { listing });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching listing for edit");
    }
});

app.patch("/listings/edit/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let { title, description, price } = req.body;

        let updatedListing = await Listing.findByIdAndUpdate(
            id,
            { title, description, price },
            { new: true, runValidators: true }
        );

        if (!updatedListing) {
            return res.status(404).send("Listing not found");
        }

        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating listing");
    }
});

app.delete("/listings/delete/:id",async (req,res)=>{
    let {id}=req.params;
   await Listing.findByIdAndDelete(id);
res.redirect("/listings")

})

let port = 8080;
app.listen(port, () => console.log(`App is listening on port ${port}`));
