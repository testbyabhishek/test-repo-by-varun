document.addEventListener('DOMContentLoaded', () => {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const itemsLeft = document.getElementById('items-left');
    const clearCompleted = document.getElementById('clear-completed');
    const appDate = document.getElementById('app-date');
    const progressBar = document.getElementById('progress-bar');
    const emptyState = document.getElementById('empty-state');
    const themeToggle = document.getElementById('theme-toggle');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Theme Management
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // Date display
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    appDate.textContent = new Date().toLocaleDateString('en-US', options);

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    function saveAndRender() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateProgress();
        render();
    }

    function updateProgress() {
        if (todos.length === 0) {
            progressBar.style.width = '0%';
            return;
        }
        const completedCount = todos.filter(t => t.completed).length;
        const percentage = (completedCount / todos.length) * 100;
        progressBar.style.width = `${percentage}%`;
    }

    function render() {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'active') return !todo.completed;
            if (currentFilter === 'completed') return todo.completed;
            return true;
        });

        if (filteredTodos.length === 0) {
            emptyState.style.display = 'block';
            if (currentFilter === 'all' && todos.length === 0) {
                emptyState.querySelector('p').textContent = 'All clear! Add a task to get started.';
            } else {
                emptyState.querySelector('p').textContent = `No ${currentFilter} tasks found.`;
            }
        } else {
            emptyState.style.display = 'none';
        }

        filteredTodos.forEach((todo) => {
            // Find actual index in global todos array
            const actualIndex = todos.indexOf(todo);
            
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="checkbox-container">
                    <div class="checkbox" onclick="toggleTodo(${actualIndex})"></div>
                </div>
                <span class="todo-text" ondblclick="editTodo(${actualIndex}, this)">${todo.text}</span>
                <button class="delete-btn" onclick="deleteTodo(${actualIndex})">
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

    window.editTodo = (index, element) => {
        const currentText = todos[index].text;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'todo-edit-input';
        input.value = currentText;
        
        const parent = element.parentElement;
        parent.replaceChild(input, element);
        input.focus();

        const finishEdit = () => {
            const newText = input.value.trim();
            if (newText && newText !== currentText) {
                todos[index].text = newText;
                saveAndRender();
            } else {
                render(); // Just restore original if empty or unchanged
            }
        };

        input.addEventListener('blur', finishEdit);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') finishEdit();
        });
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    clearCompleted.addEventListener('click', () => {
        todos = todos.filter(t => !t.completed);
        saveAndRender();
    });

    updateProgress();
    render();
});
