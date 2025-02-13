import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load our secret key from .env file
dotenv.config();

// Define what our token contains
interface JwtPayload {
	_id: unknown;
	username: string;
	email: string;
}

// Check if user is logged in before letting them do things
export const authMiddleware = ({ req }: { req: any }) => {
	// Get token from different possible places in the request
	let token = req.body.token || req.query.token || req.headers.authorization;

	// Clean up the token if it's in the header
	if (req.headers.authorization) {
		token = token.split(' ').pop().trim();
	}

	// If no token found, return the request as is
	if (!token) {
		return req;
	}

	try {
		// Get our secret key for checking tokens
		const secretKey = process.env.JWT_SECRET_KEY || '';
		// Check if token is valid and get user info from it
		const { data } = jwt.verify(token, secretKey) as { data: JwtPayload };
		req.user = data;
	} catch {
		console.log('Invalid token');
	}

	return req;
};

// Create a new token when user logs in or signs up
export const signToken = (username: string, email: string, _id: unknown) => {
	const payload = { username, email, _id };
	const secretKey = process.env.JWT_SECRET_KEY || '';

	// Make token that expires in 2 hours
	return jwt.sign({ data: payload }, secretKey, { expiresIn: '2h' });
};