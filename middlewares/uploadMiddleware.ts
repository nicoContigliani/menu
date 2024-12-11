import multer from "multer";
import configMulter from "../utils/configMulter";

const upload = configMulter("public", "foldercompanies");

const uploadMiddleware = upload.fields([
    { name: "file", maxCount: 1 },
    { name: "pictures", maxCount: 30 },
]);

export default uploadMiddleware;