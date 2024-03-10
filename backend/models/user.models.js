import mongoose from "mongoose";
import hashPassword from "../services/users/user.hashPassword.js";

const userSchema = new mongoose.Schema({
  // Je met en commentaire au cas ou un systeme prefererait id a _id
  // id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  role: { type: String, enum: ["admin", "user"] },
});

const User = mongoose.model("User", userSchema);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next(); // Continuez l'enregistrement de l'utilisateur
});

// Adapted `authorize` function with error handling and user retrieval:
export function authorize(roles) {
  return async (req, res, next) => {
    const id = req.params.id;
    try {
      // Attempt to retrieve the user from the request
      const user = await User.find({ _id: id });

      if (!user) {
        // User not found (invalid userId or other issue)
        return res.status(401).send("Unauthorized: User not found.");
      }

      if (!roles.includes(user.role)) {
        // User role not authorized
        return res.status(403).send("Accès refusé");
      }

      // Authorized, proceed to the next middleware
      next();
    } catch (error) {
      // Handle potential errors during user retrieval or authorization check
      console.error(error);
      return res.status(500).send("Internal Server Error");
    }
  };
}
export function isAdmin(req, res, next) {
  return authorize(["admin"])(req, res, next);
}

export function isUser(req, res, next) {
  return autoriser(["user"])(req, res, next);
}
export async function getUsers(req, res) {
  const count = await User.countDocuments({});
  // Gérer les erreurs
  try {
    if (count > 0) {
      const users = await User.find();
      res.status(200).json(users);
      return users;
    } else {
      res.status(404).json({ message: "Aucun utilisateur trouve" });
      return null;
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
}

export async function getUserOne(req, res) {
  let id = req.params.id;
  // Gérer les erreurs
  try {
    if (id) {
      console.log(id);
      const user = await User.findOne({ _id: id });
      res.status(200).json(user);
      return user;
    } else {
      res.status(404).json({ message: "Aucun utilisateur trouve" });
      return null;
    }
  } catch (error) {
    res.status(500).json(error);
    console.error(error);
  }
}

export default User;
