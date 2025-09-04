import { TodoCategory as PrismaTodoCategory } from '@prisma/client';

export type TodoCategory = 'start-doing' | 'do-differently' | 'keep-doing';

// Helper function to convert between our API format and Prisma enum format
export function toPrismaCategory(category: TodoCategory): PrismaTodoCategory {
  switch (category) {
    case 'start-doing':
      return 'START_DOING';
    case 'do-differently':
      return 'DO_DIFFERENTLY';
    case 'keep-doing':
      return 'KEEP_DOING';
  }
}

export function fromPrismaCategory(category: PrismaTodoCategory): TodoCategory {
  switch (category) {
    case 'START_DOING':
      return 'start-doing';
    case 'DO_DIFFERENTLY':
      return 'do-differently';
    case 'KEEP_DOING':
      return 'keep-doing';
  }
}

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
