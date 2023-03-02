import { Suspense } from 'react';
import { useParams } from 'react-router';

import { DataTabView } from '../sections/data-tab/DataTabView';
import { activeTabSlugState } from '../sections/data-tab/data-tab-state';
import { StateSetter } from '../utils/recoil/StateSetter';

export const DataTabRoute = () => {
  const { tab } = useParams() as { tab: string };
  return (
    <>
      <StateSetter value={tab} state={activeTabSlugState} />

      <Suspense fallback="Loading data...">
        <DataTabView slug={tab} />
      </Suspense>
    </>
  );
};
