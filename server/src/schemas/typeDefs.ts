// server/schemas/typeDefs.ts
import { gql } from 'apollo-server-express';

const typeDefs = gql`
  # Define custom types
  type User {
    _id: ID!
    username: String!
    email: String!
    savedBooks: [Book]
  }

  type Book {
    bookId: String!
    title: String!
    authors: [String]
    description: String
    image: String
    link: String
  }

  type Auth {
    token: String!
    user: User!
  }

  # Define Query type
  type Query {
    me: User
  }

  # Define Mutation type
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(
      bookId: String!
      title: String!
      authors: [String]
      description: String
      image: String
      link: String
    ): User
    removeBook(bookId: String!): User
  }
`;

export default typeDefs;
