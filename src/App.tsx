import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import Divider from "@mui/material/Divider";
import data from "./data.json";

const Input = styled(MuiInput)`
  width: 42px;
`;

function App() {
  const darkTheme = createTheme({ palette: { mode: "dark" } });

  const [overall, setOverall] = useState(90);
  const [baseStats, setBaseStats] = useState("");
  const [baseStatsError, setBaseStatsError] = useState("");
  const [cost, setCost] = useState("");

  useEffect(() => {
    if (
      !Number.isInteger(Number(baseStats)) ||
      Number(baseStats) < 251 ||
      Number(baseStats) > 594
    ) {
      setBaseStatsError(
        "Should be an integer between 251 and 594 (both inclusive)"
      );
      setCost("");
    } else setBaseStatsError("");
  }, [baseStats]);

  useEffect(() => {
    if (!baseStatsError) {
      const { prices } = data.find((i) => i.ovr === overall) || {
        prices: undefined,
      };
      if (!prices) {
        setCost("");
        return;
      }

      const { cost } = prices.find(
        (i) =>
          Number(baseStats) >= i.minInclusive &&
          Number(baseStats) <= i.maxInclusive
      ) || { cost: "n/a" };

      setCost(cost);
    }
  }, [overall, baseStats, baseStatsError]);

  const handleSliderChange = (event: Event, newValue: number | number[]) =>
    setOverall(Array.isArray(newValue) ? newValue[0] : newValue);

  const handleOverallChange = (event: any) =>
    setOverall(event.target.value === "" ? 70 : Number(event.target.value));

  const handleOverallBlur = () => {
    if (overall < 70) setOverall(70);
    else if (overall > 99) setOverall(99);
  };

  const handleBaseStatsChange = (event: any) =>
    setBaseStats(event.target.value);

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Container className="Main-container">
          <Typography
            className="Main-title"
            variant="h3"
            gutterBottom
            component="div"
          >
            Soccer Guru Player Cost Calculator
          </Typography>

          <Paper sx={{ p: 2, margin: "auto", maxWidth: 500, flexGrow: 1 }}>
            <Grid container>
              <Grid item xs={8}>
                <Box alignItems="flex-start">
                  <Grid container>
                    <Typography id="input-slider" gutterBottom>
                      Select OVR
                    </Typography>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs>
                      <Slider
                        value={typeof overall === "number" ? overall : 0}
                        onChange={handleSliderChange}
                        aria-labelledby="input-slider"
                        min={70}
                        max={99}
                      />
                    </Grid>

                    <Grid item>
                      <Input
                        value={overall}
                        size="small"
                        onChange={handleOverallChange}
                        onBlur={handleOverallBlur}
                        inputProps={{
                          min: 70,
                          max: 99,
                          type: "number",
                          "aria-labelledby": "input-slider",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={8}>
                <Box alignItems="flex-start">
                  <Grid container>
                    <Typography id="input-slider" gutterBottom>
                      Total Base Stats
                    </Typography>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs>
                      <TextField
                        fullWidth
                        id="standard-number"
                        type="number"
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        autoFocus
                        required
                        placeholder="Eg. 532"
                        value={baseStats}
                        onChange={handleBaseStatsChange}
                        helperText={baseStatsError}
                        // error
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <br />

            <Divider />

            <Typography
              className="Result"
              variant="h4"
              gutterBottom
              component="div"
            >
              Cost: {cost} {!baseStatsError ? "credits" : ""}
            </Typography>
          </Paper>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
