const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors =  require('cors')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({
   origin:"*", 
   methods:["GET","POST","PUT","DELETE"] 
}))

// Conexión a la base de datos MongoDB
const dbConnect = () =>{
    try{
        mongoose.connect('mongodb://localhost:27017/todo_list_db')
            .then(() => {
                console.log("conectado a la base de datos")
            })
    }catch(error){
        console.log("errorcito: ", error.message)
    }
}

dbConnect()

// Definir el modelo de tarea
const Task = mongoose.model('Task', {
    text: String,
    completed: Boolean,
});

app.get('/api/tasks', async (req, res) => {
    try {
        const findTask = await Task.find();
        res.status(201).json(findTask);
    } catch (error) {
        res.status(400).json({ error: 'Error adding task' });
    }
});

// Agregar una nueva tarea
app.post('/api/tasks', async (req, res) => {
    const newTask = new Task({
        text: req.body.text,
        completed: false,
    });

    try {
        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(400).json({ error: 'Error adding task' });
    }
});

// Marcar una tarea como completada
app.put('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndUpdate(
            req.params.id,
            { completed: true },
            { new: true }
        );
        res.json({ message: 'Task completed' });
    } catch (error) {
        res.status(400).json({ error: 'Error updating task' });
    }
});

// Eliminar una tarea
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndRemove(req.params.id);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(400).json({ error: 'Error deleting task' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

