const express = require('express'),
      {buildSchema} = require('graphql'),
      expressGraphHttp = require('express-graphql');

const app = express();
const PORT = '1234';

let users = require('./dummyData.js').users;

// console.log(users);
/* Test */
/* test schema */
// let schema = buildSchema(`
//    type Query{
//       hello: String
//    }
// `);

/* test root work */
// let root = {
//    hello : () => "Hello, I am testiing!"
// };

let schema = buildSchema(`

   type Query{
      user(id: Int!): Person,
      users(gender: String): [Person]
   }

   type Person{

      id: Int,
      name: String,
      age: Int,
      gender: String,

   }

`);


let retriveUser = (args) => {
   let userId = args.id;

   return users.filter((user) => {
      return user.id === userId;
   })[0];

}

let retriveUsers = (args) => {
   
   if (args.gender) {
      var gender = args.gender;
      return users.filter(user => user.gender === gender);
   } else {
      return users;
   }

}

let root = {
   user: retriveUser,
   users: retriveUsers
}







app.use('/graphql', expressGraphHttp({
   schema: schema, 
   rootValue: root,
   graphiql: true,
}));


app.listen(PORT, (err) => {
   
   if(!err){
      console.log("The server is listening to port:", PORT);
   }else{
      console.log("Error while running to the server", err);
   }

});