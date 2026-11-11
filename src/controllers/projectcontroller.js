const { Project } = require('../models');



//project creation : ay user authenticated ynajm ycreati projet
exports.addProject = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;
    const project = new Project({
        nom,
        description,
        proprietaire: req.user.id,
        statut
        });
    await project.save();
    res.status(201).json({
      success: true,
      message: 'Projet créé avec succès.',
      project
    });
  } catch (error) {
    console.error('Erreur création projet:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création du projet.'
    });
  }
};

//project edition : lezem tkoun l owner mta3 lproject li bech tbadlou
exports.editProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, description, statut } = req.body;

        const project = await Project.findById(id, { isDeleted: false });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projet non trouvé.'
            });
        }
        
        // nchoufou ken l user li y7eb ybadel lproject request houwa l owner
        if (project.proprietaire.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé. Vous n\'êtes pas le propriétaire du projet.'
            });
        }
        
        //ken l user mabadelch les champs lkol fi request, nupdatiw ken les champs li baddelhom
        if (nom !== undefined) project.nom = nom;
        if (description !== undefined) project.description = description;
        if (statut !== undefined) project.statut = statut;

        project.updatedAt = Date.now();
        await project.save();
        

        res.status(200).json({
            success: true,
            message: 'Projet mis à jour avec succès.',
            project
        });
    } catch (error) {
        console.error('Erreur édition projet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de l\'édition du projet.'
        });
    }
};

//delete project : ken l owner mta3 lprojet ynajm yfasa5 lprojet mte3ou
exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id, { isDeleted: false });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projet non trouvé.'
            });
        }

        // nchoufou ken l user howa l owner mta3 lprojet
        if (project.proprietaire.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé. Vous n\'êtes pas le propriétaire du projet.'
            });
        }

        project.isDeleted = true;
        await project.save();

        res.status(200).json({
            success: true,
            message: 'Projet supprimé avec succès.'
        });
    } catch (error) {
        console.error('Erreur suppression projet:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la suppression du projet.'
        });
    }
};  

//get all projects : ay user ynajm ychouf les projets mte3ou ama lmanager ynajm ychouf lprojects lkol
exports.getProjects = async (req, res) => {
    try {
        let projects;
        if (req.user.role === 'manager') {
            projects = await Project.find({ isDeleted: false });
        } else {
            projects = await Project.find({ proprietaire: req.user.id, isDeleted: false });
        }
        res.status(200).json({
            success: true,
            message: 'Projets récupérés avec succès.',
            projects
        });
    } catch (error) {
        console.error('Erreur récupération projets:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur serveur lors de la récupération des projets.'
        });
    }
};  