import React, { useState } from 'react';
import App from './App.jsx';
import App2 from "./App2.jsx";


const AppToggle = () => {
  const [showFirst, setShowFirst] = useState(true);

  return (
    <div>
      <button onClick={() => setShowFirst(!showFirst)}> {/* Toggles button*/}
        Switch to {showFirst ? 'Mad Science Draft 3 Data' : 'Mad Science Draft 2 Data'}
      </button>

      {/* Determines which page to show */}
      <div style={{ marginTop: '20px' }}>
        {showFirst ? <App /> : <App2 />}
      </div>
    </div>
  );
};

export default AppToggle;
