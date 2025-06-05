const fs = require("fs").promises;
const path = require("path");

async function addRepo(filePath) { // Taking filePath as an argument, which is the path of the file to be added to the staging area(in which files are temporarily stored before committing)
  const repoPath = path.resolve(process.cwd(), ".apnaGit"); // getting the path of the .apnaGit directory in the current working directory
  const stagingPath = path.join(repoPath, "staging"); // creating the staging directory inside the .apnaGit directory

  try { // actual logic of the addRepo function
    await fs.mkdir(stagingPath, { recursive: true }); // creates the staging directory inside .apnaGit, recursive: true allows creation of parent directories if they do not exist
    const fileName = path.basename(filePath); // gets the file name from the provided(user) filePath using path.basename
    await fs.copyFile(filePath, path.join(stagingPath, fileName)); // copies the file from the provided filePath to the staging directory, using path.basename to get the file name from the provided path
    console.log(`File ${fileName} added to the staging area!`);
  } catch (err) {
    console.error("Error adding file : ", err);
  }
}

module.exports = { addRepo };
