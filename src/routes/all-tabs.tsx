import { TabContext, TabList } from '@mui/lab';
import { Tab, Toolbar } from '@mui/material';
import { object } from '@recoiljs/refine';
import { Outlet, useParams } from 'react-router';
import { Link } from 'react-router-dom';

import { load } from '../data/load';
import { allDataTabsChecker } from '../data/models/data-tab';
import { allTabsState } from '../sections/data-tab/data-tab-state';
import { StateSetter } from '../utils/recoil/StateSetter';
import { MutableCheckerReturn } from '../utils/recoil/refine';
import { TypedLoaderFunction, useCheckedLoaderData } from '../utils/router';

const dataViewDataChecker = object({
  dataTabs: allDataTabsChecker,
});

type DataViewData = MutableCheckerReturn<typeof dataViewDataChecker>;

export const dataViewLoader: TypedLoaderFunction<DataViewData> = async ({
  request,
}) => {
  return {
    dataTabs: await load('/data/data-tabs.json', { request }),
  };
};

export const AllTabsRoute = () => {
  const { tab } = useParams() as { tab: string };
  const { dataTabs } = useCheckedLoaderData(dataViewDataChecker);

  return (
    <>
      <StateSetter value={dataTabs} state={allTabsState} />
      <Toolbar>
        <TabContext value={tab}>
          <TabList variant="scrollable">
            {dataTabs.map(({ slug, label }) => (
              <Tab
                key={slug}
                label={label}
                value={slug}
                component={Link}
                to={slug}
              />
            ))}
          </TabList>
        </TabContext>
      </Toolbar>
      <Outlet />
    </>
  );
};
