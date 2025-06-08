import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";//A library(givers a method to build map) for displaying a heatmap of user activity--tract recent contributions/commits of the user

// Function to generate random activity --(Creating Dummy Data generation for contributions track).//not stored in db
const generateActivityData = (startDate, endDate) => {
  const data = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const count = Math.floor(Math.random() * 50);//to generate random count of contributions for each day --50
    data.push({//store date and count (data gen--which are dates in terms of contribution here) in data array
      date: currentDate.toISOString().split("T")[0], //YYY-MM-DD
      count: count,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return data;
};

//Dummy data generation for contributions track//color shades logic for heatmap
const getPanelColors = (maxCount) => { //color/shades logic for heatmap
  const colors = {};
  for (let i = 0; i <= maxCount; i++) {
    const greenValue = Math.floor((i / maxCount) * 255);
    colors[i] = `rgb(0, ${greenValue}, 0)`;
  }

  return colors;
};

const HeatMapProfile = () => {
  const [activityData, setActivityData] = useState([]);
  const [panelColors, setPanelColors] = useState({});//set having unique properties to store only unique values//means no color shades are repeated

  useEffect(() => {
    const fetchData = async () => {
      const startDate = "2001-01-01";
      const endDate = "2001-01-31";
      const data = generateActivityData(startDate, endDate);
      setActivityData(data);

      const maxCount = Math.max(...data.map((d) => d.count));// Find the maximum count of contributions in a given day to determine color shades(no of contributions in a day is equivalent to count/shades of color)
      setPanelColors(getPanelColors(maxCount));
    };

    fetchData();
  }, []);

  return (
    <div>
      <h4>Recent Contributions</h4>
      <HeatMap
        className="HeatMapProfile"
        style={{ maxWidth: "700px", height: "200px", color: "white" }}
        value={activityData}
        weekLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
        startDate={new Date("2001-01-01")}
        rectSize={15}
        space={3}
        rectProps={{
          rx: 2.5,
        }}
        panelColors={panelColors}
      />
    </div>
  );
};

export default HeatMapProfile;
