import { ResolverMap } from '../../../types/graphql-utils';
const libraries = [
  {
    branch: 'downtown'
  },
  {
    branch: 'riverside'
  },
];

// The branch field of a book indicates which library has it in stock
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside'
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown'
  },
];

const authors = [
  {
		name: 'Kate Chopin',
		dob: '03-30-1991'
  },
  {
    name: 'Paul Auster',
		dob: '03-21-1991'
  },
];

export const resolvers: ResolverMap = {
  Query: {
    libraries: () => {
      return libraries;
    }
  },
  Library: {
    books: (parent) => {
      let res = books.filter(book => book.branch === parent.branch);
      return res
    }
  },
  Book: {
    author: (parent) => {
      let res = authors.find(author => author.name === parent.author)
      return res
    }
	},
};