import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: '',
    }
    this.submitForm = this.submitForm.bind(this);
    this.updateTask = this.updateTask.bind(this);
  }

  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', tasks => {
      this.updateData(tasks)
    })
    this.socket.on('addTask', task => {
      this.addTask(task)
    });
    this.socket.on('removeTask', id =>
      this.removeTask(id)
    );
  }

  removeTask(id) {
    this.setState({
      tasks: this.state.tasks.filter(item => item !== id)
    })
    this.socket.emit('removeTask', id)
  }

  updateData(tasks) {
    this.setState({
      tasks: tasks
    })
  }

  updateTask(event) {
    this.setState({
      taskName: event.target.value
    });
  }

  addTask(task) {
    this.setState({
      tasks: [...this.state.tasks, task],
    })
  }

  submitForm(event) {
    event.preventDefault();
    this.addTask(this.state.taskName)
    this.socket.emit('addTask', this.state.taskName)
  }

  render() {
    
    const { tasks } = this.state;
    
    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(item => (
              <li className="task" key={item}>
                {item}
                <button
                  className="btn btn--red"
                  onClick={() => this.removeTask(item)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
    
          <form id="add-task-form" onSubmit={this.submitForm}>
            <input
              className="text-input"
              autoComplete="off"
              type="text"
              placeholder="Type your description"
              id="task-name"
              value={this.taskName}
              onChange={this.updateTask} />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };
};

export default App;