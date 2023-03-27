import { Box, Stack } from '@mui/material';
import produce, { castDraft } from 'immer';
import { toString } from 'lodash';
import { useCallback } from 'react';

import { DataDomain, DataSelectionValue, LabelFn } from '../../types/data';
import { ChipToggle } from '../chip-toggle/ChipToggle';
import { FilterList } from './FilterList';

export interface SecondarySelectProps<T = string> {
  title: string;
  value: DataSelectionValue<T>;
  onValue?: (newValue: DataSelectionValue<T>) => void;
  domain: DataDomain<T>;
  getLabel?: LabelFn<T>;
  getKey?: LabelFn<T>;
}

export const SecondarySelect = <T,>({
  title,
  value,
  onValue,
  domain,
  getLabel = toString,
  getKey = toString,
}: SecondarySelectProps<T>) => {
  const disaggregate = !value.aggregate;
  const selected = value.filter;

  const handleDisaggregate = useCallback(
    (disaggregate: boolean) => {
      onValue?.(
        produce(value, (draft) => {
          const newAgg = !disaggregate;
          draft.aggregate = newAgg;
          if (newAgg) {
            draft.filter = null;
          }
        })
      );
    },
    [onValue, value]
  );

  const handleSelected = useCallback(
    (selected: T[]) => {
      onValue?.(
        produce(value, (draft) => {
          draft.filter = castDraft(selected);
        })
      );
    },
    [onValue, value]
  );

  return (
    <Box maxWidth={400} height="100%">
      <Stack direction="column" spacing={1}>
        <ChipToggle
          label={title}
          checked={disaggregate}
          onToggle={handleDisaggregate}
          sx={{ borderRadius: '10px' }}
          color={disaggregate ? 'primary' : 'default'}
        />
        <FilterList
          values={domain.values}
          allowed={domain.allowed}
          shown={domain.shown}
          selected={selected ?? domain.values}
          onSelected={handleSelected}
          disabled={!disaggregate}
          getLabel={getLabel}
          getKey={getKey}
        />
      </Stack>
    </Box>
  );
};
