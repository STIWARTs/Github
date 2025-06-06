//packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); //cors(for security reasons, use when creating custom servers) is a middleware that allows or restricts resources to be requested from another domain outside the domain from which the first resource was served
const mongoose = require("mongoose"); //helps in connecting to MongoDB and for CRUD operations performed on the database
const bodyParser = require("body-parser"); //reads the data/body form requests and parses it into a format that can be easily send to response used by the application, such as JSON(converts js to json or vice versa)
const http = require("http"); //http module is used "to create an HTTP server" that can handle requests and responses
const { Server } = require("socket.io"); //socket.io is a library that enables real-time, bidirectional communication between clients and servers over WebSockets or other protocols
// const mainRouter = require("./routes/main.router");

const yargs = require("yargs"); //
const { hideBin } = require("yargs/helpers"); //utility in yargs helps in reading args

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

yargs(hideBin(process.argv)) // Initialize yargs, argv taken form command, hideBin helps in parsing the arguments

  .command("start", "Starts a new server", {}, startServer) // Command name, description, parameters, actual logic/function(startServer()) when command is called which is not in controllers...which is here in index.js--for backend server

    // Command based setup for the git-like functionality
  .command("init", "Initialise a new repository", {}, initRepo) // Command name, description, parameters, actual logic/function when command is called which is in controllers init.js
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => { // When the add command is called, it takes a file "argument' (passed as argv) and calls the addRepo function with that file path
      addRepo(argv.file);
    }
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    }
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull commits from S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Comit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    }
  )
  .demandCommand(1, "You need at least one command") // Require at least one command to be executed ************************************
  .help().argv; // Display help information if --help is passed or if no command is provided 


  //// Function to start the server

// function startServer() { // node index.js start
//   console.log("Server logic called!");
// }

function startServer() { //Server initialize / Start with express and within express server Connect to MongoDB 
  const app = express(); // Create an instance of express app
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

// Connect to MongoDB
  const mongoURI = process.env.MONGODB_URI;

  mongoose
    .connect(mongoURI)
    //additional options to avoid deprecation warnings
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("Unable to connect : ", err));

  app.use(cors({ origin: "*" })); // Use CORS middleware to allow requests from any origin/url/location

  app.get("/", (req, re) => { //to test the server is running--via thunder client or postman or browser
    re.send("Welcome!");
  });

  // app.use("/", mainRouter);

//SOCKET CREATION 
  let user = "test"; // Initialize a variable to store the user ID, defaulting to "test" (before any user joins/loggedin the room--after the user joins, it will be updated with the actual user ID)
  const httpServer = http.createServer(app); // // Create an HTTP server using the express app
  const io = new Server(httpServer, { // Create a new instance of Socket.IO server using the HTTP server
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => { //on the socket connection, it listens for the "connection" event, which is triggered when a client connects to the server
    socket.on("joinRoom", (userID) => { // When a client emits the "joinRoom" event, it takes the userID as an argument
      user = userID;
      console.log("=====");//now user/you is part of the room/socket etc
      console.log(user);
      console.log("=====");
      socket.join(userID);
    });
  });

// FOR DATABASE CONNECTION
  const db = mongoose.connection;

  db.once("open", async () => { //via socket.io, it listens for the "open" event on the MongoDB connection, which indicates that the connection to the database has been established successfully
    console.log("CRUD operations called");
    // CRUD operations
  });

//Create a server
  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}
