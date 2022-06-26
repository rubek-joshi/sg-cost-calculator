import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { Input } from "./StyledInput";

interface Props {
  overall: number;
  onOverallSliderChange: (value: number) => void;
  onOverallChange: (event: any) => void;
  onOverallBlur: () => void;
}

export const OverallInput = ({
  overall = 0,
  onOverallSliderChange,
  onOverallChange,
  onOverallBlur,
}: Props) => {
  const handleOverallSliderChange = (
    event: Event,
    newValue: number | number[]
  ) => onOverallSliderChange(Array.isArray(newValue) ? newValue[0] : newValue);

  return (
    <Grid container spacing={2}>
      <Grid item xs>
        <Box sx={{ pl: 1 }}>
          <Slider
            value={typeof overall === "number" ? overall : 0}
            onChange={handleOverallSliderChange}
            aria-labelledby="input-slider"
            min={70}
            max={99}
            sx={{ color: "#90caf9" }}
          />
        </Box>
      </Grid>

      <Grid item>
        <Input
          value={overall}
          size="small"
          onChange={onOverallChange}
          onBlur={onOverallBlur}
          inputProps={{
            min: 70,
            max: 99,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
        />
      </Grid>
    </Grid>
  );
};
