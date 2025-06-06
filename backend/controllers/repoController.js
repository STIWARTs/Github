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
//   try {
//     const repositories = await Repository.find({})
//       .populate("owner")
//       .populate("issues");

//     res.json(repositories);
//   } catch (err) {
//     console.error("Error during fetching repositories : ", err.message);
//     res.status(500).send("Server error");
//   }
}

async function fetchRepositoryById(req, res) { 
//   const { id } = req.params;
//   try {
//     const repository = await Repository.find({ _id: id })
//       .populate("owner")
//       .populate("issues");

//     res.json(repository);
//   } catch (err) {
//     console.error("Error during fetching repository : ", err.message);
//     res.status(500).send("Server error");
//   }
}

async function fetchRepositoryByName(req, res) {
//   const { name } = req.params;
//   try {
//     const repository = await Repository.find({ name })
//       .populate("owner")
//       .populate("issues");

//     res.json(repository);
//   } catch (err) {
//     console.error("Error during fetching repository : ", err.message);
//     res.status(500).send("Server error");
//   }
}

async function fetchRepositoriesForCurrentUser(req, res) {
//   console.log(req.params);
//   const { userID } = req.params;

//   try {
//     const repositories = await Repository.find({ owner: userID });

//     if (!repositories || repositories.length == 0) {
//       return res.status(404).json({ error: "User Repositories not found!" });
//     }
//     console.log(repositories);
//     res.json({ message: "Repositories found!", repositories });
//   } catch (err) {
//     console.error("Error during fetching user repositories : ", err.message);
//     res.status(500).send("Server error");
//   }
}

async function updateRepositoryById(req, res) {
//   const { id } = req.params;
//   const { content, description } = req.body;

//   try {
//     const repository = await Repository.findById(id);
//     if (!repository) {
//       return res.status(404).json({ error: "Repository not found!" });
//     }

//     repository.content.push(content);
//     repository.description = description;

//     const updatedRepository = await repository.save();

//     res.json({
//       message: "Repository updated successfully!",
//       repository: updatedRepository,
//     });
//   } catch (err) {
//     console.error("Error during updating repository : ", err.message);
//     res.status(500).send("Server error");
//   }
}

async function toggleVisibilityById(req, res) { //for making a repo public or private
//   const { id } = req.params;

//   try {
//     const repository = await Repository.findById(id);
//     if (!repository) {
//       return res.status(404).json({ error: "Repository not found!" });
//     }

//     repository.visibility = !repository.visibility;

//     const updatedRepository = await repository.save();

//     res.json({
//       message: "Repository visibility toggled successfully!",
//       repository: updatedRepository,
//     });
//   } catch (err) {
//     console.error("Error during toggling visibility : ", err.message);
//     res.status(500).send("Server error");
//   }
}

async function deleteRepositoryById(req, res) {
//   const { id } = req.params;
//   try {
//     const repository = await Repository.findByIdAndDelete(id);
//     if (!repository) {
//       return res.status(404).json({ error: "Repository not found!" });
//     }

//     res.json({ message: "Repository deleted successfully!" });
//   } catch (err) {
//     console.error("Error during deleting repository : ", err.message);
//     res.status(500).send("Server error");
//   }
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
