import {
  CheckBoxOutlineBlankSharp,
  CheckBoxSharp,
  CropFreeSharp,
} from '@mui/icons-material';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
} from '@mui/material';
import { toString } from 'lodash';
import { useCallback, useMemo } from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';

import { LabelFn } from '../../types/data';
import { toggleInArray } from '../utils/toggle-in-array';

export interface FilterListProps<T = string> {
  title?: string;
  values: T[];
  allowed: T[];
  shown: T[];
  selected: T[];
  onSelected: (selected: T[]) => void;
  disabled?: boolean;
  getLabel?: LabelFn<T>;
  getKey?: LabelFn<T>;
}

export const FilterList = <T,>({
  title,
  values,
  allowed,
  shown,
  selected,
  onSelected,
  disabled = false,
  getLabel = toString,
  getKey = toString,
}: FilterListProps<T>) => {
  const allowedLookup = useLookup(allowed);
  const selectedLookup = useLookup(selected);
  const shownLookup = useLookup(shown);

  const sortedValues = useMemo(
    () => sortValues(values, disabled ? null : allowedLookup),
    [values, allowedLookup, disabled]
  );

  const handleChange = useCallback(
    (v: T, checked: boolean) => {
      onSelected?.(toggleInArray(selected, v));
    },
    [onSelected, selected]
  );

  const labelVariant = 'body2';

  const renderOption = (v: T) => {
    const label = getLabel(v);
    const key = getKey(v);

    return (
      <Flipped key={key} flipId={key}>
        <FormControlLabel
          disabled={disabled || !allowedLookup.has(v)}
          control={
            <Checkbox
              // data
              checked={disabled || selectedLookup.has(v)}
              indeterminate={disabled}
              indeterminateIcon={<CropFreeSharp />}
              onChange={(e, checked) => handleChange(v, checked)}
              //

              // style
              icon={<CheckBoxOutlineBlankSharp />}
              checkedIcon={<CheckBoxSharp />}
              size="small"
              sx={{
                marginY: 0,
                height: (theme) => theme.typography[labelVariant].lineHeight,
              }}
            />
          }
          label={
            <Typography
              variant={labelVariant}
              color={
                !disabled && shownLookup.has(v)
                  ? 'text.secondary'
                  : 'text.disabled'
              }
            >
              {label}
            </Typography>
          }
          //

          // style
          sx={{ alignItems: 'flex-start', marginY: '0.2em' }}
        />
      </Flipped>
    );
  };

  return (
    <FormControl
      disabled={disabled}
      component="fieldset"
      variant="standard"
      //

      // style
      sx={{
        maxHeight: '100%',
        p: 1,
        bgcolor: '#eaeaea',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '400px',
        height: '200px', //TODO: fix flexbox issues and remove hardcoded height
        borderRadius: 2,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'clip',
      }}
      //

      //
    >
      {title && (
        <Box>
          <FormLabel component="legend">{title}</FormLabel>
        </Box>
      )}
      <Box flexGrow={1} sx={{ overflowY: 'scroll' }}>
        <Flipper flipKey={sortedValues.join('-')}>
          <FormGroup>{sortedValues.map(renderOption)}</FormGroup>
        </Flipper>
      </Box>
    </FormControl>
  );
};

function useLookup<T>(arr: T[]): Set<T> {
  return useMemo(() => new Set(arr), [arr]);
}

function sortValues<T>(values: T[], allowedSet: Set<T> | null) {
  if (allowedSet == null) return [...values];

  const allowed = [],
    disallowed = [];

  for (const v of values) {
    if (allowedSet.has(v)) {
      allowed.push(v);
    } else {
      disallowed.push(v);
    }
  }
  return allowed.concat(disallowed);
}
