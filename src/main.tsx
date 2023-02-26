import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import {
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
  redirect,
} from 'react-router-dom';

import About from './routes/about.mdx';
import { AllTabsRoute, dataViewLoader } from './routes/all-tabs';
import { DataTabRoute } from './routes/data-tab';
import { RootRoute, rootLoader } from './routes/root';

const router = createHashRouter(
  createRoutesFromElements(
    <Route loader={rootLoader} element={<RootRoute />}>
      <Route
        path="/"
        loader={() => {
          return redirect('/vehicle-stock');
        }}
      ></Route>
      <Route path="about" element={<About />} />
      <Route loader={dataViewLoader} element={<AllTabsRoute />}>
        <Route path=":tab" element={<DataTabRoute />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
