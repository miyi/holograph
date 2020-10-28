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
      console.log('lib:books resolver chain running');
      let res = books.filter(book => book.branch === parent.branch);
      console.log('book res: ', res[0]);
      return res[0]
    }
  },
  Book: {
    author: (parent) => {
      console.log('book:author resolver chain running');
      let res = authors.filter(author => author.name === parent.author)
      console.log('author res: ', res[0]);
      return res[0]
    }
	},
};