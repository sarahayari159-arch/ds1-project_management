const express = require('express');
const router = express.Router();

const Task = require('../controllers/taskcontroller');
const { authenticate } = require('../middleware/auth');

router.post('/add-task', authenticate, Task.addTask);
router.get('/get-tasks', authenticate, Task.getTasks);
router.put('/update-task/:id', authenticate, Task.editTask);
//router.delete('/delete-task/:id', authenticate, Task.deleteTask);


module.exports = router;
