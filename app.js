const express = require('express'),
      {buildSchema} = require('graphql'),
      expressGraphHttp = require('express-graphql');

const app = express();
const PORT = '1234';

let schema = buildSchema(`
   type Query{
      hello: String
   }
`);

let root = {
   hello : () => "Hello, I am testiing!"
};


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