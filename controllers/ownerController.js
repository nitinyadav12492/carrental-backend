
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
// import fs from "fs";
import imagekit from "../configs/imagekit.js"; // 👈 ADD THIS


export const changeRoleToOwner = async (req, res) => {
  try {
    // ❌ Unauthorized (FIXED)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { _id, role } = req.user;

    // ❌ Already owner (recommended check)
    if (role === "owner") {
      return res.status(400).json({
        success: false,
        message: "You are already an owner",
      });
    }

    // ✅ Update role
    await User.findByIdAndUpdate(_id, { role: "owner" });

    return res.status(200).json({
      success: true,
      message: "Now you can list cars",
    });

  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//API to list car
// export const addCar = async (req,res)=>{
//   try {
//     const{_id}=req.user;
//     let car = JSON.parse(req.body.carData);
//     const imageFile = req.file;

//     //upload to imagekit
//    const fileBuffer = fs.readFileSync(imageFile.path)
//    await imagekit.upload({
//     file:fileBuffer,
//     fileName: imageFile.originalname,
//     folder:"/cars"
//    })
      
//    //optimization through imagekit URL transformation
//   var optimizedImageURL = imagekit.url({
//     path:response.filePath,
    
//     transformation :[
//       {"width":"1280"},//width resizing
//       {quality:'auto'},//auto compression
//       {format:'webp'}//convert to modern format
    
//     ]
//   });

//   const image = optimizedImageURL;
//   await Car.create({...car,owner:_id, image})
//   res.json({success:true,message:"success add car"})

//   } catch (error) {
//     return res.json({success:false,message:error.message})
//   }
// }
// export const addCar = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     if (!_id) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const carss = JSON.parse(req.body.carData);
//     const imageFile = req.file;

//     const fileBuffer = fs.readFileSync(imageFile.path);
//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: imageFile.originalname,
//       folder: "/cars"
//     });

//     fs.unlinkSync(imageFile.path); // remove local file

//     const optimizedImageURL = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { width: "1280" },
//         { quality: "auto" },
//         { format: "webp" }
//       ]
//     });

//     await Car.create({ ...carss, owner: _id, image: optimizedImageURL });

//     res.status(200).json({ success: true, message: "Car added successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const addCar = async (req, res) => {
//   try {
//     if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
//     const { _id } = req.user;

//     if (!req.file) return res.status(400).json({ success: false, message: "No image uploaded" });

//     const carData = JSON.parse(req.body.carData);

//     // const fileBuffer = fs.readFileSync(req.file.path);
//     // const response = await imagekit.upload({
//     //   file: fileBuffer,
//     //   fileName: req.file.originalname,
//     //   folder: "/cars"
//        const fileBuffer = req.file.buffer; // ✅ use buffer directly

//     const response = await imagekit.upload({
//       file: fileBuffer,
//       fileName: req.file.originalname,
//       folder: "/cars",
//     });
    

//     fs.unlinkSync(req.file.path);

//     const optimizedImageURL = imagekit.url({
//       path: response.filePath,
//       transformation: [
//         { width: "1280" },
//         { quality: "auto" },
//         { format: "webp" }
//       ]
//     });

//     const newCar = await Car.create({ ...carData, owner: _id, image: optimizedImageURL });

//     res.status(200).json({ success: true, message: "Car added successfully", car: newCar });

//   } catch (error) {
//     console.log(error); // log for debugging
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
export const addCar = async (req, res) => {
  try {
    // ✅ Protect middleware ensures req.user exists
    console.log(req.file);
    const { _id } = req.user;

    // ✅ Check if file exists
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }

    // ✅ Parse car data
    const carData = JSON.parse(req.body.carData);

    // ✅ Upload directly from buffer (memoryStorage)
    const response = await imagekit.upload({
      file: req.file.buffer,         // use buffer directly
      fileName: req.file.originalname,
      folder: "/cars",
    });

    // ✅ Optimized image URL
    const optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    // ✅ Create new car in DB
    const newCar = await Car.create({ ...carData, owner: _id, image: optimizedImageURL });

    res.status(200).json({ success: true, message: "Car added successfully", car: newCar });

  } catch (error) {
    console.error("Add Car Error:", error);
    console.log(req.file);
    res.status(500).json({ success: false, message: error.message });
  }
};
//api to lists Owner cars
export const getOwnersCars = async(req,res) =>{
  try{
   const {_id} = req.user;
   const cars = await Car.find({owner: _id})
   res.json({success:true,cars})
  }catch(error){
 return res.json({success:false, message:error.message})
  }
}

//togglecarAvailability

export const toggleCarAvailability = async (req,res) => {
  try{
    const{_id} =req.user;
    const {carId}= req.body;
    const car = await Car.findById(carId)
    //checking is car belongs to the user
    if(car.owner.toString() !==_id.toString()){
      return res.json({success:false,message:"unauthorized"})
    }
   car.isAvailable =!car.isAvailable;
   await car.save()
   res.json({success:true, message:"Availability Toggled"})

  }catch(error){
     return res.json({success:false,message:error.message})
  }
}

// API to delete a car

export const deleteCar = async (req,res) => {
  try{
    const{_id} =req.user;
    const {carId}= req.body;
    const car = await Car.findById(carId)
    //checking is car belongs to the user
    if(car.owner.toString() !==_id.toString()){
      return res.json({success:false,message:"unauthorized"})
    }
   car.owner=null;
   car.isAvailable = false;
   await car.save()
   res.json({success:true, message:"Availability Toggled"})

  }catch(error){
     return res.json({success:false,message:error.message})
  }
}

// //API to get Dashboard data
// export const getDashboardData = async (req,res) =>{
//   try {
//     const {_id,role}=req.user;
//     if(role !== 'owner'){
//       return res.json({success:false,message:"unauthorized"})
//     }
//     const cars = await Car.find({owner: _id})
//     const bookings = await Booking.find({owner:_id}).populate('car').sort({createdAt: -1});
//     const pendingBookings = await Booking.find({owner:_id, status:"pending"})
//     const completedBookings = await Booking.find({owner:_id, status:"confirmed"})

//     // calculate monthly  revenue

//     const revenue = bookings.slice().filter(booking => booking.status ==="confirmed").reduce((acc,booking)=>acc+booking.price,0)
//   const dashboardData ={
//     totalCars:cars.length,
//     totalBookings:bookings.length,
//     pendingBookings: pendingBookings.length,
//     completedBookings: completedBookings.length,
//     recentBookings:bookings.slice(0,3),
//     revenue
//   }
//   res.json({success:true, dashboardData})


//   } catch (error) {
//      return res.json({success:false,message:error.message})
//   }
// }
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    // ✅ Filter from same data (no extra DB calls)
    const pendingBookings = bookings.filter(
      (b) => b.status === "pending"
    );

    const completedBookings = bookings.filter(
      (b) => b.status === "confirmed"
    );

    // ✅ Revenue calculation
    const revenue = completedBookings.reduce(
      (acc, booking) => acc + booking.price,
      0
    );
     const recentBookings = bookings.slice(0, 3).map((b) => ({
      car: `${b.car?.brand} ${b.car?.model}`,
      date: `${b.pickupDate?.toISOString().split("T")[0]} → ${b.returnDate?.toISOString().split("T")[0]}`,
      price: b.price,
      status: b.status,
    }));


    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3) || [], // 🔥 safe
      revenue,
    };

    res.json({
      success: true,
      dashboardData,
      recentBookings, 
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// api to update user image

// export const updateUserImage =async (req,res)=>
// {
//   try {
//     const{_id} =req.user;
//      const imageFile = req.file;

//     //upload to imagekit
//    const fileBuffer = fs.readFileSync(imageFile.path)
// const response =   await imagekit.upload({
//     file:fileBuffer,
//     fileName: imageFile.originalname,
//     folder:"/users"
//    })
//    var optimizedImageURL = imagekit.url({
//     path:response.filePath,
    
//     transformation :[
//       {"width":"400"},//width resizing
//       {quality:'auto'},//auto compression
//       {format:'webp'}//convert to modern format
    
//     ]
//   });

//   const image = optimizedImageURL;
  
//   await User.findByIdAndUpdate(_id,{image});
//   res.json({success:true, message:"image update"})


//   } catch (error) {
//      return res.json({success:false,message:error.message})
//   }
// }

export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    // 🔥 ADD THIS CHECK
    if (!imageFile) {
      return res.json({
        success: false,
        message: "No file uploaded",
      });
    }

    const response = await imagekit.upload({
      file: imageFile.buffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    const optimizedImageURL = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageURL });

    res.json({ success: true, message: "Image updated" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};