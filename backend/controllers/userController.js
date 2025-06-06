const jwt = require("jsonwebtoken");// For authentication--token issued by server and stored in browser local storage or cookies having timestamp to live
const bcrypt = require("bcryptjs"); // To bcrypt passwords before storing them in the database
const { MongoClient } = require("mongodb"); // To perform CRUD operations on MongoDB--Here using MongoDB native driver to connect to MongoDB and perform operations
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId; // To convert string(id fetch form url) to ObjectId for MongoDB queries

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
  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray(); //user fetch function to get all users from the "users" collection from mongoDB
    res.json(users);//.toArrar() to manuallly convert response into js array---if not show error not getting response,,,-->giver res array of object
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function getUserProfile(req, res) {
  const currentID = req.params.id; // Extracting the user ID from the request parameters (from url wee need id parameter)(e.g., /user/:id) to fetch the profile of a specific user

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({//findOne() method available in mongoDB,,,while in mongoose there is findById() method--working same but diffent syntax as per package use
      _id: new ObjectId(currentID), //provide _id constrains(auto gen in by mongodb), basis of finding user 
    });//converting currentID(string) to ObjectId because MongoDB uses ObjectId for its _id field

    if (!user) { // If no user is found with the given ID, return a 404 Not Found response
      return res.status(404).json({ message: "User not found!" });
    }

    res.send(user);
  } catch (err) {
    console.error("Error during fetching : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id; //which user profile to update--from url we need id parameter (e.g., /user/:id)
  const { email, password } = req.body; //  Destructuring the request body to get email and password for updating the user profile

  try { //
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    //To update password
    let updateFields = { email };
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    // Find the user by ID (as new gen by mongodb)and update the specified fields
    const result = await usersCollection.findOneAndUpdate( //if using mongoose package use findByIdAndUpdate() method
      {
        _id: new ObjectId(currentID),
      },
      { $set: updateFields },
      { returnDocument: "after" } // returnDocument: "after" option to return the updated document after the update operation
    );
    if (!result.value) { //if user not found
      return res.status(404).json({ message: "User not found!" }); //return count 
    }

    res.send(result.value); //updated user profile is sent in the response/frontend
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id; 

  try {
    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({//if using mongoose package use findByIdAndDelete() method
      _id: new ObjectId(currentID),
    });

    if (result.deleteCount == 0) { // If no user was deleted, return a 404 Not Found response
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
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
