document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompleted = document.getElementById('clear-completed');
    const appDate = document.getElementById('app-date');

    // Display current date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    appDate.textContent = new Date().toLocaleDateString('en-US', options);

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        render();
    }

    function render() {
        todoList.innerHTML = '';
        
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="checkbox-container">
                    <div class="checkbox" onclick="toggleTodo(${index})"></div>
                </div>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${index})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            `;
            
            todoList.appendChild(li);
        });

        const activeTodos = todos.filter(t => !t.completed).length;
        itemsLeft.textContent = `${activeTodos} item${activeTodos !== 1 ? 's' : ''} left`;
    }

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = todoInput.value.trim();
        if (text) {
            todos.push({ text, completed: false });
            todoInput.value = '';
            saveAndRender();
        }
    });

    window.toggleTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        saveAndRender();
    };

    window.deleteTodo = (index) => {
        todos.splice(index, 1);
        saveAndRender();
    };

    clearCompleted.addEventListener('click', () => {
        todos = todos.filter(t => !t.completed);
        saveAndRender();
    });

    render();
});
