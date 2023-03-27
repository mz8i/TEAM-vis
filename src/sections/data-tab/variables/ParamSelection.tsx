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
    <Select
      id={id}
      // data
      value={selectedValue.AB}
      onChange={(e) => setSelectedValue(domain.get(e.target.value, 'AB')!)}
      //

      // style
      variant="standard"
      size="small"
      sx={{
        '& .MuiInputBase-input': {
          paddingRight: '18px !important',
        },
        '& .MuiSvgIcon-root': {
          width: '24px',
          marginRight: '-4px',
          marginTop: '-2px',
          color: 'gray',
        },
        '&.MuiInput-underline:before': {
          borderBottomStyle: 'dotted',
          borderBottomWidth: '1px',
          borderBottomColor: (theme) => theme.palette.primary.main,
        },
        '&.MuiInput-underline:hover:before': {
          borderBottomStyle: 'dotted',
          borderBottomWidth: '2px',
          borderBottomColor: (theme) => theme.palette.primary.main,
        },
      }}
    >
      {values.map((x) => (
        <MenuItem key={x.AB} value={x.AB}>
          {x.NA}
        </MenuItem>
      ))}
    </Select>
  );
};
