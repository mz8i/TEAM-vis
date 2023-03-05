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
    <Box>
      {primary.length > 0 && <PrimarySelectSection dimPaths={primary} />}
      {varParams.length > 0 && (
        <VariableParametersSection parameters={varParams} />
      )}
      <Suspense>
        <SaveVariableParams />
        <SaveOpsParams />
      </Suspense>
      <DataDisplaySection />
      {secondary.length > 0 && <SecondarySelectSection dimPaths={secondary} />}
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
