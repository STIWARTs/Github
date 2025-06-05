const fs = require("fs");
const path = require("path");
const { promisify } = require("util");// Using promisify to convert callback-based functions to promise-based ones 

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(commitID) { //logic to revert the repository to a specific commit
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID); //path//reading/find in the commit directory based on the commitID given by user
    const files = await readdir(commitDir); //read --if empty then it will throw an error
    const parentDir = path.resolve(repoPath, ".."); //if getting then give it to parent directory

    for (const file of files) {
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log(`Commit ${commitID} reverted successfully!`);
  } catch (err) {
    console.error("Unable to revert : ", err);
  }
}

module.exports = { revertRepo };
