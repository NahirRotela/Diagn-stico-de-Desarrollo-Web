import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tasks');
      //console.log(response.json())
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
};

  const addTask = async () => {
    if (newTaskText) {
      try {
        const response = await axios.post('http://localhost:5000/api/tasks', {
          text: newTaskText,
        });
        setTasks([...tasks, response.data]);
        setNewTaskText('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleComplete = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${id}`);
      console.log(response.data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      console.log(response.data)
      const updatedTasks = tasks.filter((task) => task._id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };
  return (
    <div className="App">
      <h1>ToDo List</h1>
      <div className="task-form">
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Enter a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id}>
            <span
              className={task.completed ? 'completed' : null}
              onClick={() => toggleComplete(task._id)}
            >
              {task.text}
            </span>
            <button onClick={() => toggleComplete(task._id)}>Completar</button>
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

