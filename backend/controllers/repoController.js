
async function createRepository(req, res) {
    res.send("Repository created successfully!");
}

async function getAllRepositories(req, res) {
    res.send("All repositories fetched successfully!");
}

async function fetchRepositoryById(req, res) {
    res.send("Repository fetched by ID successfully!");
}

async function fetchRepositoryByName(req, res) {
    res.send("Repository fetched by name successfully!");
}

async function fetchRepositoriesForCurrentUser(req, res) {
    res.send("Repositories for current user fetched successfully!");
}

async function updateRepositoryById(req, res) {
    res.send("Repository updated by ID successfully!");
}

async function toggleVisibilityById(req, res) { //for making a repository public or private
    res.send("Repository visibility toggled successfully!");
}

async function deleteRepositoryById(req, res) {
    res.send("Repository deleted by ID successfully!");
}

module.exports = {
  createRepository, //only authenticated user can access this route -----> for restricting access we made middleware auth and authorize
  getAllRepositories,
  fetchRepositoryById, 
  fetchRepositoryByName, 
  fetchRepositoriesForCurrentUser, // 
  updateRepositoryById, //
  toggleVisibilityById,
  deleteRepositoryById, //
};
