const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

app.use((req, res) => {
    res.status(404).send({
        message: 'Not found...'
    });
});

const io = socket(server);

io.on('connection', socket => {
    socket.emit('updateData', tasks);
    socket.on('addTask', task => {
      tasks.push(task);
      socket.broadcast.emit('addTask', task);
    });
    socket.on('removeTask', id => {
        const item = tasks.find(item => item.id == id);
        const index = tasks.indexOf(item);
        tasks.splice(index, 1);

        socket.broadcast.emit('updateData', tasks);
      });
  });