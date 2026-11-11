import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeUnitProvider } from './context/ThemeUnitContext';
import { AuthProvider } from './context/AuthContext';
import { FitnessDataProvider } from './context/FitnessDataContext';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeUnitProvider>
      <AuthProvider>
        <FitnessDataProvider>
          <App />
        </FitnessDataProvider>
      </AuthProvider>
    </ThemeUnitProvider>
  </React.StrictMode>
);
