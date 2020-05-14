export type Maybe<T> = T | null;
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
  dummyLogin?: Maybe<Scalars['Boolean']>;
  login?: Maybe<LoginResponse>;
  register?: Maybe<Array<Error>>;
  setSessionDummy1?: Maybe<Scalars['String']>;
  setSessionDummy2?: Maybe<Scalars['String']>;
};


export type MutationDummyLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationRegisterArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type LoginResponse = {
   __typename?: 'LoginResponse';
  success?: Maybe<Scalars['Boolean']>;
  error?: Maybe<Array<Maybe<Error>>>;
};

export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  readSessionDummy1?: Maybe<Scalars['String']>;
  readSessionDummy2?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};


export type QueryHelloArgs = {
  name?: Maybe<Scalars['String']>;
};

export type Error = {
   __typename?: 'Error';
  path: Scalars['String'];
  message: Scalars['String'];
};
