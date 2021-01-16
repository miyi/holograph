export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Mutation = {
  __typename?: 'Mutation';
  addPostToMyCollection: Scalars['Boolean'];
  createPost?: Maybe<Post>;
  delRedis?: Maybe<Scalars['String']>;
  dummyLogin?: Maybe<Scalars['Boolean']>;
  forgotPasswordChange: AuthResponse;
  login: AuthResponse;
  logout: AuthResponse;
  logoutAll: AuthResponse;
  publishPost?: Maybe<Post>;
  register: AuthResponse;
  removePostFromMyCollection: Scalars['Boolean'];
  saveEditPostBody?: Maybe<Post>;
  sendForgotPasswordEmail: AuthResponse;
  setRedis?: Maybe<Scalars['String']>;
  setSessionDummy1?: Maybe<Scalars['String']>;
  setSessionDummy2?: Maybe<Scalars['String']>;
  unPublishPost?: Maybe<Post>;
  updateMyProfileDescription?: Maybe<Profile>;
  updateUserEmail: Scalars['Boolean'];
};


export type MutationAddPostToMyCollectionArgs = {
  postId: Scalars['String'];
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationDelRedisArgs = {
  key: Scalars['String'];
};


export type MutationDummyLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationForgotPasswordChangeArgs = {
  linkId: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationPublishPostArgs = {
  id: Scalars['ID'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemovePostFromMyCollectionArgs = {
  postId: Scalars['String'];
};


export type MutationSaveEditPostBodyArgs = {
  id: Scalars['ID'];
  body?: Maybe<Scalars['String']>;
};


export type MutationSendForgotPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationSetRedisArgs = {
  key: Scalars['String'];
  value: Scalars['String'];
};


export type MutationUnPublishPostArgs = {
  id: Scalars['ID'];
};


export type MutationUpdateMyProfileDescriptionArgs = {
  description?: Maybe<Scalars['String']>;
};


export type MutationUpdateUserEmailArgs = {
  email: Scalars['String'];
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  success?: Maybe<Scalars['Boolean']>;
  error: Array<Maybe<AuthError>>;
};

export type AuthError = {
  __typename?: 'AuthError';
  path: Scalars['String'];
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  findPostsWithTag?: Maybe<Array<Maybe<Post>>>;
  getCollectionFromUser?: Maybe<Array<Maybe<Post>>>;
  getMyCollection?: Maybe<Array<Maybe<Post>>>;
  getMyProfile?: Maybe<Profile>;
  getPostById?: Maybe<Post>;
  getPostsByAuthorId?: Maybe<Array<Maybe<Post>>>;
  getPostsByTitle?: Maybe<Array<Maybe<Post>>>;
  getProfileByUserId?: Maybe<Profile>;
  getRedis?: Maybe<Scalars['String']>;
  getUserByEmail?: Maybe<User>;
  getUserById?: Maybe<User>;
  hello: Scalars['String'];
  libraries?: Maybe<Array<Maybe<Library>>>;
  lookUpTag?: Maybe<Array<Maybe<Tag>>>;
  me?: Maybe<User>;
  readSessionDummy1?: Maybe<Scalars['String']>;
  readSessionDummy2?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};


export type QueryFindPostsWithTagArgs = {
  name: Scalars['String'];
};


export type QueryGetCollectionFromUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetPostByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetPostsByAuthorIdArgs = {
  authorId: Scalars['ID'];
};


export type QueryGetPostsByTitleArgs = {
  title: Scalars['String'];
};


export type QueryGetProfileByUserIdArgs = {
  userId: Scalars['ID'];
};


export type QueryGetRedisArgs = {
  key: Scalars['String'];
};


export type QueryGetUserByEmailArgs = {
  email: Scalars['String'];
};


export type QueryGetUserByIdArgs = {
  id: Scalars['String'];
};


export type QueryHelloArgs = {
  name?: Maybe<Scalars['String']>;
};


export type QueryLookUpTagArgs = {
  input: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  id: Scalars['String'];
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  author: User;
  published?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  isInMyCollection?: Maybe<Scalars['Boolean']>;
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['ID'];
  user: User;
  description?: Maybe<Scalars['String']>;
};

export type Tag = {
  __typename?: 'Tag';
  name: Scalars['String'];
  posts?: Maybe<Array<Maybe<Post>>>;
  count?: Maybe<Scalars['Int']>;
};

export type Library = {
  __typename?: 'Library';
  branch: Scalars['String'];
  books?: Maybe<Array<Book>>;
};

export type Book = {
  __typename?: 'Book';
  title: Scalars['String'];
  author: Author;
  branch: Scalars['String'];
};

export type Author = {
  __typename?: 'Author';
  name: Scalars['String'];
  dob: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  posts?: Maybe<Array<Post>>;
  collection?: Maybe<Array<Maybe<Post>>>;
};
