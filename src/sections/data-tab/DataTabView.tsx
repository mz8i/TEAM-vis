import { Box } from '@mui/material';
import { FC, Suspense } from 'react';
import { useRecoilValue } from 'recoil';

import { SlotIn, SlotOut } from '../../utils/slots';
import { DataViewParamsRoot } from './DataViewParamsContext';
import { DataDisplaySection } from './data-display/DataDisplaySection';
import { SetDataDisplayParams } from './data-display/SetDataDisplayParams';
import { PrimarySelectSection } from './data-operations/PrimarySelectSection';
import { SecondarySelectSection } from './data-operations/SecondarySelectSection';
import { activeTabContentState, tabBySlugState } from './data-tab-state';
import { VariableParametersSection } from './variables/VariableParametersSection';
import { useSaveViewParamsToUrl } from './variables/variable-state';

export const DataTabView: FC<{ slug: string }> = ({ slug }) => {
  const dataTab = useRecoilValue(tabBySlugState(slug));

  const variableConfig = dataTab.content.variable;

  const { primarySelect: primary, secondarySelect: secondary } = useRecoilValue(
    activeTabContentState
  );

  return (
    <>
      <SlotIn slotId="primary">
        {primary.length > 0 && <PrimarySelectSection dimPaths={primary} />}
      </SlotIn>
      <SlotIn slotId="variable-params">
        <VariableParametersSection variableConfig={variableConfig} />
      </SlotIn>
      <SlotIn slotId="secondary">
        {secondary.length > 0 && (
          <SecondarySelectSection dimPaths={secondary} />
        )}
      </SlotIn>
      <SlotIn slotId="chart-title"></SlotIn>
      <Suspense>
        <SaveVariableParams />
        <SaveOpsParams />
      </Suspense>

      <SetDataDisplayParams />
      <Suspense>
        <DataViewParamsRoot>
          <Box display="flex" flexDirection="column" alignItems="stretch">
            <Box height={40} display="flex" alignItems="center" mx={2} my={1}>
              <SlotOut slotId="primary" />
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
              <SlotOut slotId="variable-params" />
            </Box>
            <Box
              height="calc(100vh-350px)"
              width="100%"
              position="relative"
              zIndex={1}
            >
              <DataDisplaySection />
            </Box>
            <Box height={200} alignItems="center" mx={2} my={1}>
              <SlotOut slotId="secondary" />
            </Box>
          </Box>
        </DataViewParamsRoot>
      </Suspense>
    </>
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
