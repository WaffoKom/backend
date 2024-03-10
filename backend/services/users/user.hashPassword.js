import bcrypt from "bcrypt";

export default async function hashPassword(password) {
  const saltRounds = 10; // Ajustez le facteur de coût si nécessaire (valeurs plus élevées augmentent la sécurité mais ralentissent le processus)
  const hash = await bcrypt.hash(password, saltRounds);
  return hash;
}
