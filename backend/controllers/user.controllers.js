import User from "../models/user.models.js";
// import { faker } from "@faker-js/faker";
export default async function addUser(req, res) {
  try {
    const user = new User(req.body);
    await user.save();
    // res.status(201).send({ message: "Utilisateur enregistrer avec succes !" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}

export async function updateUser(req, res) {
  const { name, email, password } = req.body;
  const id = req.params.id;

  if (!req.body) {
    res.status(404).json({ error: "Le corps de la requete est vide" });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          name,
          email,
          password,
        },
      },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    // Gérez les erreurs de manière appropriée
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deleteUser(req, res) {
  const { name, email, password } = req.body;
  const id = req.params.id;

  if (!req.body) {
    res.status(404).json({ error: "Le corps de la requete est vide" });
  }

  try {
    const deletedUser = await User.findOneAndDelete(
      { _id: id },
      {
        $set: {
          name,
          email,
          password,
        },
      },
      { new: true }
    );
    if (deletedUser) {
      res.status(200).json(deletedUser);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    // Gérez les erreurs de manière appropriée
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}

export async function deleteAllUsers(req, res) {
  try {
    const deletedUsers = await User.deleteMany({});
    if (deletedUsers) {
      res.status(200).json(deletedUsers);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    // Gérez les erreurs de manière appropriée
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
}
