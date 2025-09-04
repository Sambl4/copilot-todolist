import { Component, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoDemoService } from '../services/todo-demo.service';
import { TodoCategory } from '../models/todo.model';

@Component({
  selector: 'app-todo-form',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="retro-form">
      <form (ngSubmit)="onSubmit()" #todoForm="ngForm">
        <div class="form-row">
          <div class="form-group">
            <label for="category">Category*</label>
            <select
              id="category"
              name="category"
              [(ngModel)]="category"
              required
              class="form-control"
            >
              <option value="">Select category...</option>
              <option value="start-doing">💡 Start Doing</option>
              <option value="do-differently">🔄 Do Differently</option>
              <option value="keep-doing">✅ Keep Doing</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="title">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              [(ngModel)]="title"
              required
              placeholder="What should the team focus on?"
              class="form-control"
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="description">Description</label>
          <textarea
            id="description"
            name="description"
            [(ngModel)]="description"
            placeholder="Add more details about this retrospective item..."
            class="form-control"
            rows="2"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            type="submit" 
            [disabled]="!todoForm.form.valid || todoService.loading()"
            class="btn-primary"
          >
            {{ todoService.loading() ? 'Adding...' : 'Add Item' }}
          </button>
          <button 
            type="button" 
            (click)="onReset()"
            class="btn-secondary"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .retro-form {
      background: transparent;
      padding: 0;
      border-radius: 0;
      margin-bottom: 0;
      border: none;
      backdrop-filter: none;
      box-shadow: none;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #34495e;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #ecf0f1;
      border-radius: 8px;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      background: white;
    }

    .form-control:focus {
      border-color: #3498db;
      outline: 0;
      box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
    }

    .form-control::placeholder {
      color: #95a5a6;
    }

    .form-actions {
      display: flex;
      gap: 0.75rem;
      margin-top: 1.5rem;
      justify-content: center;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 120px;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3498db, #2980b9);
      color: white;
      box-shadow: 0 2px 10px rgba(52, 152, 219, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, #2980b9, #21618c);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
    }

    .btn-primary:disabled {
      background: #95a5a6;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .btn-secondary {
      background: linear-gradient(135deg, #95a5a6, #7f8c8d);
      color: white;
    }

    .btn-secondary:hover {
      background: linear-gradient(135deg, #7f8c8d, #6c7b7d);
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .btn-primary, .btn-secondary {
        width: 100%;
      }
    }
  `]
})
export class TodoFormComponent {
  protected title = '';
  protected description = '';
  protected category: TodoCategory | '' = '';

  itemAdded = output<void>();

  constructor(protected todoService: TodoDemoService) {}

  async onSubmit(): Promise<void> {
    const titleValue = this.title.trim();
    if (!titleValue || !this.category) return;

    await this.todoService.createTodo({
      title: titleValue,
      description: this.description.trim() || undefined,
      category: this.category as TodoCategory
    });

    // Reset form and emit event if successful
    if (!this.todoService.error()) {
      this.onReset();
      this.itemAdded.emit();
    }
  }

  onReset(): void {
    this.title = '';
    this.description = '';
    this.category = '';
  }
}
