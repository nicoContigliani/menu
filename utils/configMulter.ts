import multer from "multer";
import fs from "fs";
import path from "path";

const configMulter = (paths: string, foldername: string) => {

    // Configuración de Multer
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const publicDir = path.join(process.cwd(), paths, foldername);
            if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
            }
            cb(null, publicDir);
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });
    const upload = multer({ storage });
    return upload

}

export default configMulter