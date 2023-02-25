import { Chip, ChipProps } from '@mui/material';

/**
 * A Chip serving as an on/off switch
 */
export const ChipToggle = ({
  checked,
  onToggle,
  ...chipProps
}: {
  label: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
} & ChipProps) => {
  return (
    <Chip
      variant={checked ? 'filled' : 'outlined'}
      clickable
      onClick={() => onToggle(!checked)}
      sx={{
        '&.MuiChip-filled': {
          border: '1px solid transparent',
        },
      }}
      role="switch"
      aria-checked={checked}
      {...chipProps}
    />
  );
};
