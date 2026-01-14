import { useState } from 'react'
import './App.css'

function App() {
  const [isCreated, setIsCreated] = useState(false);
  const [showData, setShowData] = useState(false);
  const [dataResto, setDataResto] = useState([]);
  const [dataSurvey, setDataSurvey] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showRank, setShowRank] = useState(false);
  const [dataRank, setDataRank] = useState([]);

  const [showSpecificRank, setShowSpecificRank] = useState(false);
  const [dataSpecificRank, setDataSpecificRank] = useState([]);

  const [showLogic, setShowLogic] = useState(false);
  const targetNumber = 1225441;

  const [showLoop1, setShowLoop1] = useState(false);
  const [showLoop2, setShowLoop2] = useState(false);
  const [showLoopX, setShowLoopX] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/create-tables', { method: 'POST' });
      if (response.ok) {
        setIsCreated(true);
      }
    } catch (error) {
      alert("Error connection");
    } finally {
      setLoading(false);
    }
  };

  const handleShow = async () => {
    try {
      const response = await fetch('http://localhost:3000/get-all-data');
      const result = await response.json();
      setDataResto(result.restaurant);
      setDataSurvey(result.survey);
      setShowData(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowRank = async () => {
    try {
      const response = await fetch('http://localhost:3000/get-average-ratings');
      const result = await response.json();
      setDataRank(result);
      setShowRank(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowSpecificRank = async () => {
    try {
      const response = await fetch('http://localhost:3000/get-specific-ratings');
      const result = await response.json();
      setDataSpecificRank(result);
      setShowSpecificRank(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <h2>Create Table</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleCreate}
          disabled={isCreated || loading}
          style={{ backgroundColor: isCreated ? 'grey' : '#007bff' }}
        >
          {loading ? "Processing..." : "Create"}
        </button>
      </div>

      {isCreated && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'green' }}>Table Succesfully Created</h3>

          <button onClick={handleShow} style={{ backgroundColor: '#28a745' }}>
            Show
          </button>
        </div>
      )}

      {showData && (
        <div style={{ textAlign: 'center' }}>
          <hr />
          <h3>TMASTERRESTAURANT</h3>
          <table style={{ margin: '0 auto', width: '100%' }}>
            <thead>
              <tr>
                <th>RESTAURANT_ID</th><th>RESTAURANT_NAME</th><th>ORIGIN</th><th>LOCATION</th>
              </tr>
            </thead>
            <tbody>
              {dataResto.map(row => (
                <tr key={row.RESTAURANT_ID}>
                  <td>{row.RESTAURANT_ID}</td>
                  <td>{row.RESTAURANT_NAME}</td>
                  <td>{row.ORIGIN}</td>
                  <td>{row.LOCATION}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />

          <h3>TRESTAURANTSURVEY</h3>
          <table style={{ margin: '0 auto', width: '100%' }}>
            <thead>
              <tr>
                <th>SURVEY_ID</th><th>PARTICIPANT_NAME</th><th>GENDER</th><th>AGE</th><th>RESTAURANT_ID</th><th>RATING_VALUE</th>
              </tr>
            </thead>
            <tbody>
              {dataSurvey.map(row => (
                <tr key={row.SURVEY_ID}>
                  <td>{row.SURVEY_ID}</td>
                  <td>{row.PARTICIPANT_NAME}</td>
                  <td>{row.GENDER}</td>
                  <td>{row.AGE}</td>
                  <td>{row.RESTAURANT_ID}</td>
                  <td>{row.RATING_VALUE}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {showData && (
        <div style={{ marginTop: '30px', borderTop: '2px dashed #333', paddingTop: '20px' }}>
          <h2>Highest to Lowest</h2>

          <button
            onClick={handleShowRank}
            disabled={showRank}
            style={{ backgroundColor: showRank ? 'grey' : '#ffc107', color: 'black' }}
          >
            Show
          </button>

          {showRank && (
            <div style={{marginTop: '20px' }}>
              <table style={{ margin: '0 auto', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Restaurant Name</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {dataRank.map((row, index) => (
                    <tr key={index}>
                      <td>{row['Restaurant Name']}</td>
                      <td>{row['Average Rating']}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {showData && (
        <div style={{ marginTop: '30px', borderTop: '2px dashed #333', paddingTop: '20px' }}>
          <h2>Rating (Male {'>'} 30 Years)</h2>

          <button
            onClick={handleShowSpecificRank}
            disabled={showSpecificRank}
            style={{ backgroundColor: showSpecificRank ? 'grey' : '#dc3545' }}
          >
            Show
          </button>

          {showSpecificRank && (
            <div style={{marginTop: '20px' }}>
              <table style={{ margin: '0 auto', width: '100%' }}>
                <thead>
                  <tr>
                    <th>Restaurant Name</th>
                    <th>Average Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {dataSpecificRank.length > 0 ? (
                    dataSpecificRank.map((row, index) => (
                      <tr key={index}>
                        <td>{row['Restaurant Name']}</td>
                        <td>{row['Average Rating']}</td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="2">Tidak ada data yang cocok.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: '30px', borderTop: '2px dashed #333', paddingTop: '20px', paddingBottom: '50px' }}>
        <h2>{targetNumber.toLocaleString()}</h2>

        <button
          onClick={() => setShowLogic(true)}
          disabled={showLogic}
          style={{ backgroundColor: showLogic ? 'grey' : '#6f42c1' }}
        >
          Generate
        </button>

        {showLogic && (
          <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold', fontFamily: 'monospace' }}>
            {targetNumber.toString().split('').map((digit, index) => {

              const len = targetNumber.toString().length;
              const zeros = len - 1 - index;
              const value = digit * Math.pow(10, zeros);

              if (value === 0) return null;

              return (
                <div key={index} style={{ marginBottom: '5px' }}>
                  {value.toLocaleString()}
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div style={{ marginTop: '30px', borderTop: '2px dashed #333', paddingTop: '20px', paddingBottom: '50px' }}>
        <h2>Looping</h2>

        <div style={{ marginBottom: '20px' }}>
          <h3>Output: +1</h3>
          <button onClick={() => setShowLoop1(true)} disabled={showLoop1}>Show</button>

          {showLoop1 && (
            <div style={{borderTop: '2px dashed #333', paddingTop: '20px' }}>

              {(() => {
                let items = [];
                for (let i = 1; i <= 10; i++) {
                  items.push(<div key={i}>{i}</div>);
                }
                return items;
              })()}

            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Output: Fibonacci</h3>
          <button onClick={() => setShowLoop2(true)} disabled={showLoop2}>Show</button>

          {showLoop2 && (
            <div style={{borderTop: '2px dashed #333', paddingTop: '20px' }}>

              {(() => {
                let sequence = [1, 2];
                for (let i = 2; i < 10; i++) {
                  sequence.push(sequence[i - 1] + sequence[i - 2]);
                }
                return sequence.map((num, index) => (
                   <div key={index}>{num}</div>
                ));
              })()}

            </div>
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Output: +x</h3>
          <button onClick={() => setShowLoopX(true)} disabled={showLoopX}>Show</button>

          {showLoopX && (
            <div style={{borderTop: '2px dashed #333', paddingTop: '20px' }}>

              {(() => {
                let items = [];
                for (let i = 1; i <= 5; i++) {
                  let text = "";
                  for (let j = 0; j < i; j++) {
                    text += "x";
                  }
                  items.push(<div key={i}>{text}</div>);
                }
                return items;
              })()}

            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default App