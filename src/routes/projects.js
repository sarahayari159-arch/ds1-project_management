const express = require('express');
const router = express.Router();

const Project = require('../controllers/projectcontroller');
const { authenticate } = require('../middleware/auth');



router.post('/add-project', authenticate, Project.addProject);
router.get('/get-projects', authenticate, Project.getProjects);
router.put('/update-project/:id', authenticate, Project.editProject);
router.delete('/delete-project/:id', authenticate, Project.deleteProject);



module.exports = router;
