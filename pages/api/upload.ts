import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";
import uploadMiddleware from "../../middlewares/uploadMiddleware";
import runMiddleware from "../../middlewares/runMiddleware";
import { CreateFolder } from "../../servicesApi/CreateFolder.services";
import { MovePrincipalFile } from "../../servicesApi/MovePrincipalFile.services";
import { MovePictureFile } from "../../servicesApi/MovePicturesFile.services";
import { readAndInsertExcelData } from "../../servicesApi/excelService";


export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Método no permitido" });
    }

    try {
        await runMiddleware(req, res, uploadMiddleware);
        const files = (req as any).files;

        if (!files || !files.file || !files.pictures) {
            return res.status(400).json({ message: "El archivo y las imágenes son obligatorios" });
        }

        const uploadedFile = files.file[0];
        const uploadedPictures = files.pictures;

        const { folderName, folderPath } = await CreateFolder(uploadedFile, "public", "foldercompanies");
        await MovePrincipalFile(uploadedFile, folderName, folderPath);
        const picturePaths = await MovePictureFile(uploadedPictures, folderName, folderPath);

        const filePath = path.join(process.cwd(), "public", "foldercompanies", folderName, uploadedFile.originalname);

        if (!fs.existsSync(filePath)) {
            throw new Error(`El archivo no existe: ${filePath}`);
        }

        const fileNameWithoutExtension = path.parse(uploadedFile.originalname).name;
        const { companyName, hojas } = await readAndInsertExcelData(filePath, folderName, fileNameWithoutExtension);

        res.status(200).json({
            namecompaines: companyName,
            dataqr: `https://menu-nicocontigliani.netlify.app/companies/${folderName}`,
            message: "Archivos subidos y procesados con éxito",
            folderPath: `/foldercompanies/${folderName}`,
            files: { file: `/foldercompanies/${folderName}/${uploadedFile.originalname}`, pictures: picturePaths },
            hojas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor", error: error.message });
    }
}

