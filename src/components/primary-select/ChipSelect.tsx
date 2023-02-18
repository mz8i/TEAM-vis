import { Check, Clear, Close } from '@mui/icons-material';
import { Chip, Stack } from '@mui/material';
import { FC, MouseEvent, useCallback, useMemo } from 'react';

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
      onSelected?.(Array.from(toggleInArray(selected, v)));
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
        disabled={disabled}
      />
      <Chip
        variant="outlined"
        color="default"
        label="None"
        icon={<Clear fontSize="small" />}
        clickable
        onClick={(e) => onSelected?.([])}
        disabled={disabled}
      />
    </Stack>
  );
};

/**
 * Toggle the existence of a value in a set.
 * Doesn't modify the input set.
 */
function toggleInArray(arr: string[], key: string) {
  const set = new Set(arr);

  if (!set.delete(key)) {
    // Set.delete returns false if key not present
    set.add(key);
  }

  return Array.from(set);
}
