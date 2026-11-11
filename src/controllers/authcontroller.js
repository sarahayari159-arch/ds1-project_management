const { generateToken } = require('../utils/generatetoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// inscription
exports.register = async (req, res) => {
  try {
    const { nom, login, password } = req.body;

    // nverifiw ken fama user b login heka
    const existingUser = await User.findOne({ login });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec ce username existe déjà'
      });
    }

    //nhashiw el password / hash moch cryptage 3la 5atrou one way ma3neha matnajmch tdecryptih
    const hashedPassword = await bcrypt.hash(password, 10);

    // creation mta3 user jdid
    const user = await User.create({
      nom,
      login,
      password: hashedPassword
    });

    const token = generateToken(user._id, user.login, user.role);

    return res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      token
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Login ou mot de passe incorrect'
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Login ou mot de passe incorrect'
      });
    }

    const token = generateToken(user._id, user.role,user.login);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token: token,
        user: {
          id: user._id,
          nom: user.nom,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};