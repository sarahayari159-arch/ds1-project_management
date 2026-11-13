const { Project ,Task } = require('../models');



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

        const project = await Project.findOne({ _id: id, isDeleted: false });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projet non trouvé.'
            });
        }
        
        // nchoufou ken l user li y7eb ybadel lproject request houwa l owner
        if (project.proprietaire.toString() !== req.user.id.toString()) {
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
        const project = await Project.findOne({ _id: id, isDeleted: false });
        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Projet non trouvé.'
            });
        }

        // nchoufou ken l user howa l owner mta3 lprojet
        if (project.proprietaire.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Accès refusé. Vous n\'êtes pas le propriétaire du projet.'
            });
        }


        project.isDeleted = true;
        // delete all tasks associated with the project
        await Task.updateMany(
            { projet: id, isDeleted: false },
            { $set: { isDeleted: true, updatedAt: new Date() } }
            );
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
/* fel filtering/recherche 5tart deux filtres : nom w statut 7asb amahou lprojet lurgent akthr 
donc lprojeyet li en cours chyothhrou lwela */
exports.getProjects = async (req, res) => {
    try {
        const { search, status, sortBy, order } = req.query;

        let filter = { isDeleted: false };

        // recherche b nom
        if (search) {
            filter.nom = { $regex: search, $options: 'i' };
        }

        // recherche b status
        if (status) {
            filter.statut = status;
        }

        // contrainte : lmanager yhchouf lprojects lkol ama luser ychouf ken les projets mte3ou
        if (req.user.role !== 'manager') {
            filter.proprietaire = req.user.id;
        }

        const direction = order === 'desc' ? -1 : 1;

        let projects;
        
        // lena nofrthou l order mte3na mta3 lstatus : en cours > en pause > terminé
        if (sortBy === 'statut') {
            projects = await Project.aggregate([
                { $match: filter },
                {
                    $addFields: {
                        statusPriority: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ['$statut', 'en cours'] }, then: 1 },
                                    { case: { $eq: ['$statut', 'en pause'] }, then: 2 },
                                    { case: { $eq: ['$statut', 'terminé'] }, then: 3 }
                                ],
                                default: 4
                            }
                        }
                    }
                },
                { $sort: { statusPriority: direction } },
                { $project: { statusPriority: 0 } }
            ]);
        } else {
            const sortField = sortBy === 'createdAt' ? 'createdAt' : 'createdAt';

            projects = await Project.find(filter)
                .sort({ [sortField]: direction });
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