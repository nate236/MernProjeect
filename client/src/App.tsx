import './App.css';
import './App.css';
import { Outlet } from 'react-router-dom';
import {
	ApolloClient,
	ApolloProvider,
	InMemoryCache,
	createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Navbar from './components/Navbar';

// Set up where our app will talk to the server
const httpLink = createHttpLink({
	uri:
		process.env.NODE_ENV === 'production'
			? '/graphql'
			: 'http://localhost:3001/graphql',
});

// This adds our login token to every request
// (like showing your ID card before entering a restricted area)
const authLink = setContext((_, { headers }) => {
	// Get the token from our browser's storage (if we're logged in)
	const token = localStorage.getItem('id_token');
	// Add the token to our request, like putting a stamp on an envelope
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

// Make a new Apollo Client (this is like a special messenger that talks to our server)
const client = new ApolloClient({
	link: authLink.concat(httpLink), // Combine our auth token with our server location
	cache: new InMemoryCache(), // This stores data we've already fetched so we don't have to keep asking for it
});

// This is our main app component
function App() {
	return (
		// Wrap everything in ApolloProvider so all parts can talk to our server
		<ApolloProvider client={client}>
			<>
				<Navbar />
				<Outlet />
			</>
		</ApolloProvider>
	);
}

export default App;
