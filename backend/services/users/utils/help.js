import jwt from "jsonwebtoken";

const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const secret = process.env.JWT_SECRET;
  const options = {
    expiresIn: "1h", // Durée de vie du jeton (modifiable)
  };

  return jwt.sign(payload, secret, options);
};

export { generateToken };
