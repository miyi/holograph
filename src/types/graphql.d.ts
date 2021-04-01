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
  addMod?: Maybe<Pub>;
  addPostToMyCollection: Scalars['Boolean'];
  createPost?: Maybe<Post>;
  createPub?: Maybe<Pub>;
  delRedis?: Maybe<Scalars['String']>;
  dummyLogin?: Maybe<Scalars['Boolean']>;
  forgotPasswordChange: AuthResponse;
  login: AuthResponse;
  logout: AuthResponse;
  logoutAll: AuthResponse;
  register: AuthResponse;
  removeMod?: Maybe<Pub>;
  removePost?: Maybe<Scalars['Boolean']>;
  removePostFromMyCollection: Scalars['Boolean'];
  saveEditPost?: Maybe<Post>;
  sendForgotPasswordEmail: AuthResponse;
  setRedis?: Maybe<Scalars['String']>;
  setSessionDummy1?: Maybe<Scalars['String']>;
  setSessionDummy2?: Maybe<Scalars['String']>;
  tagAndPublishPost?: Maybe<Scalars['ID']>;
  updateMyProfileDescription?: Maybe<Profile>;
  updateUserEmail: Scalars['Boolean'];
};


export type MutationAddModArgs = {
  pubId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationAddPostToMyCollectionArgs = {
  postId: Scalars['String'];
};


export type MutationCreatePostArgs = {
  postForm: PostForm;
};


export type MutationCreatePubArgs = {
  form: CreatePubForm;
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


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRemoveModArgs = {
  pubId: Scalars['String'];
  userId: Scalars['String'];
};


export type MutationRemovePostArgs = {
  id: Scalars['ID'];
};


export type MutationRemovePostFromMyCollectionArgs = {
  postId: Scalars['String'];
};


export type MutationSaveEditPostArgs = {
  id: Scalars['ID'];
  postForm: PostForm;
};


export type MutationSendForgotPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationSetRedisArgs = {
  key: Scalars['String'];
  value: Scalars['String'];
};


export type MutationTagAndPublishPostArgs = {
  id: Scalars['ID'];
  tags?: Maybe<Array<TagInput>>;
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
  addThreeToThis: Scalars['Int'];
  getCollectionFromUser?: Maybe<Array<Maybe<Post>>>;
  getFullName?: Maybe<Scalars['String']>;
  getMyCollection?: Maybe<Array<Maybe<Post>>>;
  getMyProfile?: Maybe<Profile>;
  getPostById?: Maybe<Post>;
  getPostsByAuthorId?: Maybe<Array<Maybe<Post>>>;
  getPostsByTagId?: Maybe<Array<Maybe<Post>>>;
  getPostsByTitle?: Maybe<Array<Maybe<Post>>>;
  getProfileByUserId?: Maybe<Profile>;
  getPubById?: Maybe<Pub>;
  getPubByName?: Maybe<Pub>;
  getRedis?: Maybe<Scalars['String']>;
  getTagById?: Maybe<Tag>;
  getUserByEmail?: Maybe<User>;
  getUserById?: Maybe<User>;
  hello: Scalars['String'];
  helloAll?: Maybe<Scalars['String']>;
  libraries?: Maybe<Array<Maybe<Library>>>;
  lookUpPubsByName?: Maybe<Array<Maybe<Pub>>>;
  lookUpTag?: Maybe<Array<Maybe<Tag>>>;
  me?: Maybe<User>;
  readSessionDummy1?: Maybe<Scalars['String']>;
  readSessionDummy2?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};


export type QueryAddThreeToThisArgs = {
  num: Scalars['Int'];
};


export type QueryGetCollectionFromUserArgs = {
  userId: Scalars['String'];
};


export type QueryGetFullNameArgs = {
  input: NameInput;
};


export type QueryGetPostByIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetPostsByAuthorIdArgs = {
  authorId: Scalars['ID'];
};


export type QueryGetPostsByTagIdArgs = {
  id: Scalars['ID'];
};


export type QueryGetPostsByTitleArgs = {
  title: Scalars['String'];
};


export type QueryGetProfileByUserIdArgs = {
  userId: Scalars['ID'];
};


export type QueryGetPubByIdArgs = {
  id: Scalars['String'];
};


export type QueryGetPubByNameArgs = {
  name: Scalars['String'];
};


export type QueryGetRedisArgs = {
  key: Scalars['String'];
};


export type QueryGetTagByIdArgs = {
  id: Scalars['ID'];
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


export type QueryHelloAllArgs = {
  stringArray: Array<Scalars['String']>;
};


export type QueryLookUpPubsByNameArgs = {
  name: Scalars['String'];
};


export type QueryLookUpTagArgs = {
  name: Scalars['String'];
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
  tags?: Maybe<Array<Maybe<Tag>>>;
};

export type PostForm = {
  title: Scalars['String'];
  body: Scalars['String'];
};

export type Profile = {
  __typename?: 'Profile';
  id: Scalars['ID'];
  user: User;
  description?: Maybe<Scalars['String']>;
};

export type Pub = {
  __typename?: 'Pub';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  mods?: Maybe<Array<Maybe<User>>>;
  info?: Maybe<PubInfo>;
};

export type PubInfo = {
  __typename?: 'PubInfo';
  details?: Maybe<Scalars['String']>;
};

export type CreatePubForm = {
  name: Scalars['String'];
  description: Scalars['String'];
};

export type Tag = {
  __typename?: 'Tag';
  name: Scalars['String'];
  posts?: Maybe<Array<Maybe<Post>>>;
  count?: Maybe<Scalars['Int']>;
};

export type TagInput = {
  id?: Maybe<Scalars['ID']>;
  name: Scalars['String'];
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

export type NameInput = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  posts?: Maybe<Array<Post>>;
  collection?: Maybe<Array<Maybe<Post>>>;
  modOf?: Maybe<Array<Maybe<Pub>>>;
};
