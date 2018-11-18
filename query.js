//get single user
query getSingleUser($userID: Int!) {
   user(id: $userID) {
      name
      age
      gender
   }
}

{
   "userID": 1
}

//get user on the basis of alias
query getUsersWithAliases($userAID: Int!, $userBID: Int!) {
   userA: user(id: $userAID) {
      name
      age
      gender
   },
   userB: user(id: $userBID) {
      name
      age
      gender
   }
}
{
   "userAID": 1,
      "userBID": 2
}

//fragment to solve the repetation issue

var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');

// Initialize a GraphQL schema
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Root resolver
var root = {
   hello: () => 'Hello world!'
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
   schema: schema,  // Must be provided
   rootValue: root,
   graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
Concepts
So far we have explored some features and advantages of GraphQL.In the this section we will delve into different teminologies and implementations of some technical features in GraphQL.We will be using a simple Express server to paractice our features.

   Schema
In GraphQL, the Schema manages queries and mutations, defining what is allowed to be executed in the GraphQL server.A schema defines a GraphQL API's type system. It describes the complete set of possible data (objects, fields, relationships, everything) that a client can access. Calls from the client are validated and executed against the schema. A client can find information about the schema via introspection. A schema resides on the GraphQL API server.

GraphQL Interface Definition Language(IDL) or Schema Definition Language(SDL) is the most concise way to specify a GraphQL Schema.The most basic components of a GraphQL schema are object types, which just represent a kind of object you can fetch from your service, and what fields it has.In the GraphQL schema language, we might represent it like this:

Scotch Newsletter
Join 100, 000 subscribers.Get weekly dev news and tutorials.


   Message

Email

Name

Email
📧
type User {
   id: ID!
   name: String!
   age: Int
}
In the above snippet we are using buildSchema function which builds a Schema object from GraphQL schema language.

var schema = buildSchema(`
  type Query {
    hello: String
  }
`);
Constructing Types
Inside buildSchema, we can define different types.You might notice in most cases type Query {... } and type Mutation {... }.type Query {... } is an object holding the functions that will be mapped to GraphQL queries; used to fetch data(equivalent to GET in REST) while type Mutation {... } holds functions that will be mapped to mutaions; used to create, update or delete data(equivalent to POST, UPDATE and DELETE in REST).

We will make our schema a bit complex by adding some reasonable types.For instance, we want to return a user and an array of users of type Person who has an id, name, age and gender properties.

var schema = buildSchema(`
  type Query {
    user(id: Int!): Person
    users(gender: String): [Person]
  },
  type Person {
    id: Int
    name: String
    age: Int
    gender: String    
  }
`);
You can notice some interesting syntax above, [Person] means return an array of type Person while the exclamation in user(id: Int!) means that the id must be provided.users query takes an optional gender variable.

   Resolver
A resolver is responsible for mapping the operation to actual function.Inside type Query, we have an operation called users.We map this operation to a function with the same name inside root.We will also create some dummy users for this functionality.

...
var users = [  // Dummy data
   {
      id: 1,
      name: 'Brian',
      age: '21',
      gender: 'M'
   },
   {
      id: 2,
      name: 'Kim',
      age: '22',
      gender: 'M'
   },
   {
      id: 3,
      name: 'Joseph',
      age: '23',
      gender: 'M'
   },
   {
      id: 3,
      name: 'Faith',
      age: '23',
      gender: 'F'
   },
   {
      id: 5,
      name: 'Joy',
      age: '25',
      gender: 'F'
   }
];

var getUser = function (args) { ... }  // Return a single user
var retrieveUsers = function (args) { ... } // Return  a list of users
...
var root = {
   user: getUser,   // Resolver function to return user with specific id
   users: retrieveUsers
};
To make the code more readable, we will create separate functions instead of piling everything in the root resolver.Both functions take an optional args parameter which carries variables from the client query.Let's provide an implementaion for the resolvers and test their functionality.

...
var getUser = function (args) { // return a single user based on id
   var userID = args.id;
   return users.filter(user => {
      return user.id == userID;
   })[0];
}

var retrieveUsers = function (args) { // Return a list of users. Takes an optional gender parameter
   if (args.gender) {
      var gender = args.gender;
      return users.filter(user => user.gender === gender);
   } else {
      return users;
   }
}
...
Query

query getSingleUser {
   user {
      name
      age
      gender
   }
}
Output



In the diagram above, we are using a an operation name getSingleUser to get a single user with their name, gender and age.We could optionally specify that we need their name only if we did not need the age and gender.

When something goes wrong either in your network logs or your GraphQL server, it is easier to identify a query in your codebase by name instead of trying to decipher the contents.

This query does not provide the required id and GraphQL gives us a very descriptive error message.We will now make a correct query, notice the use of variables / arguments.

   Query

query getSingleUser($userID: Int!) {
   user(id: $userID) {
      name
      age
      gender
   }
}
Variables

{
   "userID": 1
}
Output



Aliases
Imagine a situation where we need to retrieve two different users.How do we identify each user ? In GraphQL, you can't directly query for the same field with different arguments. Let's demonstrate this.

   Query

query getUsersWithAliasesError($userAID: Int!, $userBID: Int!) {
   user(id: $userAID) {
      name
      age
      gender
   },
   user(id: $userBID) {
      name
      age
      gender
   }
}
Variables

{
   "userAID": 1,
      "userBID": 2
}
Output



The error is very descriptive and even suggests use of aliases.Let's correct the implementation.

query getUsersWithAliases($userAID: Int!, $userBID: Int!) {
   userA: user(id: $userAID) {
      name
      age
      gender
   },
   userB: user(id: $userBID) {
      name
      age
      gender
   }
}
Variables

{
   "userAID": 1,
      "userBID": 2
}
Output



Now we can correctly identify each user with their fields.

   Fragments
The query above is not that bad, but it has one problem; we are repeating the same fields for both userA and userB.We could find something that will make out queries DRY.GraphQL includes reusable units called fragments that let you construct sets of fields, and then include them in queries where you need to.

   Query

query getUsersWithFragments($userAID: Int!, $userBID: Int!) {
   userA: user(id: $userAID) {
        ...userFields
   },
   userB: user(id: $userBID) {
        ...userFields
   }
}

fragment userFields on Person {
   name
   age
   gender
}

{
   "userAID": 1,
      "userBID": 2
}

// Directives

query getUsers($gender: String, $age: Boolean!, $id: Boolean!) {
   users(gender: $gender){
    ...userFields
   }
}

fragment userFields on Person {
   name
   age @skip(if: $age)
   id @include(if: $id)
}

{
   "gender": "F",
      "age": true,
         "id": true
}

//Mutation query
mutation updateUser($id: Int!, $name: String!, $age: String!) {
   updateUser(id: $id, name: $name, age: $age){
    ...userFields
   }
}

fragment userFields on Person {
   name
   age
   gender
}

{
   "id": 1,
      "name": "asdf",
         "age": "27"
}