const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Booking = require('../models/Booking');
const Member = require('../models/Member');

module.exports = {
    landingPage: async (req, res) => {
        try {
            const mostPicked = await Item.find()
                                .select('_id title country city price unit imageId')
                                .populate({path: 'imageId', select: '_id imageUrl'})
                                .limit(5);
            const traveler = await Traveler.find();
            const treasure = await Treasure.find();
            const city = await Item.find();
            const categories = await Category.find()
                                .select('_id name')
                                .populate({
                                    path: 'itemId', 
                                    select: '_id title imageId country city isPopular sumBooking',
                                    perDocumentLimit: 4,
                                    options: { 
                                        sort: { sumBooking : -1 } 
                                    },
                                    populate: {
                                        path: 'imageId', 
                                        select: '_id imageUrl',
                                        perDocumentLimit: 1
                                    },
                                })
                                .limit(5);

            for(let i = 0; i < categories.length; i++){
                for(let j = 0; j < categories[i].itemId.length; j++){
                    const item =  await Item.findOne({_id: categories[i].itemId[j]._id});
                    item.isPopular = false; 
                    await item.save();

                    if(categories[i].itemId[0].sumBooking === categories[i].itemId[j].sumBooking){
                        item.isPopular = true;
                        await item.save();
                    }
                }
            }

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial2.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }

            res.status(200).json({
                hero: {
                    travelers: traveler.length,
                    treasures: treasure.length,
                    cities: city.length
                  },
                mostPicked,
                categories,
                testimonial
            });
        } catch (error) {
            console.log(error)
            res.status(500).json("Internal Server Error")
        }
    },

    detailPage: async (req, res) => {
        try {
            const { id } = req.params;
            const item = await Item.findOne({_id: id})
                                .populate({path: 'featureId', select: '_id name qty imageUrl'})
                                .populate({path: 'activityId', select: '_id name type imageUrl'})
                                .populate({path: 'imageId', select: '_id imageUrl'})

            const bank = await Bank.find();

            const testimonial = {
                _id: "asd1293uasdads1",
                imageUrl: "images/testimonial1.jpg",
                name: "Happy Family",
                rate: 4.55,
                content: "What a great trip with my family and I should try again next time soon ...",
                familyName: "Angga",
                familyOccupation: "Product Designer"
            }

            res.status(200).json({
                ...item._doc, bank, testimonial
            });
        } catch (error) {
            console.log(error)
            res.status(500).json("Internal Server Error")
        }
    },
    bookingPage: async (req, res) => {
        try {
            const {
                idItem,
                duration,
                // price,
                bookingStartDate,
                bookingEndDate,
                firstName,
                lastName,
                email,
                phoneNumber,
                accountHolder,
                bankFrom,
            } = req.body;

            if(!req.file == null || !req.file == undefined){
                res.status(404).json("Image Not Found")
            }

            if(
                idItem === undefined ||
                duration === undefined ||
                // price === undefined ||
                bookingStartDate === undefined ||
                bookingEndDate === undefined ||
                firstName === undefined ||
                lastName === undefined ||
                email === undefined ||
                phoneNumber === undefined ||
                accountHolder === undefined ||
                bankFrom === undefined
            ) {
                res.status(404).json("Please fill all fields!");
            }

            const item = await Item.findOne({_id: idItem});

            if(!item){
                res.status(404).json("Cannot find Item");

            }

            item.sumBooking += 1;

            await item.save();

            let total = item.price * duration;
            let tax = total * 0.10;

            const invoice = Math.floor(1000000 + Math.random() * 9000000);

            const member = await Member.create({
                firstName,
                lastName,
                email,
                phoneNumber
            });

            const newBooking = {
                invoice,
                bookingStartDate,
                bookingEndDate,
                total: total += tax,
                itemId: {
                    _id: idItem,
                    title: item.title,
                    price: item.price,
                    duration: duration
                },
                memberId: member.id,
                payments: {
                    proofPayment: `images/${req.file.filename}`,
                    bankFrom: bankFrom,
                    accountHolder: accountHolder,
                    status: 'Proses'
                }
            };

            const booking = await Booking.create(newBooking);
            
            res.status(200).json({message: "Success Booking", booking});
        } catch (error) {
            console.log(error)
            res.status(500).json("Internal Server Error")
        }
    }
}