import { Check, Clear, Close } from '@mui/icons-material';
import { Chip, Stack } from '@mui/material';
import { FC, MouseEvent, useCallback, useMemo } from 'react';

import { toggleInArray } from '../utils/toggle-in-array';

export interface ChipSelectProps {
  values: string[];
  selected: string[];
  onSelected?: (newSelected: string[]) => void;
  disabled?: boolean;
}

export const ChipSelect: FC<ChipSelectProps> = ({
  values,
  selected,
  onSelected,
  disabled = false,
}) => {
  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, v: string) => {
      onSelected?.(toggleInArray(selected, v));
    },
    [selected]
  );

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  return (
    <Stack direction="row" spacing={1}>
      {values.map((v) => {
        const sel = selectedSet.has(v);

        return (
          <Chip
            key={v}
            label={v}
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
