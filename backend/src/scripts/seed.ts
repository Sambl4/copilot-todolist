import prisma from '../services/database';

async function seedDatabase() {
  try {
    // Clear existing data
    await prisma.todo.deleteMany({});
    
    // Create seed data
    const seedTodos = [
      {
        title: 'Learn Angular Signals',
        description: 'Understand how to use Angular signals for reactive state management',
        category: 'START_DOING' as const,
        completed: false,
      },
      {
        title: 'Build REST API',
        description: 'Create RESTful API with Node.js and Express',
        category: 'KEEP_DOING' as const,
        completed: true,
      },
      {
        title: 'Improve Code Structure',
        description: 'Refactor components for better maintainability',
        category: 'DO_DIFFERENTLY' as const,
        completed: false,
      },
      {
        title: 'Add Unit Tests',
        description: 'Write comprehensive unit tests for all components',
        category: 'START_DOING' as const,
        completed: false,
      },
      {
        title: 'Use TypeScript',
        description: 'Continue using TypeScript for type safety',
        category: 'KEEP_DOING' as const,
        completed: true,
      },
      {
        title: 'Better Error Handling',
        description: 'Implement more robust error handling throughout the app',
        category: 'DO_DIFFERENTLY' as const,
        completed: false,
      }
    ];

    for (const todo of seedTodos) {
      await prisma.todo.create({
        data: todo
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${seedTodos.length} retrospective items`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
