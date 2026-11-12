const express = require('express');
const router = express.Router();

const Task = require('../controllers/taskcontroller');
const { authenticate , requireAdmin} = require('../middleware/auth');

router.post('/add-task', authenticate, Task.addTask);
router.get('/get-tasks', authenticate, Task.getTasks);
router.put('/update-task/:id', authenticate, Task.editTask);
//router.get('/get-task/:id', authenticate, Task.getTaskById);
router.delete('/delete-task/:id', authenticate, Task.deleteTask);
router.put('/assign-task/:id', authenticate, requireAdmin, Task.assignTask);


module.exports = router;
