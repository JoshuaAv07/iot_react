import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [ data, setData ] = useState([]);
  const [reportedBy, setReportedBy] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/arduino/getAll');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(fetchData, 2000); // 10000ms = 10 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  
  // Logic to determine the class to apply based on conditions
  const getClassName = (status) => {
    if (status === "Safe") return "safe";
    if (status === "Warning") return "warning";
    if (status === "Danger") return "danger";
    if (status === "Contaminated") return "contaminated";
    return ""; // Default case if no condition is met
  };

  const lastItem = data[data.length - 1]; // Only the last item
  console.log(lastItem)

  const createReport = async () => {
    if (!lastItem) {
      alert("No data to report.");
      return;
    }

    const reportPayload = {
      value: lastItem.value,
      reportedBy: reportedBy, // Replace with dynamic input if needed
      timestamp: new Date().toLocaleString(),
      status: lastItem.status
    };

    try {
      const response = await fetch("http://localhost:3000/report/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reportPayload)
      });

      if (response.ok) {
        alert("Report created successfully!");
      } else {
        alert("Failed to create report.");
      }
    } catch (error) {
      console.error("Error sending report:", error);
      alert("Error sending report.");
    }
  };

  return (
    <>
      <h1>Machine 25</h1>
      <div className="panel">
      <p className='text'>Air Quality Index: {lastItem?.value}</p>
        {lastItem && (
          <div className={getClassName(lastItem?.status)}></div>
        )}
        <div>
            
            <h1 className='label'>{lastItem?.status}</h1>
        </div>
        <input
          type="text"
          value={reportedBy}
          onChange={(e) => setReportedBy(e.target.value)}
        />
        <button onClick={createReport} style={{ marginTop: "20px" }}>
          Create Report
        </button>
      </div>
    </>
  )
}

export default App
