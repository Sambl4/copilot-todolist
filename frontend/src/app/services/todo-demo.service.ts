import { Injectable, signal } from '@angular/core';
import { Todo, CreateTodoRequest, UpdateTodoRequest, TodoCategory } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoDemoService {
  private readonly storageKey = 'retrospective-board-todos';
  
  // Using signals for reactive state management
  public readonly todos = signal<Todo[]>([]);
  public readonly loading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  constructor() {
    this.loadTodos();
  }

  // Generate UUID for demo purposes
  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Load todos from localStorage
  async loadTodos(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const todos: Todo[] = JSON.parse(stored);
        // Convert date strings to Date objects
        const processedTodos = todos.map(todo => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));
        this.todos.set(processedTodos);
      } else {
        // Initialize with demo data
        this.initializeDemoData();
      }
    } catch (error) {
      this.error.set('Failed to load todos from storage');
    } finally {
      this.loading.set(false);
    }
  }

  // Initialize with demo data
  private initializeDemoData(): void {
    const now = new Date();
    const demoTodos: Todo[] = [
      {
        id: this.generateId(),
        title: 'Implement automated testing',
        description: 'Set up unit tests and e2e tests for better code quality',
        category: 'start-doing' as TodoCategory,
        completed: false,
        createdAt: new Date(now.getTime() - 86400000), // 1 day ago
        updatedAt: new Date(now.getTime() - 86400000)
      },
      {
        id: this.generateId(),
        title: 'Use TypeScript consistently',
        description: 'Apply TypeScript best practices across all components',
        category: 'start-doing' as TodoCategory,
        completed: true,
        createdAt: new Date(now.getTime() - 172800000), // 2 days ago
        updatedAt: new Date(now.getTime() - 172800000)
      },
      {
        id: this.generateId(),
        title: 'Improve code review process',
        description: 'Be more thorough in code reviews and provide constructive feedback',
        category: 'do-differently' as TodoCategory,
        completed: false,
        createdAt: new Date(now.getTime() - 259200000), // 3 days ago
        updatedAt: new Date(now.getTime() - 259200000)
      },
      {
        id: this.generateId(),
        title: 'Document technical decisions',
        description: 'Write better documentation for architecture and design choices',
        category: 'do-differently' as TodoCategory,
        completed: false,
        createdAt: new Date(now.getTime() - 345600000), // 4 days ago
        updatedAt: new Date(now.getTime() - 345600000)
      },
      {
        id: this.generateId(),
        title: 'Daily standup meetings',
        description: 'Continue with effective daily standups for team communication',
        category: 'keep-doing' as TodoCategory,
        completed: false,
        createdAt: new Date(now.getTime() - 432000000), // 5 days ago
        updatedAt: new Date(now.getTime() - 432000000)
      },
      {
        id: this.generateId(),
        title: 'Pair programming sessions',
        description: 'Keep doing pair programming for knowledge sharing',
        category: 'keep-doing' as TodoCategory,
        completed: true,
        createdAt: new Date(now.getTime() - 518400000), // 6 days ago
        updatedAt: new Date(now.getTime() - 518400000)
      }
    ];
    
    this.todos.set(demoTodos);
    this.saveTodos();
  }

  // Save todos to localStorage
  private saveTodos(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.todos()));
  }

  // Create a new todo
  async createTodo(todoData: CreateTodoRequest): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newTodo: Todo = {
        id: this.generateId(),
        title: todoData.title,
        description: todoData.description || '',
        category: todoData.category,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add the new todo to the current list
      this.todos.update(todos => [...todos, newTodo]);
      this.saveTodos();
    } catch (error) {
      this.error.set('Failed to create todo');
    } finally {
      this.loading.set(false);
    }
  }

  // Update an existing todo
  async updateTodo(id: string, updateData: UpdateTodoRequest): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Update the todo in the current list
      this.todos.update(todos => 
        todos.map(todo => todo.id === id ? {
          ...todo,
          ...updateData,
          updatedAt: new Date()
        } : todo)
      );
      this.saveTodos();
    } catch (error) {
      this.error.set('Failed to update todo');
    } finally {
      this.loading.set(false);
    }
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Remove the todo from the current list
      this.todos.update(todos => todos.filter(todo => todo.id !== id));
      this.saveTodos();
    } catch (error) {
      this.error.set('Failed to delete todo');
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
