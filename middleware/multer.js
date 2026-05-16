// import multer from "multer";
// const upload = multer({storage:multer.diskStorage({})})

// export default upload;
// import multer from "multer";

// const storage = multer.diskStorage(); // ✅ IMPORTANT

// const upload = multer({ storage });

// export default upload;
import multer from "multer";

const storage = multer.memoryStorage(); // ✅ FIX
const upload = multer({ storage });

export default upload;