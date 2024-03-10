import mongoose from "mongoose";

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true,
  },
  slug: { type: String, required: true },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  publishedAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  deletedAt: {
    type: Date,
  },
  image: {
    type: String,
  },
  summary: {
    type: String,
  },
  status: {
    type: String,
    enum: ["brouillon", "publié", "archivé", "En attente"],
    default: "brouillon",
  },
  statusHistory: [
    {
      previousStatus: {
        type: String,
        enum: ["brouillon", "publié", "archivé", "En attente"],
      },
      newStatus: {
        type: String,
        enum: ["brouillon", "publié", "archivé", "En attente"],
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  nb_views: { type: Number, default: 0 },
});
const Article = mongoose.model("Article", articleSchema);

// Générer un slug automatiquement avant de sauvegarder l'article
articleSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = slugify(this.title);
  }
  next();
});

// Middleware pour s'assurer que l'article est publié avant de l'afficher
function isPublished(req, res, next) {
  if (req.article.status !== "publié") {
    return res.status(404).send("Article non trouvé");
  }
  next();
}
// Recherche des articles
async function getArticles(req, res) {
  const { page = 1, limit = 10 } = req.query;

  try {
    const articles = await Article.find({ deletedAt: null })
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json({ articles });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des articles" });
  }
}
// REcherche des articles par id * Reserver au blog-admin *
async function getArticleById(req, res) {
  const { id } = req.params;

  try {
    const article = await Article.findOne({ _id: id });
    if (!article) {
      return res.status(404).json({ error: "Article introuvable" });
    }
    res.status(200).json({ article });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'article" });
  }
}

async function searchArticles(req, res) {
  const { query } = req.query;

  try {
    // Vous pouvez utiliser différentes stratégies de recherche en fonction de vos besoins
    // Voici un exemple de recherche par titre et contenu
    const articles = await Article.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
      deletedAt: null,
    });
    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la recherche d'articles" });
  }
}

// Gestion du nombre de vue fait pour le nombre d'article

async function incrementViews(articleId) {
  // Incrémenter le nombre de vues
  const updatedArticle = await Article.findOneAndUpdate(
    { _id: articleId },
    { $inc: { nb_views: 1 } },
    { new: true }
  );

  // Gérer les erreurs
  if (!updatedArticle) {
    throw new Error("Article introuvable");
  }

  return updatedArticle;
}

export default Article;

export {
  getArticles,
  getArticleById,
  searchArticles,
  isPublished,
  incrementViews,
};
