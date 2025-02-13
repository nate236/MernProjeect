// server/schemas/resolvers.ts
// This file handles all the database operations when GraphQL requests come in
import { GraphQLError } from 'graphql';
import User from '../models/User.js';
import { signToken } from '../services/auth.js';

const resolvers = {
	// Queries - Getting data
	Query: {
		// Get the logged-in user's data
		me: async (_: any, __: any, context: { user?: { _id: string } }) => {
			// Check if user is logged in
			if (context.user) {
				// Find and return user data from database
				return await User.findOne({ _id: context.user._id });
			}
			// If not logged in, show error
			throw new GraphQLError('Not logged in');
		},
	},

	// Mutations - Changing data
	Mutation: {
		// Create new user account
		addUser: async (
			_: any,
			{
				username,
				email,
				password,
			}: { username: string; email: string; password: string }
		) => {
			try {
				console.log('Starting user creation with:', {
					username,
					email,
				});
				const user = await User.create({ username, email, password });
				console.log('User created successfully:', user);
				const token = signToken(user.username, user.email, user._id);
				console.log('Token generated:', token);
				return { token, user };
			} catch (err: any) {
				console.error('Error in addUser:', err);
				throw new GraphQLError(err.message);
			}
		},

		// Log in existing user
		login: async (
			_: any,
			{ email, password }: { email: string; password: string }
		) => {
			// Look for user with this email
			const user = await User.findOne({ email });
			if (!user) {
				throw new GraphQLError('No user found with this email address');
			}

			// Check if password is correct
			const correctPw = await user.isCorrectPassword(password);
			if (!correctPw) {
				throw new GraphQLError('Incorrect credentials');
			}

			// Create login token
			const token = signToken(user.username, user.email, user._id);
			return { token, user };
		},

		// Save a book to user's list
		saveBook: async (
			_: any,
			{ bookData }: any,
			context: { user?: { _id: string } }
		) => {
			if (context.user) {
				// Add book to user's saved books list
				return await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $addToSet: { savedBooks: bookData } },
					{ new: true, runValidators: true }
				);
			}
			throw new GraphQLError('You need to be logged in!');
		},

		// Remove a book from user's list
		removeBook: async (
			_: any,
			{ bookId }: { bookId: string },
			context: { user?: { _id: string } }
		) => {
			if (context.user) {
				// Remove book from user's saved books list
				return await User.findOneAndUpdate(
					{ _id: context.user._id },
					{ $pull: { savedBooks: { bookId } } },
					{ new: true }
				);
			}
			throw new GraphQLError('You need to be logged in!');
		},
	},
};

export default resolvers;