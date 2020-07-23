import { AuthError } from '../../types/graphql';
export const duplicateEmail: AuthError = {
	path: 'email',
	message: 'email already registered'
}