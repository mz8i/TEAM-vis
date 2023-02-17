import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

import './index.css';

import axios from 'axios';
import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';

import About from './routes/about.mdx';
import { DataTab } from './routes/data-tab';
import { DataView, dataViewLoader } from './routes/data-view';
import { Root } from './routes/root';

axios.defaults.baseURL = import.meta.env.BASE_URL;

const router = createHashRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route
        path="/"
        loader={() => {
          return redirect('/vehicle-stock');
        }}
      ></Route>
      <Route path="about" element={<About />} />
      <Route loader={dataViewLoader} element={<DataView />}>
        <Route path=":tab" element={<DataTab />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
