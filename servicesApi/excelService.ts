import xlsx from "xlsx";
import clientPromise from "../utils/mongodb";

export async function readAndInsertExcelData(filePath: string, folderName: string, fileName: string) {
    const workbook = xlsx.readFile(filePath);
    const allSheetData: { [key: string]: any[] } = {};

    workbook.SheetNames.forEach((sheetName) => {
        allSheetData[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });

    const client = await clientPromise;
    const db = client.db("menuDB");
    const companies = db.collection("companies");

    const companyName = fileName;
    const existingCompany = await companies.findOne({ companyName });

    if (existingCompany) {
        await companies.updateOne(
            { companyName },
            { $set: { folderName, hojas: allSheetData } }
        );
        console.log(`Updated existing company: ${companyName}`);
    } else {
        await companies.insertOne({ companyName, folderName, hojas: allSheetData });
        console.log(`Inserted new company: ${companyName}`);
    }

    return { companyName, hojas: allSheetData };
}
