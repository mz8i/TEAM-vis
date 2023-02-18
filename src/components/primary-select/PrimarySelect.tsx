import { Functions, FunctionsRounded } from '@mui/icons-material';
import { Stack } from '@mui/material';
import produce from 'immer';
import { useCallback } from 'react';

import { ChipSelect } from './ChipSelect';
import { ChipToggle } from './ChipToggle';

interface DataSelectState<T> {
  aggregate: boolean;
  filter: T[] | null;
}

export interface PrimarySelectProps<T> {
  value: DataSelectState<T>;
  onChange: (newVal: DataSelectState<T>) => void;
  domain: T[];
}
export const PrimarySelect = ({
  value,
  onChange,
  domain,
}: PrimarySelectProps<string>) => {
  const { aggregate, filter: selected } = value;

  const handleAggregate = useCallback(
    (checked: boolean) => {
      onChange?.(
        produce(value, (draft) => {
          draft.aggregate = checked;
        })
      );
    },
    [value, onChange]
  );

  const handleSelected = useCallback(
    (selected: string[]) => {
      onChange?.(
        produce(value, (draft) => {
          draft.filter = selected;
        })
      );
    },
    [onChange, value]
  );

  return (
    <Stack direction="row" spacing={1}>
      <ChipSelect
        values={domain}
        selected={(aggregate ? domain : selected) ?? []}
        onSelected={handleSelected}
        disabled={aggregate}
      />
      <ChipToggle
        label="Total"
        icon={<FunctionsRounded fontSize="small" />}
        checked={aggregate}
        onToggle={handleAggregate}
        color="secondary"
      />
    </Stack>
  );
};
