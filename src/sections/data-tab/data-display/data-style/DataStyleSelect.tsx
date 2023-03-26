import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import useId from '@mui/material/utils/useId';
import { useCallback } from 'react';
import { Dot } from 'recharts';
import { useRecoilState, useRecoilValue } from 'recoil';

import { dimensionMetadataByListState } from '../../dimensions/dimensions-state';
import { ViewParams } from '../../fact-ops-state';
import {
  selectedStyleState,
  styleGroupsState,
  useCheckDataStyle,
} from './data-style-state';

export const DataStyleSelect = ({ viewParams }: { viewParams: ViewParams }) => {
  const styleGroups = useRecoilValue(styleGroupsState(viewParams));

  const [selectedGroup, setSelectedGroup] = useRecoilState(
    selectedStyleState(viewParams)
  );

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
        value={selectedGroup.path.dimension}
        onChange={handleSelect}
      >
        {dimensions.map((dim) => (
          <MenuItem key={dim} value={dim}>
            <ColorPreview
              colors={Object.values(meta[dim].Colors ?? { a: '#cccccc' })}
            />
            {meta[dim].Name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

function ColorPreview({ colors }: { colors: string[] }) {
  return (
    <Box display="inline-block" mr={1}>
      <svg height={10} width={10}>
        <Dot fill={colors[0]} r={5} cx={5} cy={5} />
      </svg>
    </Box>
  );
}
