import { TableRows, Timeline } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { currentDataState } from '../data-state';
import { activeTabState } from '../data-tab-state';
import { DataChartSection } from './DataChartSection';
import { DataTableSection } from './DataTableSection';

export const DataDisplaySection = () => {
  const {
    content: { variable: variableConfig },
  } = useRecoilValue(activeTabState);

  const factTable = useRecoilValue(currentDataState);

  const [tab, setTab] = useState<'chart' | 'table'>('chart');

  return (
    <Box height="500px" width="1000px">
      <TabContext value={tab}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <TabList onChange={(e, value) => setTab(value)}>
            <Tab
              value="chart"
              icon={<Timeline fontSize="small" />}
              title="Chart"
            />
            <Tab
              value="table"
              icon={<TableRows fontSize="small" />}
              title="Table"
            />
          </TabList>
        </Box>
        <TabPanel value="chart">
          <Box height="400px" width="100%">
            <DataChartSection key={variableConfig.name} factTable={factTable} />
          </Box>
        </TabPanel>
        <TabPanel value="table">
          <Box height="400px">
            <DataTableSection key={variableConfig.name} factTable={factTable} />
          </Box>
        </TabPanel>
      </TabContext>
    </Box>
  );
};
