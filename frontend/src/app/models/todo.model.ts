export type TodoCategory = 'start-doing' | 'do-differently' | 'keep-doing';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category: TodoCategory;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  category: TodoCategory;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  category?: TodoCategory;
  completed?: boolean;
}
