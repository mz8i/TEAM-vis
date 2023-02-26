import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import useId from '@mui/material/utils/useId';
import { FC, useLayoutEffect } from 'react';
import { useRecoilState } from 'recoil';

import { selectedVariableState } from './variable-state';

export interface VariableSelectionProps {
  variables: readonly string[];
}

export const VariableSelection: FC<VariableSelectionProps> = ({
  variables,
}) => {
  const [selectedVariable, setSelectedVariable] = useRecoilState(
    selectedVariableState
  );

  /**
   * Replace current selection if it's empty or doesn't match the options
   */
  const safeSelection =
    selectedVariable != null && variables.includes(selectedVariable)
      ? selectedVariable
      : variables[0];

  useLayoutEffect(() => {
    if (selectedVariable != safeSelection) {
      setSelectedVariable(safeSelection);
    }
  }, [selectedVariable, safeSelection]);

  const title = 'Variable';
  const id = useId();

  return (
    <FormControl fullWidth>
      <InputLabel id={`${id}-label`}>{title}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        label={title}
        //

        // data
        value={safeSelection}
        onChange={(e) => setSelectedVariable(e.target.value)}
        //

        // style
        variant="standard"
        sx={{
          maxWidth: '400px',
        }}
      >
        {variables.map((x) => (
          <MenuItem key={x} value={x}>
            {x}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
