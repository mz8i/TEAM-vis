import { Box } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { DataChartSection } from './data-display/DataChartSection';
import { PrimarySelectSection } from './data-operations/PrimarySelectSection';
import { SecondarySelectSection } from './data-operations/SecondarySelectSection';
import {
  currentPrimaryDimPathState,
  currentSecondaryDimPathsState,
} from './data-operations/data-operations-state';
import { tabBySlugState } from './data-tab-state';
import { VariableParametersSection } from './variables/VariableParametersSection';
import { useSaveViewParamsToUrl } from './variables/variable-state';

export const DataTabView: FC<{ slug: string }> = ({ slug }) => {
  const dataTab = useRecoilValue(tabBySlugState(slug));

  const variableConfig = dataTab.content.variable;
  const variableParams = variableConfig.parameters;

  const primary = useRecoilValue(currentPrimaryDimPathState);
  const secondary = useRecoilValue(currentSecondaryDimPathsState);

  return (
    <Box>
      {primary && (
        <Suspense fallback={null}>
          <PrimarySelectSection dimPath={primary} />
        </Suspense>
      )}

      {variableParams.length > 0 && (
        <VariableParametersSection parameters={variableParams} />
      )}
      <Suspense>
        <SaveVariableParams />
        <SaveOpsParams />
      </Suspense>
      <Suspense fallback={null}>
        <DataChartSection />
      </Suspense>
      {secondary.length > 0 && (
        <Suspense>
          <SecondarySelectSection dimPaths={secondary} />
        </Suspense>
      )}
    </Box>
  );
};

function SaveVariableParams() {
  useSaveViewParamsToUrl();
  return null;
}

function SaveOpsParams() {
  // TODO: fix infinite recoil loop
  // useSyncOpsQuery();
  return null;
}
