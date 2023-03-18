const express = require('express')

const path = require("path")
const methodOVerride = require("method-override")
const mongoose = require('mongoose')
const ejsMate = require("ejs-mate")
const Campground = require("./models/campground")
const morgan = require("morgan")
const { castObject } = require('./models/campground')
const catchAsync = require("./utils/catchAsync")



mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});



const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

//mongodb conection
const app = express()
app.engine("ejs", ejsMate)
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

//use on every single request
app.use(express.urlencoded({extended: true}))
app.use(methodOVerride("_method"))
app.use(morgan("tiny"))


app.get("/campgrounds", async (req,res) => {
   const campgrounds = await Campground.find({})
   res.render("campgrounds/index", {campgrounds})
})



app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.post("/campgrounds", catchAsync(async (req, res, next) => {
    
    const campground = new Campground(req.body.campground);
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)

    res.send("ohhh shit")

}))

app.get("/campgrounds/:id", async (req, res, next) => {
    try{
        const campground = await Campground.findById(req.params.id)
        res.render("campgrounds/show", {campground})
    }catch(e){
        
    }
    
})
app.get("/campgrounds/:id/edit", async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render("campgrounds/edit", {campground})


app.put("/campgrounds/:id", async (req, res, next) => {
    try{
        const {id} = req.params;
        const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
        res.redirect(`/campgrounds/${campground._id}`)
    }catch(e){
        next(e)
    }
    
})
app.delete("/campgrounds/:id", async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds")
})




app.use((err, req, res, next) => {
    res.send("oh boy")
})

})
app.listen(3000, () => {
    console.log("listening on port 3000")
})