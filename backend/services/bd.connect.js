import mongoose from "mongoose";

export async function connectToDB() {
  const mongoDBURL = "mongodb://localhost:27017/blog-project";

  try {
    const db = await mongoose.connect(mongoDBURL);
    console.log("Connecté à la base de données MongoDB");
    return db;
  } catch (error) {
    console.error("Erreur de connexion à la base de données :", error);
    return false;
  }
}

export async function closeConnexion() {
  await mongoose.connection.close();
  console.log("Connexion à la base de données fermée");
}
