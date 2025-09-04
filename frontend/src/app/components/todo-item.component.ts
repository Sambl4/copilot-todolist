import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-todo-item',
  imports: [CommonModule],
  template: `
    <div class="retrospective-card" [class.completed]="todo().completed">
      <div class="card-content">
        <h4 class="card-title">{{ todo().title }}</h4>
        
        @if (todo().description) {
          <p class="card-description">{{ todo().description }}</p>
        }
        
        <div class="card-footer">
          <span class="card-date">{{ formattedDate() }}</span>
          <div class="card-actions">
            <button
              (click)="toggleCompleted()"
              [disabled]="todoService.loading()"
              class="btn-toggle"
              [class.completed]="todo().completed"
              [title]="todo().completed ? 'Mark as incomplete' : 'Mark as complete'"
            >
              {{ todo().completed ? '✓' : '○' }}
            </button>
            
            <button
              (click)="deleteTodo()"
              [disabled]="todoService.loading()"
              class="btn-delete"
              title="Delete item"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .retrospective-card {
      background: white;
      border-radius: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      padding: 1rem;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      position: relative;
      min-height: 100px;
      transform-origin: center;
    }

    .retrospective-card:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    }

    .retrospective-card.completed {
      opacity: 0.8;
      background: #f8f9fa;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .retrospective-card.completed::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(
        45deg,
        transparent,
        transparent 10px,
        rgba(0, 0, 0, 0.05) 10px,
        rgba(0, 0, 0, 0.05) 20px
      );
      border-radius: 8px;
      pointer-events: none;
    }

    .card-content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .card-title {
      margin: 0 0 0.5rem 0;
      font-size: 0.95rem;
      font-weight: 600;
      color: #2c3e50;
      line-height: 1.3;
      word-wrap: break-word;
      transition: all 0.3s ease;
    }

    .retrospective-card.completed .card-title {
      text-decoration: line-through;
      color: #7f8c8d;
      transition: all 0.3s ease;
    }

    .card-description {
      margin: 0 0 1rem 0;
      font-size: 0.85rem;
      color: #5a6c7d;
      line-height: 1.4;
      flex: 1;
      word-wrap: break-word;
      transition: all 0.3s ease;
    }

    .retrospective-card.completed .card-description {
      text-decoration: line-through;
      color: #95a5a6;
      transition: all 0.3s ease;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }

    .card-date {
      font-size: 0.7rem;
      color: #7f8c8d;
      font-weight: 500;
    }

    .card-actions {
      display: flex;
      gap: 0.25rem;
    }

    .btn-toggle, .btn-delete {
      width: 1.8rem;
      height: 1.8rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: bold;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      transform-origin: center;
    }

    .btn-toggle {
      background: #ecf0f1;
      color: #7f8c8d;
      border: 1px solid #bdc3c7;
    }

    .btn-toggle.completed {
      background: #27ae60;
      color: white;
      border: 1px solid #229954;
      animation: completePulse 0.6s ease-out;
    }

    @keyframes completePulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }

    .btn-toggle:hover:not(:disabled) {
      background: #3498db;
      color: white;
      border-color: #2980b9;
      transform: scale(1.1);
    }

    .btn-toggle.completed:hover:not(:disabled) {
      background: #229954;
      border-color: #1e8449;
      transform: scale(1.1);
    }

    .btn-delete {
      background: #e74c3c;
      color: white;
      border: 1px solid #c0392b;
    }

    .btn-delete:hover:not(:disabled) {
      background: #c0392b;
      border-color: #a93226;
      transform: scale(1.1);
    }

    .btn-toggle:disabled, .btn-delete:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Card color variations based on parent column */
    :host-context(.start-doing) .retrospective-card {
      border-left: 4px solid #2196f3;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    :host-context(.start-doing) .retrospective-card:hover {
      border-left-color: #1976d2;
      box-shadow: 0 6px 20px rgba(33, 150, 243, 0.2);
    }

    :host-context(.do-differently) .retrospective-card {
      border-left: 4px solid #e91e63;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    :host-context(.do-differently) .retrospective-card:hover {
      border-left-color: #c2185b;
      box-shadow: 0 6px 20px rgba(233, 30, 99, 0.2);
    }

    :host-context(.keep-doing) .retrospective-card {
      border-left: 4px solid #4caf50;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    :host-context(.keep-doing) .retrospective-card:hover {
      border-left-color: #388e3c;
      box-shadow: 0 6px 20px rgba(76, 175, 80, 0.2);
    }
  `]
})
export class TodoItemComponent {
  todo = input.required<Todo>();

  formattedDate = computed(() => {
    const date = this.todo().createdAt;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  });

  constructor(protected todoService: TodoService) {}

  async toggleCompleted(): Promise<void> {
    await this.todoService.toggleTodo(this.todo().id);
  }

  async deleteTodo(): Promise<void> {
    if (confirm('Are you sure you want to delete this todo?')) {
      await this.todoService.deleteTodo(this.todo().id);
    }
  }
}
