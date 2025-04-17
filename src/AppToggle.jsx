import React, { useState } from 'react';
import App from './App';
import App2 from './App2';

const AppToggle = () => {
  const [showFirst, setShowFirst] = useState(true);

  return (
    <div>
      <button onClick={() => setShowFirst(!showFirst)}>
        Switch to {showFirst ? 'Mad Science Draft 3' : 'Mad Science Draft 2'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {showFirst ? <App /> : <App2 />}
      </div>
    </div>
  );
};

export default AppToggle;
