const { GraphQLServer } = require('graphql-yoga');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

const Todo = mongoose.model('Todo', {
	text: String,
	complete: Boolean
});

const typeDefs = `
  type Query {
    hello(name: String): String!  
  }
  type Todo {
    id: ID!
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
  }
`; // ! means required

const resolvers = {
	// resolvers resolve the functions calls in the typedef
	Query: {
		hello: (_, { name }) => `Hello ${name || 'World'}`
	},
	Mutation: {
		createTodo: async (_, { text }) => {
			const todo = new Todo({ text, complete: false });
			await todo.save(); // await because save() is a promise. save() saves to database
			return todo;
		}
	}
};

const server = new GraphQLServer({ typeDefs, resolvers });
mongoose.connection.once('open', function() {
	server.start(() => console.log('Server is running on localhost:4000'));
});
