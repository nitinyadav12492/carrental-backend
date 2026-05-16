import Car from "../models/Car.js";
import Booking from "../models/Booking.js"

// //function to check availability of car for a given date
// const checkAvailability = async(car,pickupDate,returnDate)=>{
//   const bookings = await Booking.find({
//     car,
//     pickupDate:{$lte: returnDate},
//     returnDate:{$gte: pickupDate}
//   })
//   return bookings.length === 0;

// }



const checkAvailability = async (carId, pickupDate, returnDate) => {
  const bookings = await Booking.find({
    car: carId,
    pickupDate: { $lte: returnDate },
    returnDate: { $gte: pickupDate }
  });

  return bookings.length === 0;
};





// //api to check availability of cars for the given date and location

// export const checkAvailabilityOfCar = async (req,res) => {
//   try {
//     const{location,pickupDate, returnDate} = req.body;
//     //fetch all available cars for the given location 
//     const cars =  await Car.find({location, isAvailable:true})
//     //check car availabilty for the given date range using promise

//     const availableCarsPromises = cars.map(async(car)=>{
//      const isAvailable = await checkAvailability(car._id, pickupDate,returnDate)
//      return {...car._doc, isAvailable:isAvailable}
//     }) 
    
//     let availableCars =await Promise.all(availableCarsPromises);
//     availableCars = availableCars.filter(Car => car.isAvailable === true)

//   res.json({success:true, availableCars})

//   } catch (error) {
//     console.log(error.message)
//     res.json({success:false,  message:error.message})
//   }
// }
export const checkAvailabilityOfCar = async (req,res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // 🔥 location match flexible karo (IMPORTANT)
    const cars = await Car.find({
      location: { $regex: location, $options: "i" }, 
      isAvailable: true
    });

    const availableCarsPromises = cars.map(async (car) => {
      const isAvailable = await checkAvailability(car._id, pickupDate, returnDate);
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);

    // ✅ FIXED LINE
    availableCars = availableCars.filter(car => car.isAvailable === true);

    res.json({ success: true, availableCars });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// //API to create booking 
// export const createBooking = async (req, res) => {
//   try {
//      const{cars,pickupDate, returnDate} = req.body;
//      const isAvailable = await checkAvailability(cars,pickupDate, returnDate)
//      if(!isAvailable){
//       return res.json({success:false, message :"car is not available"})
//      }

//      const carData = await Car.findById(car)

//      //calculate price based on pickupdate and return date
//     const picked = new Date(pickupDate);
//     const returned = new Date(returnDate)
//     const noOfDays = Math.ceil((returned - picked)/(1000*60*60*24))
//     const price = carData.pricePerDay*noOfDays;

//     await Bookings.create({car, owner:carData.owner,user:_id,pickupDate,returnDate,price})
//     res.json({success:true,message:"booking created"})
 


//   } catch (error) {
//     console.log(error.message)
//     res.json({success:false,  message:error.message})
//   }
// }

// //Api to list User Bookings

export const getUserBookings = async(req,res) =>{
  try {
    const {_id} = req.user;
    const bookings =await Booking.find({user:_id}).populate("car").sort({createAt:-1})
    res.json({success:true,bookings})
  } catch (error) {
     console.log(error.message)
    res.json({success:false,  message:error.message})
  }
}

// //api to get owner boookings


// export const getOwnerBookings = async(req,res) =>{
//   try {
//    if(req.user.role !=='owner'){
//     return res.json({success:false, message:"Unauthorized"})
//    }
//    const bookings = await (await Booking.find({owner:req.user._id}).populate('car user').select("-user.password")).toSorted({createdAt: -1 })
//     res.json({success:true,bookings})
//   } catch (error) {
//      console.log(error.message)
//     res.json({success:false,  message:error.message})
//   }
// }
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate('car user')
      .select("-user.password")
      .sort({ createdAt: -1 }); // ✅ FIXED

    res.json({ success: true, bookings });

  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// //API to change booking status
export const changeBookingStatus = async(req,res) =>{
  try {
    const {_id} = req.user;
    const {bookingId ,status} = req.body
    const booking = await Booking.findById(bookingId)
   if (booking.owner.toString() !==_id.toString()){
    return res.json({success:false, message:"Unauthorized"})
      }
      booking.status = status;
      await booking.save();



  } catch (error) {
     console.log(error.message)
    res.json({success:false,  message:error.message})
  }
}


export const createBooking = async (req, res) => {
  try {
    const { carId, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(carId, pickupDate, returnDate);

    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Car is not available"
      });
    }

    const carData = await Car.findById(carId);

    if (!carData) {
      return res.json({
        success: false,
        message: "Car not found"
      });
    }

    // ✅ price calculation
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);

    const noOfDays = Math.ceil(
      (returned - picked) / (1000 * 60 * 60 * 24)
    );

    const price = carData.pricePerDay * noOfDays;

    const booking = await Booking.create({
      car: carId,
      owner: carData.owner,
      user: req.user._id,
      pickupDate,
      returnDate,
      price
    });

    res.json({
      success: true,
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message
    });
  }
};