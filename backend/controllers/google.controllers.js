import passport from "passport";

async function googleLogin(req, res, next) {
  try {
    await passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );

    if (req.isAuthenticated()) {
      const user = req.user;
      const token = await generateToken(user);

      // Définir le cookie avec le jeton JWT
      res.cookie("token", token, { httpOnly: true, secure: true });

      // Rediriger vers l'application
      res.redirect("/");
    }
  } catch (err) {
    // Gérer les erreurs d'authentification
    console.error(err);
    res.status(500).json({ message: "Une erreur est survenue." });
  }
}

async function googleCallback(req, res, next) {
  try {
    await passport.authenticate("google", { failureRedirect: "/" })(
      req,
      res,
      next
    );

    if (req.isAuthenticated()) {
      const user = req.user;
      const token = await generateToken(user);

      // Définir le cookie avec le jeton JWT
      res.cookie("token", token, { httpOnly: true, secure: true });

      // Rediriger vers l'application
      res.redirect("/");
    }
  } catch (err) {
    // Gérer les erreurs d'authentification
    console.error(err);
    res.status(500).json({ message: "Une erreur est survenue." });
  }
}

function logout(req, res) {
  req.logout(); // Supprime la session avec Passport
  res.redirect("/");
}

const authenticateJWT = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  const bearer = token.split(" ");
  const tokenWithoutBearer = bearer[1];

  jsonwebtoken.verify(
    tokenWithoutBearer,
    process.env.JWT_SECRET,
    (err, decoded) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }

      req.user = decoded;
      next();
    }
  );
};

export { googleCallback, googleLogin, logout, authenticateJWT };
