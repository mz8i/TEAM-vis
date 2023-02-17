import { TabContext, TabList } from '@mui/lab';
import { AppBar, Tab, Toolbar } from '@mui/material';
import axios from 'axios';
import { Outlet, useLoaderData, useParams } from 'react-router';
import { Link } from 'react-router-dom';

export async function dataViewLoader() {
  return axios.get('/data/views.json').then((res) => res.data);
}

export const DataView = () => {
  const { tab } = useParams() as { tab: string };
  const data = useLoaderData() as any[];

  return (
    <>
      <Toolbar>
        <TabContext value={tab}>
          <TabList variant="scrollable">
            {data.map(({ slug, label }) => (
              <Tab label={label} value={slug} component={Link} to={slug} />
            ))}
          </TabList>
        </TabContext>
      </Toolbar>
      <Outlet />
    </>
  );
};
