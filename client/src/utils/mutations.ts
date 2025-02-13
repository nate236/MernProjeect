import { gql } from '@apollo/client';

// When someone tries to log in
export const LOGIN_USER = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token # Get back their access token (like a special pass)
			user {
				# And their basic info
				_id
				username
			}
		}
	}
`;

// When someone makes a new account
export const ADD_USER = gql`
	mutation addUser($username: String!, $email: String!, $password: String!) {
		addUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
				email
			}
		}
	}
`;

// When someone wants to save a book
export const SAVE_BOOK = gql`
	mutation saveBook($bookData: BookInput!) {
		saveBook(bookData: $bookData) {
			_id # Get back their updated profile
			username
			email
			savedBooks {
				# Including their new list of saved books
				bookId
				authors
				description
				title
				image
				link
			}
		}
	}
`;

// When someone wants to remove a book
export const REMOVE_BOOK = gql`
	mutation removeBook($bookId: String!) {
		removeBook(bookId: $bookId) {
			_id # Get back their updated profile
			username
			email
			savedBooks {
				# With the book removed from their list
				bookId
				authors
				description
				title
				image
				link
			}
		}
	}
`;