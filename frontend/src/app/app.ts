import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoService } from './services/todo.service';
import { TodoListComponent } from './components/todo-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TodoListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('Retrospective Board');

  constructor(private todoService: TodoService) {}

  async ngOnInit(): Promise<void> {
    await this.todoService.loadTodos();
  }
}
