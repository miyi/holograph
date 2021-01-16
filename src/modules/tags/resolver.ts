import { ResolverMap } from '../../types/graphql-utils';
import { QueryLookUpTagArgs } from '../../types/graphql';
export const resolver: ResolverMap = {
	Query: {
		lookUpTag: (_, {input}: QueryLookUpTagArgs) => {
			
		}
	}
}