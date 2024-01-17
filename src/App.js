import React, { useState, useMemo, useEffect, useCallback } from 'react';
import AnalyticsTable from './component/AnalyticsTable';
import './App.css'; // This is where you'd import your dark-themed CSS

const App = () => {

  // Render the app
  return (
    <div className="App">
      <h1>Analytics Dashboard</h1>
      <AnalyticsTable/>
    </div>
  );
}

export default App;
