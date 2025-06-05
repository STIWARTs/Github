const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // external package to generate unique IDs for commits

async function commitRepo(message) { // Function to commit staged files with a message
  const repoPath = path.resolve(process.cwd(), ".apnaGit"); //extracts the cwd path and appends the .apnaGit folder to it ("append" means adding new data at the end of the file without removing the existing content.)
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try { 
    const commitID = uuidv4(); // Generate a unique commit ID using uuidv4(method/constructor) and store it in commitID variable
    const commitDir = path.join(commitPath, commitID); // extracts the commit path and appends the commitID to it, creating a unique directory for each commit (names same as the commit ID)
    await fs.mkdir(commitDir, { recursive: true }); // Create the commit directory

    const files = await fs.readdir(stagedPath); // Read the files from the staging area(staging directory) and store them in files variable
    for (const file of files) { // Iterate through each file in the staging area & copy / paste them into the commit directory of name commitID
      await fs.copyFile(
        path.join(stagedPath, file), // copy
        path.join(commitDir, file) // paste 
      );
    }

    await fs.writeFile( // Write commit metadata (to tract the data when move, message)to a JSON file in the commit directory
      path.join(commitDir, "commit.json"),// create a commit.json file in the commit directory
      JSON.stringify({ message, date: new Date().toISOString() }) // write the message and date in JSON format    
    );

    console.log(`Commit ${commitID} created with message: ${message}`);
  } catch (err) {
    console.error("Error committing files : ", err);
  }
}

module.exports = { commitRepo };
