// async function connectClient() {  //
//   res.send("Client connected successfully!");
// }

async function signup(req, res) { 
  res.send("Signing up!");
}

async function login(req, res) {
  res.send("Logging in!");
}

// CRUD OPERATIONs
async function getAllUsers(req, res) {
  //For Search Result - shows Repo list and user list
  res.send("All users fetched!");
}

async function getUserProfile(req, res) {
  res.send("Profile fetched!");
}

async function updateUserProfile(req, res) {
  res.send("Profile updated!");
}

async function deleteUserProfile(req, res) {
  res.send("Profile deleted!");
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
