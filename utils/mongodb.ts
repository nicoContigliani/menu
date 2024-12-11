// import { MongoClient } from "mongodb";

// const localUri = process.env.MONGO_URI_LOCAL || ""; // URI para desarrollo
// const atlasUri = process.env.MONGO_URI_ATLAS || ""; // URI para producción

// const uri = process.env.NODE_ENV === "development" ? localUri : atlasUri; // Selecciona URI basado en el entorno
// const options = {};

// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (!uri) {
//   throw new Error("Por favor define la variable de entorno adecuada para tu entorno actual.");
// }

// if (process.env.NODE_ENV !== "development") {
//   // En desarrollo, usa una conexión global para evitar múltiples conexiones
//   if (!(global as any)._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     (global as any)._mongoClientPromise = client.connect();
//   }
//   clientPromise = (global as any)._mongoClientPromise;
// } else {
//   // En producción, crea una nueva conexión para cada instancia
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export default clientPromise;


import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGO_URI_ATLAS;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;