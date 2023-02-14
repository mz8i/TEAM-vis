import './App.css';

import { Suspense } from 'react';
import { SWRConfig } from 'swr';
import { DataView } from './DataView';

const data = [
  {
    Group: 'Cars',
    rows: [
      { Year: 2010, Value: 100 },
      { Year: 2020, Value: 150 },
      { Year: 2030, Value: 200 },
      { Year: 2040, Value: 200 },
    ],
  },
  {
    Group: 'Aeroplanes',
    rows: [
      { Year: 2010, Value: 100 },
      { Year: 2020, Value: 150 },
      { Year: 2030, Value: 200 },
      { Year: 2040, Value: 200 },
    ],
  },
  {
    Group: 'Buses',
    rows: [
      { Year: 2010, Value: 100 },
      { Year: 2020, Value: 150 },
      { Year: 2030, Value: 200 },
      { Year: 2040, Value: 200 },
    ],
  },
];
function App() {
  return (
    <SWRConfig value={{ suspense: true }}>
      <div className="App">
        <h1>TEAM Dashboard</h1>
        <Suspense fallback={<div>Loading data...</div>}>
          <DataView />
        </Suspense>
      </div>
    </SWRConfig>
  );
}

export default App;
