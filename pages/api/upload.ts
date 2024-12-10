// import { NextApiRequest, NextApiResponse } from "next";
// import multer from "multer";
// import fs from "fs";
// import path from "path";

// import clientPromise from "../../utils/mongodb";

// import { CreateFolder } from "../../servicesApi/CreateFolder.services";
// import { MovePrincipalFile } from "../../servicesApi/MovePrincipalFile.services";
// import { MovePictureFile } from "../../servicesApi/MovePicturesFile.services";
// import { ReadExcelFile } from "../../servicesApi/ReadExcelFile.services";





// // Configuración de Multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const publicDir = path.join(process.cwd(), "public", "foldercompanies");
//         if (!fs.existsSync(publicDir)) {
//             fs.mkdirSync(publicDir, { recursive: true });
//         }
//         cb(null, publicDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     },
// });

// const upload = multer({ storage });

// const uploadMiddleware = upload.fields([
//     { name: "file", maxCount: 1 },      // Campo único para el archivo principal
//     { name: "pictures", maxCount: 30 }, // Campo múltiple para las imágenes
// ]);

// function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
//     return new Promise((resolve, reject) => {
//         fn(req, res, (result: any) => {
//             if (result instanceof Error) {
//                 return reject(result);
//             }
//             return resolve(result);
//         });
//     });
// }

// // export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// //     if (req.method !== "POST") {
// //         return res.status(405).json({ message: "Método no permitido" });
// //     }

// //     try {
// //         // Ejecutar el middleware de multer
// //         await runMiddleware(req, res, uploadMiddleware);

// //         const files = (req as any).files;

// //         if (!files || !files.file || !files.pictures) {
// //             return res.status(400).json({ message: "El archivo y las imágenes son obligatorios",dataqr:"",namecompaines:"" });
// //         }

// //         const uploadedFile = files.file[0];
// //         const uploadedPictures = files.pictures;


// //         //create Folder 
// //         const { folderName, folderPath } = await CreateFolder(uploadedFile, "public", "foldercompanies")
// //         //Move principal file
// //         const todo = MovePrincipalFile(uploadedFile, folderName, folderPath)


// //         //Move picture files
// //         const picturePaths = await MovePictureFile(uploadedPictures, folderName, folderPath)
// //         console.log("🚀 ~ handler ~ picturePaths:", picturePaths)


// //         const filePath = path.join(process.cwd(), "public", "foldercompanies", folderName, uploadedFile.originalname);

// //         if (!fs.existsSync(filePath)) {
// //             throw new Error(`El archivo no existe en la ruta especificada: ${filePath}`);
// //         }


// //         const returnData = await ReadExcelFile(`foldercompanies/${folderName}/${uploadedFile.originalname}`);

// //         console.log("🚀 ~ handler ~ returnData:", returnData)


// //         const qrDAta = `https://menu-nicocontigliani.netlify.app/companies/${folderName}`



// //         res.status(200).json({
// //             namecompaines: folderName,
// //             dataqr: qrDAta,
// //             message: "Archivos subidos y guardados con éxito",
// //             folderPath: `/foldercompanies/${folderName}`,
// //             files: {
// //                 file: `/foldercompanies/${folderName}/${uploadedFile.originalname}`,
// //                 pictures: picturePaths,
// //             },
// //         });
// //     } catch (error) {
// //         console.error(error);
// //         res.status(500).json({ message: "Error interno del servidor" });
// //     }
// // }

