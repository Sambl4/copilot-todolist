import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo, CreateTodoRequest, UpdateTodoRequest } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly apiUrl = 'http://localhost:3000/api/todos';
  
  // Using signals for reactive state management
  public readonly todos = signal<Todo[]>([]);
  public readonly loading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  // Load all todos
  async loadTodos(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      
      const todos: Todo[] = await response.json();
      
      // Convert date strings to Date objects
      const processedTodos = todos.map(todo => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt)
      }));
      
      this.todos.set(processedTodos);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  // Create a new todo
  async createTodo(todoData: CreateTodoRequest): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(todoData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create todo');
      }
      
      const newTodo: Todo = await response.json();
      newTodo.createdAt = new Date(newTodo.createdAt);
      newTodo.updatedAt = new Date(newTodo.updatedAt);
      
      // Add the new todo to the current list
      this.todos.update(todos => [...todos, newTodo]);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  // Update an existing todo
  async updateTodo(id: string, updateData: UpdateTodoRequest): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update todo');
      }
      
      const updatedTodo: Todo = await response.json();
      updatedTodo.createdAt = new Date(updatedTodo.createdAt);
      updatedTodo.updatedAt = new Date(updatedTodo.updatedAt);
      
      // Update the todo in the current list
      this.todos.update(todos => 
        todos.map(todo => todo.id === id ? updatedTodo : todo)
      );
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete todo');
      }
      
      // Remove the todo from the current list
      this.todos.update(todos => todos.filter(todo => todo.id !== id));
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  // Toggle todo completion status
  async toggleTodo(id: string): Promise<void> {
    const todo = this.todos().find(t => t.id === id);
    if (!todo) return;
    
    await this.updateTodo(id, { completed: !todo.completed });
  }
}
