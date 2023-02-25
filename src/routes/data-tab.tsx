import { Typography } from '@mui/material';
import { Suspense } from 'react';
import { useParams } from 'react-router';
import { useRecoilValue } from 'recoil';

import { scenarioSlugState } from '../logic/scenario/scenario-state';

function ScenarioDisplay() {
  const scenarioSlug = useRecoilValue(scenarioSlugState);

  return <Typography variant="h1">{scenarioSlug}</Typography>;
}
export const DataTab = () => {
  const { tab } = useParams();
  return (
    <>
      {tab}
      <Suspense fallback={'Loading scenarios...'}>
        <ScenarioDisplay />
      </Suspense>
    </>
  );
};
