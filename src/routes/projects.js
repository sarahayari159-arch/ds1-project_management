const express = require('express');
const router = express.Router();

const Project = require('../controllers/projectcontroller');
const { authenticate } = require('../middleware/auth');



router.post('/add-project', authenticate, Project.addProject);
router.get('/get-projects', authenticate, Project.getProjects);
router.put('/update-project/:id', authenticate, Project.editProject);
router.delete('/delete-project/:id', authenticate, Project.deleteProject);

/* routes lel search wel filtering mta3 lprojects 

?search=nom&status=statut&sortBy=champ&order=asc|desc

- search : tekteb esm lprojet li 7ab tlawj 3lih
- status : tekteb statut (en cours, terminé, en pause)
- sortBy : createdAt, statut
- order :  asc, desc


tnajm tcombini les filtres lkol m3a search fard request
kifma tnajm tappliqui filtre we7d wala 9ad mat7eb

*/
module.exports = router;
