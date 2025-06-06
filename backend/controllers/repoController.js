const mongoose = require("mongoose");//Here using mongoose package to interact with MongoDB database
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository(req, res) { //Taking the request and response objects as parameters, which are provided by Express.js when a request is made to the endpoint---user enter data via UI and click on create repo button, it will trigger this function
  //req.body contains the data sent in the request body, which is typically used for POST requests and save the data to the database and return a response to the client as JSON (message and repository ID)
  const { owner, name, issues, content, description, visibility } = req.body; //When triggering RepoCreate event  or clicked button((after inserting all inputs) ---it make a post request(https://localhost/3000/repo/create ,,,endpoint) to the backend with the body containing the owner, name, issues, content, description and visibility of the repository which extracted using req.body written in controllers(containing function/logic occered when their endpoint request occures)

  try {
    if (!name) { //For others checking is optional but for name & owner it is required
      return res.status(400).json({ error: "Repository name is required!" });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) { //owner is the user ID of the owner of the repository, so it should be a valid ObjectId
      return res.status(400).json({ error: "Invalid User ID!" });
    }

    const newRepository = new Repository({ //Creating a new instance of the Repository model with the provided data in the request body UI
      name,
      description,
      visibility,
      owner,
      content,
      issues,
    });

    const result = await newRepository.save(); //Saving the new repository to the database

    res.status(201).json({
      message: "Repository created!",
      repositoryID: result._id,
    });
  } catch (err) {
    console.error("Error during repository creation : ", err.message);
    res.status(500).send("Server error");
  }
}

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})//as mongoose is used to interact with MongoDB, Repository.find({})--directly implement in the model...(in mongodb find() method is used to retrieve documents from a collection) will return all the repositories in the database
      .populate("owner") //ext obj //populate() -- for sirf owner id return n ho balki uska data return ho
      .populate("issues"); //ext obj

    res.json(repositories);
  } catch (err) {
    console.error("Error during fetching repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function fetchRepositoryById(req, res) { 
  const { id } = req.params;
  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error"); 
  }
}

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

//ALL below 4's are accessed by the user who is logged in, so we need to check if the user is authenticated and authorized to access these routes
async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params; //as user logged in, so we can get the user ID(and token as well are saved in local storage) from the request parameters

  try {
    const repositories = await Repository.find({ owner: userID }); //searching based on owner ID(user id) matches with the user ID in the database

    if (!repositories || repositories.length == 0) { //if no repositories found for the user
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body; //content is an array of strings, description is a string--only these two fields are can be possible to updated in the repository

  try { //logic
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }
    // update values as repo exists
    repository.content.push(content);//add new content to the existing content array
    repository.description = description; //update the description of the repository //override

    const updatedRepository = await repository.save();//save the updated repository to the database

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server error");
  }
}

async function toggleVisibilityById(req, res) { //for making a repo public or private
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility = !repository.visibility; //as boolean value is used for visibility, so toggling it will change the visibility from public to private or vice versa

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during toggling visibility : ", err.message);
    res.status(500).send("Server error");
  }
}

async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id); //delete the repository by its ID
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}
module.exports = {
  createRepository, //only authenticated user can access this route -----> for restricting access we made middleware auth and authorize
  getAllRepositories,
  fetchRepositoryById, 
  fetchRepositoryByName, 
  fetchRepositoriesForCurrentUser, // 
  updateRepositoryById, //
  toggleVisibilityById, //---
  deleteRepositoryById, //
};
