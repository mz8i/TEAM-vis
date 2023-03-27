import { Close } from '@mui/icons-material';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import useId from '@mui/material/utils/useId';
import { useCallback } from 'react';
import { Dot } from 'recharts';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';

import { dimensionMetadataByListState } from '../../dimensions/dimensions-state';
import { ViewParams } from '../../fact-ops-state';
import {
  isSelectedStyleSetState,
  selectedStyleState,
  styleGroupsState,
  useCheckDataStyle,
} from './data-style-state';

export const DataStyleSelect = ({ viewParams }: { viewParams: ViewParams }) => {
  const styleGroups = useRecoilValue(styleGroupsState(viewParams));

  const [selectedGroup, setSelectedGroup] = useRecoilState(
    selectedStyleState(viewParams)
  );
  const resetSelectedGroup = useResetRecoilState(
    selectedStyleState(viewParams)
  );
  const isSet = useRecoilValue(isSelectedStyleSetState(viewParams));

  const handleSelect = useCallback(
    (e: SelectChangeEvent) => {
      setSelectedGroup(
        styleGroups.find((x) => x.path.dimension === e.target.value)!
      );
    },
    [styleGroups]
  );

  useCheckDataStyle(viewParams);

  const dimensions = styleGroups.map((sg) => sg.path.dimension);
  const meta = useRecoilValue(dimensionMetadataByListState(dimensions));

  const id = useId();
  const labelId = `${id}-label`;
  const title = 'Color by';

  return (
    <FormControl fullWidth>
      <InputLabel id={labelId}>{title}</InputLabel>
      <Select
        id={id}
        labelId={labelId}
        label={title}
        fullWidth
        variant="outlined"
        size="small"
        value={selectedGroup?.path.dimension ?? ''}
        onChange={handleSelect}
        endAdornment={
          isSet ? (
            <IconButton
              title="Reset to default"
              onClick={() => resetSelectedGroup()}
              sx={{ marginRight: 2, padding: 0 }}
            >
              <Close fontSize="small" />
            </IconButton>
          ) : null
        }
      >
        {dimensions.map((dim) => (
          <MenuItem key={dim} value={dim}>
            {meta[dim].Name}
            <ColorPreview
              colors={Object.values(meta[dim].Colors ?? { a: '#cccccc' })}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

function ColorPreview({ colors }: { colors: string[] }) {
  return (
    <Box display="inline-block" mx={1}>
      <svg height={10} width={colors.length * 7 + 5}>
        {colors.map((c, i) => (
          <Dot key={c} fill={c} r={5} cy={5} cx={5 + i * 7} />
        ))}
      </svg>
    </Box>
  );
}
