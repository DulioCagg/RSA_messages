const express = require("express");
const RSA = require("./script");

let currentUser = "";
let users = {};
let messages = {};

const temp = ["Oscar", "Dulio", "Diana"];
const generateKeys = (name) => {
   const lower = name.toLowerCase();
   const size = RSA.toKey(lower);
   const keys = RSA.generate(size);
   users[name] = keys;
}

temp.forEach(user => generateKeys(user))

const app = express();
app.use(express.json());
app.use((req, res, next) => {
   console.log(req.method);
   console.log(req.url);
   console.log(req.body);
   next();
});

app.use(express.static("interface"));

app.get("/users", (req, res) => {
   const list = Object.keys(users).filter(user => user != currentUser);

   res.json({ users: list }).status(200);
});

app.get("/messages", (req, res) => {
   res.json(messages[currentUser]).status(200);
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
      from: currentUser,
      encrypted: encrypted_message,
      decrypted: decrypted_message
   }
   messages[to].push(messageToAdd);

   res.json({ encrypted: encrypted_message }).status(200);
});

app.post("/register", (req, res) => {
   const reqUser = req.body.username;

   currentUser = reqUser;
   console.log("The user loged in is: ", currentUser);
   if (typeof users[reqUser] === "undefined") {
      generateKeys(reqUser);
      messages[reqUser] = [];
      res.json({}).status(200);
   } else {
      res.json({}).status(200);
   }
});

app.listen(3000, () => console.log("Listening in port 3000"));