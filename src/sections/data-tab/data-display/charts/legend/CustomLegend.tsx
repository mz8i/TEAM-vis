import { Box, List, ListItem } from '@mui/material';
import { Payload } from 'recharts/types/component/DefaultLegendContent';

import { isHovered, isSelected } from '../chart-utils';
import { LegendItem } from './LegendItem';

export function CustomLegend({
  payload,
  hoveredKey,
  setHoveredKey,
  selectedKey,
  setSelectedKey,
}: {
  payload: Payload[];
  hoveredKey: string | null;
  setHoveredKey: (x: string | null) => void;
  selectedKey: string | null;
  setSelectedKey: (x: string | null) => void;
}) {
  const handleLegendEnter = (o: any) => {
    setHoveredKey(o.dataKey);
  };

  const handleLegendLeave = (o: any) => {
    setHoveredKey(null);
  };

  const handleLegendClick = ({ dataKey }: any) => {
    if (selectedKey && hoveredKey) {
      setTimeout(() => setHoveredKey(null), 100);
    }
    setSelectedKey(dataKey === selectedKey ? null : dataKey);
  };

  return (
    <Box onMouseLeave={() => setHoveredKey(null)}>
      <List disablePadding>
        {payload?.map((x: any) => {
          const gkey = x.dataKey;
          return (
            <ListItem
              disableGutters
              disablePadding
              key={x.dataKey}
              onMouseEnter={() => handleLegendEnter(x)}
              onMouseLeave={() => handleLegendLeave(x)}
              onClick={() => handleLegendClick(x)}
            >
              <LegendItem
                payload={{
                  ...x,
                  hovered: isHovered(gkey, hoveredKey),
                  selected: isSelected(gkey, selectedKey),
                }}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
