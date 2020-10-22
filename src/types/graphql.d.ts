export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };
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
  delRedis?: Maybe<Scalars['String']>;
  dummyLogin?: Maybe<Scalars['Boolean']>;
  forgotPasswordChange: AuthResponse;
  login: AuthResponse;
  logout: AuthResponse;
  logoutAll: AuthResponse;
  register: AuthResponse;
  sendForgotPasswordEmail: AuthResponse;
  setRedis?: Maybe<Scalars['String']>;
  setSessionDummy1?: Maybe<Scalars['String']>;
  setSessionDummy2?: Maybe<Scalars['String']>;
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


export type MutationSendForgotPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationSetRedisArgs = {
  key: Scalars['String'];
  value: Scalars['String'];
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

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getRedis?: Maybe<Scalars['String']>;
  hello: Scalars['String'];
  me?: Maybe<User>;
  readSessionDummy1?: Maybe<Scalars['String']>;
  readSessionDummy2?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};


export type QueryGetRedisArgs = {
  key: Scalars['String'];
};


export type QueryHelloArgs = {
  name?: Maybe<Scalars['String']>;
};
