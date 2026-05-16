
// // import jwt from"jsonwebtoken"
// // import User from "../models/User.js"



// // export const protect = async(req,res,next) =>{
// //   const token = req.headers.authorization;
// //   if(!token)
// //   {
// //     return res.json({success:false, message:"not authorized"}
// //     )}
// //     try {
// //       const userId = jwt.decode(token, process.env.JWT_SECRET);
// //       if(!userId){
// //         return res.json({success:false, message:"not authorized"})
// //       }
// //       await User.findById(userId).select("-password");
// //       req.user = user;
// //       next();
// //     } catch (error) {
// //       return res.json({success:false, message:"not authorized"})
// //     }
// // }
//  import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization;

//     if (!token) {
//       return res.json({ success: false, message: "Not authorized" });
//     }

//     // ✅ verify token (NOT decode)
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // ✅ get user from DB
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.json({ success: false, message: "User not found" });
//     }

//     // ✅ attach user
//     req.user = user;

//     next();

//   } catch (error) {
//     console.log(error.message);
//     return res.json({ success: false, message: "Invalid token" });
//   }
// };

// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// export const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1]; // extract token

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Not authorized" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     req.user = user; // attach user to request
//     next();

//   } catch (error) {
//     console.log(error.message);
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };
// import jwt from "jsonwebtoken";
// export const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1]; // extract token

//     if (!token) {
//       return res.status(401).json({ success: false, message: "Not authorized" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws if invalid
//     const user = await User.findById(decoded.id).select("-password");

//     if (!user) {
//       return res.status(401).json({ success: false, message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log(error.message); // important to see exact error
//     return res.status(401).json({ success: false, message: "Invalid token" });
//   }
// };
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ✅ import User

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // extract token

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user; // attach user to request
    next();

  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};