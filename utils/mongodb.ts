import { MongoClient } from "mongodb";

const localUri = process.env.MONGO_URI_LOCAL || ""; // URI para desarrollo
const atlasUri = process.env.MONGO_URI_ATLAS || ""; // URI para producción

const uri = process.env.NODE_ENV === "development" ? localUri : atlasUri; // Selecciona URI basado en el entorno
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error("Por favor define la variable de entorno adecuada para tu entorno actual.");
}

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usa una conexión global para evitar múltiples conexiones
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // En producción, crea una nueva conexión para cada instancia
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
