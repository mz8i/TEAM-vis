import { Box, Typography } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { StateSetter } from '../../utils/recoil/StateSetter';
import { DataChartSection } from './data-display/DataChartSection';
import { activeTabSlugState, tabBySlugState } from './data-tab-state';
import { VariableParametersSection } from './variables/VariableParametersSection';
import { useSaveViewParamsToUrl } from './variables/variable-state';

export const DataTabView: FC<{ slug: string }> = ({ slug }) => {
  const dataTab = useRecoilValue(tabBySlugState(slug));

  const variableConfig = dataTab.content.variable;
  const variableParams = variableConfig.parameters;

  return (
    <Box>
      <StateSetter value={slug} state={activeTabSlugState} />
      <Typography variant="caption">{JSON.stringify(dataTab)}</Typography>

      {variableParams.length > 0 && (
        <VariableParametersSection parameters={variableParams} />
      )}
      <Suspense>
        <SaveParams />
      </Suspense>
      <Suspense fallback={null}>
        <DataChartSection />
      </Suspense>
    </Box>
  );
};

function SaveParams() {
  useSaveViewParamsToUrl();

  return null;
}
