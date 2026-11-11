const validateSignup = (req, res, next) => {
  const { nom, login, password } = req.body;

  if (!nom || !login || !password) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs sont requis'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Le mot de passe doit contenir au moins 6 caractères'
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs sont requis'
    });
  }

  next();
};

module.exports = {
  validateSignup,
  validateLogin
};