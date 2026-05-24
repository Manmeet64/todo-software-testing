import { Router } from 'express'
import mongoose from 'mongoose'
import Todo from '../models/Todo.js'

const router = Router()

// GET /todos — fetch all todos sorted newest first
router.get('/', async (_req, res) => {
    try {
        const todos = await Todo.find({ disabled: { $ne: true } }).sort({ createdAt: -1 })
        res.json(todos)
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch todos', error: error.message })
    }
})

// POST /todos — create a new todo
router.post('/', async (req, res) => {
    try {
        const { title, dueDate } = req.body

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Title is required' })
        }

        const todo = await Todo.create({ title: title.trim(), dueDate })
        res.status(201).json(todo)
    } catch (error) {
        res.status(400).json({ message: 'Failed to create todo', error: error.message })
    }
})

// PUT /todos/:id — update title and/or toggle completed
router.put('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid todo id' })
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            req.params.id,
            {
                ...(req.body.title !== undefined && { title: req.body.title }),
                ...(req.body.completed !== undefined && { completed: req.body.completed }),
                ...(req.body.dueDate !== undefined && { dueDate: req.body.dueDate })
            },
            { new: true, runValidators: true }
        )

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' })
        }

        res.json(updatedTodo)
    } catch (error) {
        res.status(400).json({ message: 'Failed to update todo', error: error.message })
    }
})

// DELETE /todos/:id — delete a todo by id (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid todo id' })
        }

        const deletedTodo = await Todo.findByIdAndUpdate(req.params.id, { disabled: true })

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' })
        }

        res.json({ message: 'Todo deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete todo', error: error.message })
    }
})

export default router
