
async function createIssue(req, res) {
  res.send("Issue created successfully");
}

async function updateIssueById(req, res) {
  res.send("Issue updated successfully");
}

async function deleteIssueById(req, res) {
  res.send("Issue deleted successfully");
}

async function getAllIssues(req, res) {
  res.send("All issues retrieved successfully");
}

async function getIssueById(req, res) {
  res.send("Issue retrieved successfully");
}

module.exports = {
  createIssue,
  updateIssueById,
  deleteIssueById,
  getAllIssues,
  getIssueById,
};
