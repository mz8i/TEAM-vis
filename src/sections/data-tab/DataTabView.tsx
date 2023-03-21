import { Box } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { DataDisplaySection } from './data-display/DataDisplaySection';
import { PrimarySelectSection } from './data-operations/PrimarySelectSection';
import { SecondarySelectSection } from './data-operations/SecondarySelectSection';
import { activeTabContentState, tabBySlugState } from './data-tab-state';
import { VariableParametersSection } from './variables/VariableParametersSection';
import { useSaveViewParamsToUrl } from './variables/variable-state';

export const DataTabView: FC<{ slug: string }> = ({ slug }) => {
  const dataTab = useRecoilValue(tabBySlugState(slug));

  const variableConfig = dataTab.content.variable;
  const varParams = variableConfig.parameters;

  const { primarySelect: primary, secondarySelect: secondary } = useRecoilValue(
    activeTabContentState
  );

  return (
    <Box display="flex" flexDirection="column" alignItems="stretch">
      <Box height={40} display="flex" alignItems="center" mx={2} my={1}>
        {primary.length > 0 && <PrimarySelectSection dimPaths={primary} />}
      </Box>
      <Box
        height={50}
        display="flex"
        alignItems="center"
        mx={2}
        my={1}
        mt={2}
        ml="120px"
      >
        {varParams.length > 0 && (
          <VariableParametersSection parameters={varParams} />
        )}
      </Box>
      <Suspense>
        <SaveVariableParams />
        <SaveOpsParams />
      </Suspense>
      <Box height="calc(100vh-350px)" width="100%">
        <DataDisplaySection />
      </Box>
      <Box height={200} alignItems="center" mx={2} my={1}>
        {secondary.length > 0 && (
          <SecondarySelectSection dimPaths={secondary} />
        )}
      </Box>
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
