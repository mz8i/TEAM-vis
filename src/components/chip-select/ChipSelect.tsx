import { Check, Clear } from '@mui/icons-material';
import { Chip, Stack, Tooltip } from '@mui/material';
import { toString } from 'lodash';
import { MouseEvent, useCallback, useMemo } from 'react';

import { LabelFn } from '../../types/data';
import { toggleInArray } from '../utils/toggle-in-array';

export interface ChipSelectProps<T> {
  values: T[];
  selected: T[];
  onSelected?: (newSelected: T[]) => void;
  disabled?: boolean;
  getLabel?: LabelFn<T>;
}

export const ChipSelect = <T,>({
  values,
  selected,
  onSelected,
  disabled = false,
  getLabel = toString,
}: ChipSelectProps<T>) => {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, v: T) => {
      if (e.detail == 2) {
        onSelected?.([v]);
      } else if (e.detail === 1) {
        onSelected?.(toggleInArray(selected, v));
      }
    },
    [selected]
  );

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  return (
    <Stack direction="row" spacing={1}>
      {values.map((v) => {
        const sel = selectedSet.has(v);

        const label = getLabel(v);

        return (
          <Tooltip
            key={label}
            title="Double-click to select one"
            enterDelay={1000}
            enterNextDelay={2000}
          >
            <Chip
              label={label}
              variant={sel ? 'filled' : 'outlined'}
              sx={{
                '&.MuiChip-filled': {
                  border: '1px solid transparent',
                },
              }}
              color="primary"
              role="switch"
              aria-checked={sel}
              onClick={(e) => handleClick(e, v)}
              clickable
              disabled={disabled}
            />
          </Tooltip>
        );
      })}
      <Chip
        variant="outlined"
        color="default"
        label="All"
        icon={<Check fontSize="small" />}
        clickable
        onClick={(e) => onSelected?.(Array.from(values))}
        disabled={disabled || selectedSet.size === values.length}
      />
      <Chip
        variant="outlined"
        color="default"
        label="None"
        icon={<Clear fontSize="small" />}
        clickable
        onClick={(e) => onSelected?.([])}
        disabled={disabled || selectedSet.size === 0}
      />
    </Stack>
  );
};
