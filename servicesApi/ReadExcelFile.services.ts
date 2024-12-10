import path from "path";
import fs from "fs";
import * as XLSX from "xlsx";

export async function ReadExcelFile(filePath: string): Promise<Record<string, any[]>> {
    try {
        const absolutePath = path.join(process.cwd(), "public", filePath);
        const fileBuffer = fs.readFileSync(absolutePath);
        const workbook = XLSX.read(fileBuffer, { type: "buffer" });

        const data: Record<string, any[]> = {};
        workbook.SheetNames.forEach((sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            data[sheetName] = XLSX.utils.sheet_to_json(sheet);
        });

        return data; // Devuelve un objeto con los nombres de las hojas como claves y los datos como valores.
    } catch (error) {
        console.error("Error al leer el archivo Excel:", error);
        throw new Error("No se pudo leer el archivo Excel.");
    }
}
