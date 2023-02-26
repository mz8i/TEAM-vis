import { TabContext, TabList } from '@mui/lab';
import { Tab, Toolbar } from '@mui/material';
import { CheckerReturnType, object } from '@recoiljs/refine';
import { Outlet, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { load } from '../data/load';
import { allViewsChecker } from '../data/models/view';
import { TypedLoaderFunction, useCheckedLoaderData } from '../utils/router';

const dataViewDataChecker = object({
  views: allViewsChecker,
});

type DataViewData = CheckerReturnType<typeof dataViewDataChecker>;

export const dataViewLoader: TypedLoaderFunction<DataViewData> = async ({
  request,
}) => {
  return {
    views: await load('/data/views.json', { request }),
  };
};

export const DataView = () => {
  const { tab } = useParams() as { tab: string };
  const { views } = useCheckedLoaderData(dataViewDataChecker);

  return (
    <>
      <Toolbar>
        <TabContext value={tab}>
          <TabList variant="scrollable">
            {views.map(({ slug, label }) => (
              <Tab label={label} value={slug} component={Link} to={slug} />
            ))}
          </TabList>
        </TabContext>
      </Toolbar>
      <Outlet />
    </>
  );
};
