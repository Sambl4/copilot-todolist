import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Todo, CreateTodoRequest, UpdateTodoRequest, toPrismaCategory, fromPrismaCategory } from '../types/todo';
import prisma from '../services/database';

const router = Router();

// GET /api/todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    // Convert Prisma format to API format
    const apiTodos = todos.map(todo => ({
      ...todo,
      category: fromPrismaCategory(todo.category)
    }));
    
    res.json(apiTodos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET /api/todos/:id - Get a specific todo
router.get('/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: req.params.id }
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    const apiTodo = {
      ...todo,
      category: fromPrismaCategory(todo.category)
    };
    
    res.json(apiTodo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// POST /api/todos - Create a new todo
router.post('/', async (req, res) => {
  try {
    const { title, description, category }: CreateTodoRequest = req.body;
    
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    if (!category || !['start-doing', 'do-differently', 'keep-doing'].includes(category)) {
      return res.status(400).json({ error: 'Valid category is required' });
    }

    const newTodo = await prisma.todo.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        category: toPrismaCategory(category),
      }
    });

    const apiTodo = {
      ...newTodo,
      category: fromPrismaCategory(newTodo.category)
    };

    res.status(201).json(apiTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /api/todos/:id - Update a todo
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, completed }: UpdateTodoRequest = req.body;
    
    // Check if todo exists
    const existingTodo = await prisma.todo.findUnique({
      where: { id: req.params.id }
    });
    
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    // Validate inputs
    if (title !== undefined && title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }

    if (category !== undefined && !['start-doing', 'do-differently', 'keep-doing'].includes(category)) {
      return res.status(400).json({ error: 'Invalid category' });
    }

    // Prepare update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (category !== undefined) updateData.category = toPrismaCategory(category);
    if (completed !== undefined) updateData.completed = completed;

    const updatedTodo = await prisma.todo.update({
      where: { id: req.params.id },
      data: updateData
    });

    const apiTodo = {
      ...updatedTodo,
      category: fromPrismaCategory(updatedTodo.category)
    };

    res.json(apiTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /api/todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const todo = await prisma.todo.findUnique({
      where: { id: req.params.id }
    });
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    await prisma.todo.delete({
      where: { id: req.params.id }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

export { router as todoRoutes };
