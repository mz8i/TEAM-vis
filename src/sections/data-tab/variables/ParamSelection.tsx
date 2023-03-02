import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import useId from '@mui/material/utils/useId';
import { FC } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import {
  leafStoreByDimensionState,
  metadataByDimensionState,
} from '../dimensions/dimensions-state';
import { paramValueByDimensionState } from './variable-state';

export interface ParamSelectionProps {
  dimension: string;
}

export const ParamSelection: FC<ParamSelectionProps> = ({ dimension }) => {
  const domain = useRecoilValue(leafStoreByDimensionState(dimension));
  const values = domain.values;

  const [selectedValue, setSelectedValue] = useRecoilState(
    paramValueByDimensionState(dimension)
  );

  const title = useRecoilValue(metadataByDimensionState(dimension)).Name;

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
        value={selectedValue.AB}
        onChange={(e) => setSelectedValue(domain.get(e.target.value, 'AB')!)}
        //

        // style
        variant="standard"
        sx={{
          maxWidth: '300px',
        }}
      >
        {values.map((x) => (
          <MenuItem key={x.AB} value={x.AB}>
            {x.NA}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
