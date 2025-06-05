const fs = require("fs").promises;
const path = require("path"); 
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo() { //same logic copy staging to commits here then push commits to S3
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits"); 

  try {
    const commitDirs = await fs.readdir(commitsPath);
    for (const commitDir of commitDirs) { //for each commit directory --as having multiple commits in the commits directory
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) { // for each file in the commit directory
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const params = { // S3 upload parameters
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };

        await s3.upload(params).promise();
      }
    }

    console.log("All commits pushed to S3.");
  } catch (err) {
    console.error("Error pushing to S3 : ", err);
  }
}

module.exports = { pushRepo };
