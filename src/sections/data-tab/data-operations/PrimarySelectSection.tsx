import { FC, Suspense } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { PrimarySelect } from '../../../components/primary-select/PrimarySelect';
import { IDimPath } from '../../../data/dimension-paths';
import { leafStoreByDimensionState } from '../dimensions/dimensions-state';
import { dataSelectionByDimPathState } from './data-operations-state';

export const PrimarySelectSection: FC<{
  dimPaths: IDimPath[];
}> = ({ dimPaths }) => {
  return (
    <>
      {dimPaths.map((dimPath) => (
        <Suspense key={dimPath.rawExpression}>
          <PrimarySubsection dimPath={dimPath} />
        </Suspense>
      ))}
    </>
  );
};

function PrimarySubsection({ dimPath }: { dimPath: IDimPath }) {
  const dimension = dimPath.dimension;
  const domainStore = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domainStore.values;

  const [selected, setSelected] = useRecoilState(
    dataSelectionByDimPathState(dimPath)
  );

  return (
    <PrimarySelect
      domain={values}
      value={selected}
      onChange={setSelected}
      getLabel={(x) => x.NA}
      allowAggregate={true}
    />
  );
}
