import React, { useState } from 'react';
import './App.css';
import myImage from "./myImage.jpg";

const activities = [
  'Drawing', 'Dancing', 'Singing', 'Sports', 'Video Game', 'Acting',
  'Travelling', 'Gardening', 'Animals', 'Photography', 'Teaching', 'Exercise', 
  'Coding', 'Electricity Components', 'Mechanic Parts', 'Computer Parts',
  'Researching', 'Architecture', 'Historic Collection', 'Botany', 'Zoology',
  'Physics', 'Accounting', 'Economics', 'Sociology', 'Geography', 'Psychology',
  'History', 'Science', 'Business Education', 'Chemistry', 'Mathematics', 
  'Biology', 'Makeup', 'Designing', 'Content Writing', 'Crafting', 'Literature',
  'Reading', 'Cartooning', 'Debating', 'Astrology', 'Hindi', 'French', 'English', 
  'Urdu', 'Other Language', 'Solving Puzzles', 'Gymnastics', 'Yoga', 'Engineering',
  'Doctor', 'Pharmacist', 'Cycling', 'Knitting', 'Director', 'Journalism', 'Business',
  'Listening Music'
];

function App() {
  // Initialize the selections state with "No" for all activities
  const initialSelections = activities.reduce((acc, activity) => {
    acc[activity] = 'No';
    return acc;
  }, {});

  const [selections, setSelections] = useState(initialSelections);
  const [predictions, setPredictions] = useState([]);
  const [firstPrediction, setFirstPrediction] = useState(null);
  const [otherPredictions, setOtherPredictions] = useState([]);

  const handleSelection = (activity, value) => {
    setSelections({
      ...selections,
      [activity]: value,
    });
  };

  const handleSubmit = async () => {
    const binaryData = activities.map(activity => selections[activity] === 'Yes' ? 1 : 0);
    
    try {
      const response = await fetch('http://localhost:3001/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: binaryData }),
      });
  
      const result = await response.json();
      console.log("Response from server:", result); // Log response to check it
  
      // Check if the result has the `prediction` property
      if (result.prediction && Array.isArray(result.prediction)) {
        setPredictions(result.prediction);
        setFirstPrediction(result.prediction[0]); // Set the first prediction
        setOtherPredictions(result.prediction.slice(1)); // Set the rest of the predictions
      } else {
        alert(`Unexpected response: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <img src={myImage} alt="Webapp's logo" className='cclogo'/>
        <h2 className="navbar-title">CareerCompass: Your Guide to Career Success</h2>
      </nav>

      {/* Main Content */}
      <h1>Choose Your Activities</h1>
      <div className="activity-list">
        {activities.map((activity, index) => (
          index % 2 === 0 ? (
            <div className="activity-row" key={index}>
              <div className="activity-item">
                <span>{activities[index]}</span>
                <div className="radio-buttons">
                  <label>
                    <input
                      type="radio"
                      name={activities[index]}
                      value="Yes"
                      onChange={() => handleSelection(activities[index], 'Yes')}
                      checked={selections[activities[index]] === 'Yes'}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={activities[index]}
                      value="No"
                      onChange={() => handleSelection(activities[index], 'No')}
                      checked={selections[activities[index]] === 'No'}
                    />
                    No
                  </label>
                </div>
              </div>
              {activities[index + 1] && (
                <div className="activity-item">
                  <span>{activities[index + 1]}</span>
                  <div className="radio-buttons">
                    <label>
                      <input
                        type="radio"
                        name={activities[index + 1]}
                        value="Yes"
                        onChange={() => handleSelection(activities[index + 1], 'Yes')}
                        checked={selections[activities[index + 1]] === 'Yes'}
                      />
                      Yes
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={activities[index + 1]}
                        value="No"
                        onChange={() => handleSelection(activities[index + 1], 'No')}
                        checked={selections[activities[index + 1]] === 'No'}
                      />
                      No
                    </label>
                  </div>
                </div>
              )}
            </div>
          ) : null
        ))}
      </div>
      <button className="submit-button" onClick={handleSubmit}>Submit</button>

      {/* Display predictions */}
      {firstPrediction && (
        <div className="predictions">
          <h2>Predicted Course:</h2>
          <p>{firstPrediction}</p>
        </div>
      )}

      {otherPredictions.length > 0 && (
        <div className="predictions" style={{paddingTop: "10px"}}>
          <h3>Other courses you might be interested in:</h3>
          <ul>
            {otherPredictions.map((course, index) => (
              <li key={index}>{course}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
