const { Task } = require('../models');
const { Project } = require('../models');
const User = require('../models/user');
const mongoose = require('mongoose');

//task creation : ay user authenticated ynajm ycreati task fi projet mte3ou
exports.addTask = async (req, res) => {
  try {
    const { titre, description, statut, deadline, projet } = req.body;

    /* puisque lcreation mta3 tasks marbouta bel lprojet, 
    lezem nthabtou ken lprojet li bech n7otou fih ltask mawjoud wala mfasa5*/
    const project = await Project.findOne({
      _id: projet,
      isDeleted: false
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Projet non trouvé.'
      });
    }
    // bech mayjich user yzid task fi projet mta3 user e5er
    if (project.proprietaire.toString() !== req.user.id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'Vous ne pouvez créer une tâche que dans vos propres projets.'
        });
    }
    const task = new Task({
      titre,
      description,
      statut,
      deadline,
      projet,
      creator: req.user.id
    });

    await task.save();

    res.status(201).json({
      success: true,
      message: 'Tâche créée avec succès.',
      task
    });

  } catch (error) {
    console.error('Erreur création tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de la tâche.'
    });
  }
};

//task edition : lezem tkoun l owner mta3 ltask li bech tbadlou

exports.editTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description, statut, deadline } = req.body;

    const task = await Task.findOne({ _id: id, isDeleted: false });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tâche non trouvée.'
      });
    }

    // nchoufou ken l user li y7eb ybadel lproject request houwa l owner
    const project = await Project.findOne({
      _id: task.projet,
      proprietaire: req.user.id,
      isDeleted: false
    });

    if (!project) {
      return res.status(403).json({
        success: false,
        message: 'Accès refusé.'
      });
    }

    //ken l user mabadelch les champs lkol fi request, nupdatiw ken les champs li baddelhom
    if (titre !== undefined) task.titre = titre;
    if (description !== undefined) task.description = description;
    if (statut !== undefined) task.statut = statut;
    if (deadline !== undefined) task.deadline = deadline;

    task.updatedAt = Date.now();
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Tâche mise à jour avec succès.',
      task
    });

  } catch (error) {
    console.error('Erreur édition tâche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'édition de la tâche.'
    });
  }
};

//task deletion : lezem tkoun l owner mta3 ltask li bech tfas5ou
exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        const task = await Task.findOne({
            _id: id,
            isDeleted: false
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tâche non trouvée.'
            });
        }

        const project = await Project.findOne({
            _id: task.projet,
            isDeleted: false
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projet non trouvé.'
            });
        }

        if (project.proprietaire.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé. Vous n\'êtes pas le propriétaire du projet.'
            });
        }
        if (task.creator.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé. Vous n’êtes pas le créateur de la tâche.'
            });
        }
        task.isDeleted = true;
        task.updatedAt = Date.now();
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Tâche supprimée avec succès.'
        });

    } catch (error) {
        console.error('Erreur suppression tâche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression de la tâche.'
        });
    }
};


//get all tasks : ay user ynajm ychouf les tasks mte3ou ama lmanager ynajm ychouf ltasks lkol
exports.getTasks = async (req, res) => {
    try {
        const { search, statut, projet, sortBy, order } = req.query;

        let filter = { isDeleted: false };

        // recherche b titre
        if (search) {
            filter.titre = { $regex: search, $options: 'i' };
        }

        // recherche b statut
        if (statut) {
            filter.statut = statut;
        }

        // recherche bel id mta3 lprojet bch y5arj les tasks mte3ou lkol 
        if (projet) {
            filter.projet = projet;
        }

        if (req.user.role === 'manager') {
        
        /* lena chnretriviw l ids mta3 les projets mta3 l user li 3mal request
        bech nretourniwlou les taches mta3 projeyetou kahaw */
        } else {
            const projects = await Project.find({
                proprietaire: req.user.id,
                isDeleted: false
            }).select('_id');

            const projectIds = projects.map(project => project._id);

            // l user ynajm ychouf tasks mte3ou wli assigned lih zeda
            filter.$or = [
                { projet: { $in: projectIds } },
                { utilisateurAssigne: req.user.id }
            ];
        }

        const direction = order === 'asc' ? 1 : -1;

        let tasks;

        if (sortBy === 'statut') {
            const priority = {
                todo: 1,
                doing: 2,
                done: 3
            };

            tasks = await Task.find(filter);

            tasks.sort((a, b) => {
                return (priority[a.statut] - priority[b.statut]) * direction;
            });

        } else {
            const sortField = ['deadline', 'createdAt'].includes(sortBy)
                ? sortBy
                : 'createdAt';

            tasks = await Task.find(filter)
                .sort({ [sortField]: direction });
        }

        res.status(200).json({
            success: true,
            message: 'Tâches récupérées avec succès.',
            tasks
        });

    } catch (error) {
        console.error('Erreur récupération tâches:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des tâches.'
        });
    }
};

// only a manager can assign a task to a user by using requireAdmin middleware
exports.assignTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'L\'ID de l\'utilisateur est requis pour assigner la tâche.'
            });
        }
        // nvalidiw lformat mta3 l user id w task id bech nevitiw 500 error
        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de tâche ou d\'utilisateur invalide.'
            });
        }
        const task = await Task.findOne({ _id: id, isDeleted: false });
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Tâche non trouvée.'
            });
        }
        // nchoufou ken l user mawjoud wale 9bal ma nassigniwou task lih 
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur non trouvé.'
            });
        }
        task.utilisateurAssigne = user._id;
        task.updatedAt = new Date();
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Tâche assignée avec succès.',
            task
        });
    } catch (error) {
        console.error('Erreur assignation tâche:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de l\'assignation de la tâche.'
        });
    }
};
