import { Functions, FunctionsRounded } from '@mui/icons-material';
import { Stack } from '@mui/material';
import produce, { castDraft } from 'immer';
import { toString } from 'lodash';
import { useCallback } from 'react';

import { DataSelectionValue, LabelFn } from '../../types/data';
import { ChipSelect } from '../chip-select/ChipSelect';
import { ChipToggle } from '../chip-toggle/ChipToggle';

export interface PrimarySelectProps<T> {
  value: DataSelectionValue<T>;
  onChange: (newVal: DataSelectionValue<T>) => void;
  domain: T[];
  getLabel: LabelFn<T>;
  allowAggregate?: boolean;
}

export const PrimarySelect = <T,>({
  value,
  onChange,
  domain,
  getLabel = toString,
  allowAggregate = true,
}: PrimarySelectProps<T>) => {
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
    (selected: T[]) => {
      onChange?.(
        produce(value, (draft) => {
          draft.filter = castDraft(selected);
        })
      );
    },
    [onChange, value]
  );

  return (
    <Stack direction="row" spacing={1}>
      <ChipSelect
        values={domain}
        selected={aggregate ? domain : selected ?? domain}
        onSelected={handleSelected}
        disabled={aggregate}
        getLabel={getLabel}
      />
      {allowAggregate && (
        <ChipToggle
          label="Total"
          icon={<FunctionsRounded fontSize="small" />}
          checked={aggregate}
          onToggle={handleAggregate}
          color="secondary"
        />
      )}
    </Stack>
  );
};
