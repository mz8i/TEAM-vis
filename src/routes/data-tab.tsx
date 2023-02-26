import { Suspense } from 'react';
import { useParams } from 'react-router';

import { DataTabView } from '../sections/data-tab/DataTabView';

export const DataTabRoute = () => {
  const { tab } = useParams() as { tab: string };
  return (
    <Suspense fallback="Loading data...">
      <DataTabView slug={tab} />
    </Suspense>
  );
};