// // export const config = {
// //     api: {
// //         bodyParser: false, // Desactiva el análisis del cuerpo para usar multer
// //     },
// // };


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== "POST") {
//         return res.status(405).json({ message: "Método no permitido" });
//     }

//     try {
//         // Ejecutar el middleware de multer
//         await runMiddleware(req, res, uploadMiddleware);

//         const files = (req as any).files;

//         if (!files || !files.file || !files.pictures) {
//             return res.status(400).json({ message: "El archivo y las imágenes son obligatorios", dataqr: "", namecompaines: "" });
//         }

//         const uploadedFile = files.file[0];
//         const uploadedPictures = files.pictures;

//         // Crear carpeta
//         const { folderName, folderPath } = await CreateFolder(uploadedFile, "public", "foldercompanies");

//         // Mover archivo principal
//         MovePrincipalFile(uploadedFile, folderName, folderPath);

//         // Mover imágenes
//         const picturePaths = await MovePictureFile(uploadedPictures, folderName, folderPath);
//         console.log("🚀 ~ handler ~ picturePaths:", picturePaths);

//         const filePath = path.join(process.cwd(), "public", "foldercompanies", folderName, uploadedFile.originalname);

//         if (!fs.existsSync(filePath)) {
//             throw new Error(`El archivo no existe en la ruta especificada: ${filePath}`);
//         }

//         // Leer todas las hojas del archivo Excel
//         const returnData = await ReadExcelFile(`foldercompanies/${folderName}/${uploadedFile.originalname}`);
//         console.log("🚀 ~ handler ~ returnData:", returnData);

//         // Insertar en MongoDB
//         const client = await clientPromise;
//         const db = client.db("nombre_de_tu_base_de_datos"); // Cambia por el nombre de tu DB
//         for (const [sheetName, data] of Object.entries(returnData)) {
//             const collectionName = `sheet_${sheetName}`;
//             const collection = db.collection(collectionName);

//             if (data.length > 0) {
//                 await collection.insertMany(data);
//                 console.log(`Datos de la hoja "${sheetName}" insertados en la colección "${collectionName}".`);
//             }
//         }

//         const qrData = `https://menu-nicocontigliani.netlify.app/companies/${folderName}`;

//         res.status(200).json({
//             namecompaines: folderName,
//             dataqr: qrData,
//             message: "Archivos subidos, procesados e insertados con éxito",
//             folderPath: `/foldercompanies/${folderName}`,
//             files: {
//                 file: `/foldercompanies/${folderName}/${uploadedFile.originalname}`,
//                 pictures: picturePaths,
//             },
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Error interno del servidor" });
//     }
// }

// export const config = {
//     api: {
//         bodyParser: false, // Desactiva el análisis del cuerpo para usar multer
//     },
// };




import { NextApiRequest, NextApiResponse } from "next";
import multer from "multer";
import fs from "fs";
import path from "path";
import clientPromise from "../../utils/mongodb";
import xlsx from "xlsx";

import { CreateFolder } from "../../servicesApi/CreateFolder.services";
import { MovePrincipalFile } from "../../servicesApi/MovePrincipalFile.services";
import { MovePictureFile } from "../../servicesApi/MovePicturesFile.services";

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const publicDir = path.join(process.cwd(), "public", "foldercompanies");
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

const uploadMiddleware = upload.fields([
    { name: "file", maxCount: 1 },      // Campo único para el archivo principal
    { name: "pictures", maxCount: 30 }, // Campo múltiple para las imágenes
]);

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: Function) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

// Función para leer los datos de todas las hojas del archivo Excel y guardarlos en la base de datos
async function readAndInsertExcelData(filePath: string, folderName: string, fileName: string) {
    const workbook = xlsx.readFile(filePath);
    const allSheetData: { [key: string]: any[] } = {};

    // Procesa cada hoja del Excel
    workbook.SheetNames.forEach((sheetName) => {
        allSheetData[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });

    const companyName = fileName; // El nombre de la empresa es el nombre del archivo (sin extensión)

    const client = await clientPromise;
    const db = client.db("menuDB");

    // Inserta los datos en la colección con el nombre de la empresa y todas las hojas
    await db.collection("companies").insertOne({
        companyName,
        folderName,
        hojas: allSheetData, // Incluye todas las hojas con sus datos
    });

    return { companyName, hojas: allSheetData };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    try {
        // Ejecutar el middleware de multer
        await runMiddleware(req, res, uploadMiddleware);

        const files = (req as any).files;

        if (!files || !files.file || !files.pictures) {
            return res.status(400).json({ message: "El archivo y las imágenes son obligatorios", dataqr: "", namecompaines: "" });
        }

        const uploadedFile = files.file[0];
        const uploadedPictures = files.pictures;

        // Crear carpeta
        const { folderName, folderPath } = await CreateFolder(uploadedFile, "public", "foldercompanies");

        // Mover archivo principal
        await MovePrincipalFile(uploadedFile, folderName, folderPath);

        // Mover imágenes
        const picturePaths = await MovePictureFile(uploadedPictures, folderName, folderPath);

        const filePath = path.join(process.cwd(), "public", "foldercompanies", folderName, uploadedFile.originalname);

        if (!fs.existsSync(filePath)) {
            throw new Error(`El archivo no existe en la ruta especificada: ${filePath}`);
        }

        // Obtener nombre del archivo sin extensión
        const fileNameWithoutExtension = path.parse(uploadedFile.originalname).name;

        // Leer y procesar datos del archivo Excel
        const { companyName, hojas } = await readAndInsertExcelData(filePath, folderName, fileNameWithoutExtension);

        const qrData = `https://menu-nicocontigliani.netlify.app/companies/${folderName}`;

        res.status(200).json({
            namecompaines: companyName,
            dataqr: qrData,
            message: "Archivos subidos y procesados con éxito",
            folderPath: `/foldercompanies/${folderName}`,
            files: {
                file: `/foldercompanies/${folderName}/${uploadedFile.originalname}`,
                pictures: picturePaths,
            },
            hojas, // Devuelve las hojas procesadas en la respuesta
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

export const config = {
    api: {
        bodyParser: false, // Desactiva el análisis del cuerpo para usar multer
    },
};
