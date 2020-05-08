const express = require("express");
const RSA = require("./script");

let login = "";
let users = {};
let messages = {};

const temp = ["Oscar", "Dulio", "Diana"];

const generateKeys = (name) => {
   let size = RSA.toKey(name);
   let keys = RSA.generate(size);
   const user = {
      n: keys.n,
      d: keys.d,
      e: keys.e,
   };
   users[name] = user;
}

temp.map(user => {
   generateKeys(user);
})


const app = express();

app.use(express.json());

app.use("/", express.static("./interface/"));

app.get("/", (req, res) => {

});

app.get("/users", (req, res) => {
   const list = Object.keys(users).filter(user => user != login);

   res.json({ users: list }).status(200);
});

app.get("/messages", (req, res) => {
   res.json(messages[login]).status(200);
});

app.post("/send", (req, res) => {
   const message = req.body.message;
   const to = req.body.to;

   keys = users[to];
   const encoded_message = RSA.encode(message);
   const encrypted_message = RSA.encrypt(encoded_message, keys.n, keys.e);
   const decrypted_message = RSA.decrypt(encrypted_message, keys.d, keys.n);
   const decoded_message = RSA.decode(decrypted_message);
   const messageToAdd = {
      message,
      from: login,
      encrypted: encrypted_message,
      decrypted: decrypted_message
   }
   messages[to].push(messageToAdd);

   res.json({ encrypted: encrypted_message }).status(200);
});

app.post("/register", (req, res) => {
   const reqUser = req.body.username;

   if (users[reqUser] == typeof "undefined") {
      generateKeys(reqUser)
      messages[reqUser] = [];
   }

   login = reqUser;
   res.json().status(200);
});

app.listen(3000, () => console.log("Listening in port 3000"));