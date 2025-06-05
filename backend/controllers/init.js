const fs = require("fs").promises; //fs-filesystem,, promises- an utility helps in creating files --for files auto creation
const path = require("path"); // to track the path of files and directories

async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit"); //getting path of directory getting form process.cwd() and makes/creates .apnaGit..which is a hidden folder in the current working directory
  const commitsPath = path.join(repoPath, "commits"); // creating commits folder inside the .apnaGit directory

  try { //actual logic of the initRepo function
    await fs.mkdir(repoPath, { recursive: true }); // creates the .apnaGit directory, recursive: true allows creation of parent directories if they do not exist
    await fs.mkdir(commitsPath, { recursive: true }); // creates the commits directory inside .apnaGit, recursive: true allows creation of parent directories if they do not exist
    await fs.writeFile( // creates a config file inside .apnaGit directory
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: process.env.S3_BUCKET }) // writes the S3 bucket name to the config file, using process.env.S3_BUCKET to get the bucket name from environment variables
    );
    console.log("Repository initialised!");
  } catch (err) {
    console.error("Error initialising repository", err);
  }
}

module.exports = { initRepo };
