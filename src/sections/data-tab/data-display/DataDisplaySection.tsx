import { TableRows, Timeline } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { Suspense, useState } from 'react';

import { DataChartSection } from './DataChartSection';
import { DataDownloadButton } from './DataDownloadButton';
import { DataTableSection } from './DataTableSection';

export const DataDisplaySection = () => {
  const [tab, setTab] = useState<'chart' | 'table'>('chart');

  return (
    <>
      <TabContext value={tab}>
        <Box height="400px">
          <Box
            display="flex"
            flexDirection="row"
            alignItems="stretch"
            justifyContent="end"
          >
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              // alignItems="stretch"
            >
              <TabPanel value="chart" sx={{ padding: 0 }}>
                <Box height="400px" width="100%">
                  <Suspense>
                    <DataChartSection />
                  </Suspense>
                </Box>
              </TabPanel>
              <TabPanel value="table" sx={{ padding: 0 }}>
                <Box height="400px" width="100%">
                  <Suspense>
                    <DataTableSection />
                  </Suspense>
                </Box>
              </TabPanel>
            </Box>

            <Box width={40}>
              <TabList
                onChange={(e, value) => setTab(value)}
                orientation="vertical"
                sx={{ width: '40px' }}
                TabIndicatorProps={{ hidden: true }}
              >
                <Tab
                  value="chart"
                  icon={<Timeline fontSize="small" />}
                  title="Chart"
                  sx={{
                    minWidth: 'unset',
                    padding: 0,
                    margin: 0,
                  }}
                />
                <Tab
                  value="table"
                  icon={<TableRows fontSize="small" />}
                  title="Table"
                  sx={{
                    minWidth: 'unset',
                    padding: 0,
                    margin: 0,
                  }}
                />
              </TabList>
              <DataDownloadButton />
            </Box>
          </Box>
        </Box>
      </TabContext>
    </>
  );
};
