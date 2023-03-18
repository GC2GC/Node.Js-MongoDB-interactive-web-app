const mongoose = require('mongoose')
const Campground = require("../models/campground")
const cities = require("./cities")
const {descriptors, places} = require("./helper")


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => array[Math.floor(Math.random()* array.length)]


const seedDB = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random()*20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://random.imagecdn.app/800/600",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque aut quas consequuntur neque ipsam, tempora, maiores consectetur cupiditate illum, architecto facere dicta non libero laboriosam? Natus provident doloribus repellendus quas.",
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})