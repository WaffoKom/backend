import express from "express";

import { connectToDB } from "./services/bd.connect.js";
import userRoute from "./routes/user.routes.js";
import articleRoute from "./routes/articles.routes.js";
import commentRoute from "./routes/comments.routes.js";
import repliesRoute from "./routes/replises.routes.js";
import googleRoute from "./routes/user.auth.google.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function main() {
  // ... (Code de configuration de l'application)
  app.use("/api/v1", userRoute);
  app.use("/api/v1", articleRoute);
  app.use("/api/v1", commentRoute);
  app.use("/api/v1/", repliesRoute);
  app.use("/api/v1/", googleRoute);

  await connectToDB();

  // ... (Démarrage du serveur)

  app.listen(PORT, () =>
    console.log(`Connexion etablit avec succes au port ${PORT}`)
  );
}

main();
