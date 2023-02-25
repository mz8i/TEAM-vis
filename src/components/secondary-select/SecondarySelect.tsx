import { Stack } from '@mui/material';
import produce from 'immer';
import { FC, useCallback } from 'react';

import { DataDomain, DataSelectionValue } from '../../types/data';
import { ChipToggle } from '../chip-toggle/ChipToggle';
import { FilterList } from './FilterList';

export interface SecondarySelectProps<T = string> {
  title: string;
  value: DataSelectionValue<T>;
  onValue?: (newVale: DataSelectionValue<T>) => void;
  domain: DataDomain<T>;
}

export const SecondarySelect: FC<SecondarySelectProps> = ({
  title,
  value,
  onValue,
  domain,
}) => {
  const disaggregate = !value.aggregate;
  const selected = value.filter;

  const handleDisaggregate = useCallback(
    (disaggregate: boolean) => {
      onValue?.(
        produce(value, (draft) => {
          draft.aggregate = !disaggregate;
        })
      );
    },
    [onValue, value]
  );

  const handleSelected = useCallback((selected: string[]) => {
    onValue?.(
      produce(value, (draft) => {
        draft.filter = selected;
      })
    );
  }, []);

  return (
    <Stack direction="column" spacing={1} width="210px">
      <ChipToggle
        label={title}
        checked={disaggregate}
        onToggle={handleDisaggregate}
      />
      <FilterList
        values={domain.values}
        allowed={domain.allowed}
        selected={selected ?? domain.values}
        onSelected={handleSelected}
        disabled={!disaggregate}
      />
    </Stack>
  );
};
