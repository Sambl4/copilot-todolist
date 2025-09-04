import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoDemoService } from '../services/todo-demo.service';
import { TodoItemComponent } from './todo-item.component';
import { TodoFormComponent } from './todo-form.component';
import { TodoCategory } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  imports: [CommonModule, TodoItemComponent, TodoFormComponent],
  template: `
    <div class="kanban-board">
      <div class="board-header">
        <h2>Retrospective Board</h2>
        <div class="todo-stats">
          <span class="stat">
            Total: {{ todoService.todos().length }}
          </span>
          <span class="stat">
            Completed: {{ completedCount() }}
          </span>
        </div>
      </div>

      @if (todoService.loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <span>Loading retrospective items...</span>
        </div>
      }

      @if (todoService.error()) {
        <div class="error-message">
          <strong>Error:</strong> {{ todoService.error() }}
          <button (click)="retryLoad()" class="btn-retry">Retry</button>
        </div>
      }

      @if (!todoService.loading() && todoService.todos().length === 0) {
        <div class="empty-state">
          <h4>No retrospective items yet!</h4>
          <p>Add your first retrospective item using the form above.</p>
        </div>
      }

      @if (todoService.todos().length > 0) {
        <div class="kanban-columns">
          <!-- Start Doing Column -->
          <div class="kanban-column start-doing">
            <div class="column-header">
              <h3>What should we start doing?</h3>
              <span class="item-count">{{ startDoingTodos().length }}</span>
            </div>
            <div class="column-content">
              @for (todo of startDoingTodos(); track todo.id) {
                <app-todo-item [todo]="todo" />
              } @empty {
                <div class="empty-column">
                  <p>No items yet</p>
                </div>
              }
            </div>
          </div>

          <!-- Do Differently Column -->
          <div class="kanban-column do-differently">
            <div class="column-header">
              <h3>What should we do differently?</h3>
              <span class="item-count">{{ doDifferentlyTodos().length }}</span>
            </div>
            <div class="column-content">
              @for (todo of doDifferentlyTodos(); track todo.id) {
                <app-todo-item [todo]="todo" />
              } @empty {
                <div class="empty-column">
                  <p>No items yet</p>
                </div>
              }
            </div>
          </div>

          <!-- Keep Doing Column -->
          <div class="kanban-column keep-doing">
            <div class="column-header">
              <h3>What should we keep doing?</h3>
              <span class="item-count">{{ keepDoingTodos().length }}</span>
            </div>
            <div class="column-content">
              @for (todo of keepDoingTodos(); track todo.id) {
                <app-todo-item [todo]="todo" />
              } @empty {
                <div class="empty-column">
                  <p>No items yet</p>
                </div>
              }
            </div>
          </div>
        </div>
      }

      <!-- Floating Action Button -->
      <button class="fab" (click)="openModal()" title="Add new retrospective item">
        <span class="fab-icon">+</span>
      </button>

      <!-- Modal Dialog -->
      @if (showModal()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Add Retrospective Item</h2>
              <button class="close-btn" (click)="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
              <app-todo-form (itemAdded)="onItemAdded()" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .kanban-board {
      background: white;
      border-radius: 12px;
      border: 1px solid #e9ecef;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .board-header {
      padding: 1.5rem;
      background: #ffffff;
      color: #2c3e50;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e9ecef;
    }

    .board-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .todo-stats {
      display: flex;
      gap: 1rem;
    }

    .stat {
      font-size: 0.875rem;
      background: #f8f9fa;
      color: #5a6c7d;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      border: 1px solid #dee2e6;
    }

    .loading {
      padding: 3rem;
      text-align: center;
      color: #6c757d;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #007bff;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-message {
      padding: 1rem 1.5rem;
      background: #f8d7da;
      color: #721c24;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .btn-retry {
      background: #dc3545;
      color: white;
      border: none;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn-retry:hover {
      background: #c82333;
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #6c757d;
    }

    .empty-state h4 {
      margin: 0 0 0.5rem 0;
      color: #495057;
    }

    .empty-state p {
      margin: 0;
    }

    .kanban-columns {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0;
      min-height: 500px;
    }

    .kanban-column {
      border-right: 1px solid #e9ecef;
      display: flex;
      flex-direction: column;
    }

    .kanban-column:last-child {
      border-right: none;
    }

    .kanban-column.start-doing {
      background: linear-gradient(180deg, #e3f2fd 0%, #f8f9fa 100%);
    }

    .kanban-column.do-differently {
      background: linear-gradient(180deg, #fce4ec 0%, #f8f9fa 100%);
    }

    .kanban-column.keep-doing {
      background: linear-gradient(180deg, #e8f5e8 0%, #f8f9fa 100%);
    }

    .column-header {
      padding: 1.25rem 1rem;
      background: rgba(255, 255, 255, 0.8);
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      backdrop-filter: blur(10px);
      min-height: 60px;
    }

    .start-doing .column-header {
      background: linear-gradient(135deg, #2196f3, #1976d2);
      color: white;
    }

    .do-differently .column-header {
      background: linear-gradient(135deg, #e91e63, #c2185b);
      color: white;
    }

    .keep-doing .column-header {
      background: linear-gradient(135deg, #4caf50, #388e3c);
      color: white;
    }

    .column-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      flex: 1;
      text-align: center;
      line-height: 1.2;
    }

    .item-count {
      background: rgba(255, 255, 255, 0.25);
      color: white;
      padding: 0.3rem 0.6rem;
      border-radius: 50%;
      font-size: 0.8rem;
      font-weight: 700;
      min-width: 28px;
      height: 28px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.3);
      flex-shrink: 0;
    }

    .column-content {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all 0.3s ease;
    }

    /* Card animation styles */
    .column-content app-todo-item {
      animation: slideInCard 0.4s ease-out;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      will-change: transform, opacity;
    }

    .column-content app-todo-item:hover {
      transform: translateY(-1px);
    }

    /* Smooth repositioning for sorting */
    .column-content {
      position: relative;
    }
    
    .column-content app-todo-item {
      position: relative;
      z-index: 1;
    }

    /* Loading state animation for when items are being sorted */
    .column-content.sorting app-todo-item {
      transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    @keyframes slideInCard {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Staggered animation for multiple cards */
    .column-content app-todo-item:nth-child(1) { animation-delay: 0ms; }
    .column-content app-todo-item:nth-child(2) { animation-delay: 50ms; }
    .column-content app-todo-item:nth-child(3) { animation-delay: 100ms; }
    .column-content app-todo-item:nth-child(4) { animation-delay: 150ms; }
    .column-content app-todo-item:nth-child(5) { animation-delay: 200ms; }
    .column-content app-todo-item:nth-child(6) { animation-delay: 250ms; }
    .column-content app-todo-item:nth-child(7) { animation-delay: 300ms; }
    .column-content app-todo-item:nth-child(8) { animation-delay: 350ms; }
    .column-content app-todo-item:nth-child(9) { animation-delay: 400ms; }
    .column-content app-todo-item:nth-child(10) { animation-delay: 450ms; }

    .empty-column {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 200px;
      color: #6c757d;
      font-style: italic;
    }

    .empty-column p {
      margin: 0;
    }

    /* Floating Action Button */
    .fab {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3498db, #2980b9);
      border: none;
      box-shadow: 0 4px 20px rgba(52, 152, 219, 0.4);
      cursor: pointer;
      z-index: 1000;
      transition: all 0.3s ease;
    }

    .fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 25px rgba(52, 152, 219, 0.6);
    }

    .fab-icon {
      color: white;
      font-size: 24px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
      animation: fadeIn 0.3s ease;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideIn 0.3s ease;
    }

    .modal-header {
      padding: 1.5rem 2rem 1rem 2rem;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      margin: 0;
      color: #2c3e50;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 2rem;
      color: #7f8c8d;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .close-btn:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }

    .modal-body {
      padding: 0 2rem 2rem 2rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { 
        opacity: 0;
        transform: translateY(-30px) scale(0.9);
      }
      to { 
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 768px) {
      .kanban-columns {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .kanban-column {
        border-right: none;
        border-bottom: 1px solid #e9ecef;
        border-radius: 8px;
        margin: 0 1rem;
      }

      .kanban-column:last-child {
        border-bottom: none;
        margin-bottom: 1rem;
      }

      .board-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .fab {
        bottom: 1rem;
        right: 1rem;
        width: 50px;
        height: 50px;
      }

      .fab-icon {
        font-size: 20px;
      }

      .modal-content {
        width: 95%;
        margin: 1rem;
      }

      .modal-header {
        padding: 1rem 1.5rem 0.5rem 1.5rem;
      }

      .modal-body {
        padding: 0 1.5rem 1.5rem 1.5rem;
      }
    }
  `]
})
export class TodoListComponent {
  private modalSignal = signal(false);
  showModal = this.modalSignal.asReadonly();

  completedCount = computed(() => 
    this.todoService.todos().filter(todo => todo.completed).length
  );

  startDoingTodos = computed(() =>
    this.todoService.todos()
      .filter(todo => todo.category === 'start-doing')
      .sort((a, b) => {
        // Incomplete items first (false comes before true)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // If same completion status, sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
  );

  doDifferentlyTodos = computed(() =>
    this.todoService.todos()
      .filter(todo => todo.category === 'do-differently')
      .sort((a, b) => {
        // Incomplete items first (false comes before true)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // If same completion status, sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
  );

  keepDoingTodos = computed(() =>
    this.todoService.todos()
      .filter(todo => todo.category === 'keep-doing')
      .sort((a, b) => {
        // Incomplete items first (false comes before true)
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        // If same completion status, sort by creation date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      })
  );

  constructor(protected todoService: TodoDemoService) {}

  openModal(): void {
    this.modalSignal.set(true);
  }

  closeModal(): void {
    this.modalSignal.set(false);
  }

  onItemAdded(): void {
    this.closeModal();
  }

  async retryLoad(): Promise<void> {
    await this.todoService.loadTodos();
  }
}
