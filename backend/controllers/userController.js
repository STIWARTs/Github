const jwt = require("jsonwebtoken");// For authentication--token issued by server and stored in browser local storage or cookies having timestamp to live
const bcrypt = require("bcryptjs"); // To bcrypt passwords before storing them in the database
const { MongoClient } = require("mongodb"); // To perform CRUD operations on MongoDB
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();//To use environment variables from .env file
const uri = process.env.MONGODB_URI; // MongoDB connection URI from .env file

let client;//global variable which setup the connection to MongoDB

async function connectClient() { //To connect to MongoDB
  if (!client) {// If client is not already connected, create a new MongoClient instance
    client = new MongoClient(uri, { //pass uri - mongodb connection string
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await client.connect();
  }
}


async function signup(req, res) { 
   const { username, password, email } = req.body; // Destructuring the request body to get username, password, and email ---request.body from the client side which is sent via postman or thunder client or browser
  try {
    await connectClient(); //Connect to MongoDB before performing any operations
    const db = client.db("githubclone"); // Access the database named "githubclone" (it will be created if it doesn't exist)
    const usersCollection = db.collection("users"); // Access the "users" collection (it will be created if it doesn't exist)

    // Check if a user with the given username already exists in the database
    const user = await usersCollection.findOne({ username }); 
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    //To Create a new user
    const salt = await bcrypt.genSalt(10); // Generate a salt for hashing the password
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password using the generated salt

    const newUser = { // Create a new user object to be inserted into the database
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = await usersCollection.insertOne(newUser); // Insert the new user into the "users" collection

    // Generate a JWT token for the newly created user return it in the response
    const token = jwt.sign( 
      { id: result.insertId },// id created by MongoDB for the new user
      process.env.JWT_SECRET_KEY, // Secret key for signing the JWT token from .env file
      { expiresIn: "1h" } // Token expiration time set to 1 hour
    );
    res.json({ token, userId: result.insertId });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Server error");
  }
}

async function login(req, res) {
  const { email, password } = req.body; // Destructuring the request body to get email and password -- combination for login
  try {
    await connectClient();//connection stablish
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email }); //Find user if credentials are correct and store in user variable
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const isMatch = await bcrypt.compare(password, user.password); //Matching token -validity..user encrypted password with stored hashed password
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { //If token is valid, then extended the expiresIn time
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id }); // Send the token and user ID in the response
  } catch (err) {
    console.error("Error during login : ", err.message);
    res.status(500).send("Server error!");
  }
}

// CRUD OPERATIONs
async function getAllUsers(req, res) {
  //For Search Result - shows Repo list and user list
  res.send("All users fetched!");
}

async function getUserProfile(req, res) {
  res.send("Profile fetched!");
}

async function updateUserProfile(req, res) {
  res.send("Profile updated!");
}

async function deleteUserProfile(req, res) {
  res.send("Profile deleted!");
}

module.exports = {
  // Exporting the functions to be used in routes--(using require syntax in routes)
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
