import { TableRows, Timeline } from '@mui/icons-material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { Suspense, startTransition, useEffect, useState } from 'react';
import {
  useRecoilState_TRANSITION_SUPPORT_UNSTABLE,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';

import { scenarioState } from '../../scenario/scenario-state';
import { currentDataParamsState } from '../data-state';
import { activeTabContentState } from '../data-tab-state';
import { paramValuesByVariableParamsState } from '../variables/variable-state';
import { DataChartSection } from './DataChartSection';
import { DataTableSection } from './DataTableSection';

export const DataDisplaySection = () => {
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
            <Suspense>
              <DataChartSection />
            </Suspense>
          </Box>
        </TabPanel>
        <TabPanel value="table">
          <Box height="400px">
            <Suspense>
              <DataTableSection />
            </Suspense>
          </Box>
        </TabPanel>
      </TabContext>
      <Suspense>
        <DataParamsSetter />
      </Suspense>
    </Box>
  );
};

function DataParamsSetter({}: any) {
  const {
    variable: { name, parameters },
  } = useRecoilValue(activeTabContentState);
  const scenario = useRecoilValue(scenarioState);
  const variableParams = useRecoilValue(
    paramValuesByVariableParamsState(parameters)
  );

  const dataParams = {
    variableName: name,
    params: variableParams,
    scenario,
  };
  return (
    <Suspense fallback={<FallbackSetter dataParams={dataParams} />}>
      <DataParamsSetterWithTransition dataParams={dataParams} />
    </Suspense>
  );
}

function DataParamsSetterWithTransition({ dataParams }: any) {
  const [, setDataParams] = useRecoilState_TRANSITION_SUPPORT_UNSTABLE(
    currentDataParamsState
  );

  useEffect(() => {
    startTransition(() => {
      setDataParams(dataParams);
    });
  }, [dataParams]);

  return null;
}

function FallbackSetter({ dataParams }: any) {
  const setDataParams = useSetRecoilState(currentDataParamsState);

  useEffect(() => {
    setDataParams(dataParams);
  }, [dataParams]);

  return null;
}
