// import React from "react";
// const Dashboard = () => {
//   return <h1>Dashboard</h1>
// }
// export default Dashboard;

import React, { useState, useEffect } from "react";
import "./dashboard.css";
// import Navbar from "../Navbar";


// ///first write functionality fetching data from backend to console then going to implement UI
const Dashboard = () => {

//     // State variables to hold repositories, search query, suggested repositories, and search results
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

//   //logic
  useEffect(() => { //1. for fetching all repositories and suggested repositories
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => { // Fetch repositories for the logged-in user
      try {
        const response = await fetch(
          `http://localhost:3002/repo/user/${userId}`
        );
        const data = await response.json();
        // console.log(data);
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => { // Fetch all repositories to suggest
      try {
        const response = await fetch(`http://localhost:3002/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
        // console.log(suggestedRepositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      } 
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

//   useEffect(() => { //2. for filtering repositories based on search query //local search
//     if (searchQuery == "") {
//       setSearchResults(repositories);
//     } else {
//       const filteredRepo = repositories.filter((repo) =>
//         repo.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setSearchResults(filteredRepo);
//     }
//   }, [searchQuery, repositories]);

  return (
    <h1>Dashboard</h1>
//     <>
//       <Navbar />
//       <section id="dashboard">
//         <aside>
//           <h3>Suggested Repositories</h3>
//           {suggestedRepositories.map((repo) => {
//             return (
//               <div key={repo._id}>
//                 <h4>{repo.name}</h4>
//                 <h4>{repo.description}</h4>
//               </div>
//             );
//           })}
//         </aside>
//         <main>
//           <h2>Your Repositories</h2>
//           <div id="search">
//             <input
//               type="text"
//               value={searchQuery}
//               placeholder="Search..."
//               onChange={(e) => setSearchQuery(e.target.value)}
//             />
//           </div>
//           {searchResults.map((repo) => {
//             return (
//               <div key={repo._id}>
//                 <h4>{repo.name}</h4>
//                 <h4>{repo.description}</h4>
//               </div>
//             );
//           })}
//         </main>
//         <aside>
//           <h3>Upcoming Events</h3>
//           <ul>
//             <li>
//               <p>Tech Conference - Dec 15</p>
//             </li>
//             <li>
//               <p>Developer Meetup - Dec 25</p>
//             </li>
//             <li>
//               <p>React Summit - Jan 5</p>
//             </li>
//           </ul>
//         </aside>
//       </section>
//     </>
  );
};

export default Dashboard;
