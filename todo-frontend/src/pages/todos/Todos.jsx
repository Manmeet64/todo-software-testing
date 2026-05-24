import { useEffect, useState } from 'react'
import styles from './Todos.module.css'

const API_URL = 'http://localhost:3001/todos'

function Todos() {

    let [todos, setTodos] = useState([])
    let [newTitle, setNewTitle] = useState('')
    let [newDueDate, setNewDueDate] = useState('')

    // Fetch all todos on component load
    useEffect(() => {
        fetch(API_URL, { method: 'GET' })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setTodos(data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    // Add a new todo
    function handleAdd(event) {
        event.preventDefault()
        if (!newTitle.trim()) return

        fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ title: newTitle.trim(), dueDate: newDueDate ? newDueDate : undefined }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setTodos([data, ...todos])
                setNewTitle('')
                setNewDueDate('')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Toggle completed status
    function toggleComplete(id, currentStatus) {
        fetch(API_URL + '/' + id, {
            method: 'PUT',
            body: JSON.stringify({ completed: !currentStatus }),
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                setTodos(todos.map((todo) => (todo._id === id ? data : todo)))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // Delete a todo by id
    function deleteTodo(id) {
        console.log(id)
        fetch(API_URL + '/' + id, { method: 'DELETE' })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                console.log(data)
                let copyTodos = [...todos]
                let index = copyTodos.findIndex((todo) => {
                    return todo._id === id
                })
                copyTodos.splice(index, 1)
                setTodos(copyTodos)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <section className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.container_title}>Todo List</h1>
            </div>

            {/* Add task form */}
            <form className={styles.addForm} onSubmit={handleAdd} id="add-todo-form">
                <input
                    id="todo-input"
                    type="text"
                    placeholder="Enter task title"
                    className={styles.addInput}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    name="title"
                />
                <input
                    id="todo-due-date"
                    type="date"
                    className={styles.addDateInput}
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    name="dueDate"
                />
                <button id="add-todo-btn" type="submit" className={styles.addBtn}>
                    <i className="fa-solid fa-plus"></i> Add Task
                </button>
            </form>

            {/* Todo list */}
            <table id="todo-table">
                <thead>
                    <tr>
                        <th>Sr No</th>
                        <th>Task</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        todos.map((todo, ind) => {
                            return (
                                <tr key={todo._id} id={'todo-row-' + todo._id} className={todo.completed ? styles.completedRow : ''}>
                                    <td>{ind + 1}</td>
                                    <td className={todo.completed ? styles.completedText : ''}>
                                        {todo.title}
                                    </td>
                                    <td className={todo.completed ? styles.completedText : ''}>
                                        {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={todo.completed}
                                            id={'checkbox-' + todo._id}
                                            onChange={() => {
                                                toggleComplete(todo._id, todo.completed)
                                            }}
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <i
                                                id={'delete-' + todo._id}
                                                className={'fa-solid fa-trash ' + styles.icon_delete}
                                                onClick={() => {
                                                    deleteTodo(todo._id)
                                                }}
                                            ></i>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {todos.length === 0 && (
                <p className={styles.emptyMsg}>No tasks yet. Add one above!</p>
            )}
        </section>
    )
}

export default Todos
