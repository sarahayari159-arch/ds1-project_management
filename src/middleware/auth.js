const { verifyToken } = require('../utils/generatetoken');
const { User } = require('../models');

// middleware pour verifier si l utilisateur est authentifié
exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié. Token manquant.'
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        code: 'TOKEN_INVALID',
        message: 'Token invalide ou expiré.'
      });
    }

    if (decoded.token_type !== 'session') {
      return res.status(401).json({
        success: false,
        message: 'Token de session invalide.'
      });
    }

    // recuperer les infos de l utilisateur
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    req.user = {
      id: user._id,
      login: user.login,
      role: user.role
    };

    next();

  } catch (error) {
    console.error('Erreur authentification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'authentification.'
    });
  }
};

// nverifiw m3a kol requete ken l utilisateur manager
exports.requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'manager') {
    return res.status(403).json({
      success: false,
      message: 'Accès refusé. Droits manager requis.'
    });
  }

  next();
};