
const mongoose = require("mongoose");
const { descriptors, places } = require("./seedhelpers");
const cities = require("./cities");


const Campground = require("../models/campground");

mongoose.connect('mongodb://localhost:27017/oboCare', { useNewUrlParser: true, useUnifiedTopology: true  })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })


const sample = (array) =>{
    return array[Math.floor(Math.random() * array.length)]
}


const seedDb = async () => {
    await Campground.deleteMany({})
    for(let i = 0; i <300 ; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: "61c0aa7d41226f03625bebc4",
            title : `${sample(descriptors)} ${sample(places)}`,
            location : `${cities[random1000].city}, ${cities[random1000].state} `,
            images : [
                {
                    url: 'https://res.cloudinary.com/duhxhaszn/image/upload/v1641201728/OboCare/yhzcgbbfyqxq4nohwaud.png',
                    filename: 'OboCare/yhzcgbbfyqxq4nohwaud'
                  
                },
                {
                    url: 'https://res.cloudinary.com/duhxhaszn/image/upload/v1641202000/OboCare/fflaijcf4mgklfqlulay.png',
                    filename: 'OboCare/fflaijcf4mgklfqlulay'
                  
                }
              ]
              ,
            description : " Description available in future update",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
            

        })
        await camp.save()
    }
}

seedDb().then(() => {
    mongoose.connection.close()
});