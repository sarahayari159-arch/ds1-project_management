const express = require('express');
const app = express();

app.use(express.json());


//const authRoutes = require('./routes/auth');
//const projectRoutes = require('./routes/projects');
//const taskRoutes = require('./routes/tasks');


/* ndefiniew les 3 routes principales mta3 l'API: auth, projects, tasks
== auth lel sign up w login 
== project lel les operations CRUD 3al projects
== tasks lel les operations CRUD + assignments 3al tasks*/ 

//app.use('/api/auth', authRoutes);
//app.use('/api/projects', projectRoutes);
//app.use('/api/tasks', taskRoutes);

// 404 handler ken l user 3adda request b route mch mawjouda
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


module.exports = app;