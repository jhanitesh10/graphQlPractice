const express = require('express'),
      graphQl = require('graphql'),
      expressGraph = require('express-graphql');

const app = express();
const PORT = '1324';

app.listen(PORT, (err) => {
   
   if(!err){
      console.log("The server is listening to port:", PORT);
   }else{
      console.log("Error while running to the server", err);
   }
   
});