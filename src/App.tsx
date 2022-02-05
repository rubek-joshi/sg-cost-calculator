import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./App.css";
import { styled, responsiveFontSizes } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import GitHubIcon from "@mui/icons-material/GitHub";
import data from "./data.json";

const Input = styled(MuiInput)`
  width: 42px;
`;

function App() {
  let darkTheme = createTheme({ palette: { mode: "dark" } });
  darkTheme = responsiveFontSizes(darkTheme);

  const [overall, setOverall] = useState(90);
  const [baseStats, setBaseStats] = useState("");
  const [baseStatsError, setBaseStatsError] = useState("");
  const [cost, setCost] = useState("n/a");

  useEffect(() => {
    if (
      !Number.isInteger(Number(baseStats)) ||
      Number(baseStats) < 251 ||
      Number(baseStats) > 594
    ) {
      setBaseStatsError(
        "Should be an integer between 251 and 594 (both inclusive)"
      );
      setCost("n/a");
    } else setBaseStatsError("");
  }, [baseStats]);

  useEffect(() => {
    if (!baseStatsError) {
      const { prices } = data.find((i) => i.ovr === overall) || {
        prices: undefined,
      };
      if (!prices) {
        setCost("n/a");
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

  const handleFabClick = () =>
    window.open("https://github.com/rubek-joshi/sg-cost-calculator", "_blank");

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Container>
          <Typography
            className="Main-title"
            variant="h3"
            gutterBottom
            component="div"
          >
            Soccer Guru
            <br />
            Player Cost Calculator
          </Typography>

          <Paper sx={{ p: 4, margin: "auto", maxWidth: 450, flexShrink: 1 }}>
            <Grid container sx={{ pb: 1 }}>
              <Grid item xs={12}>
                <Box alignItems="flex-start">
                  <Grid container>
                    <Typography id="input-slider" gutterBottom>
                      Select Overall
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
              <Grid item xs={12}>
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

            <Divider sx={{ py: 2 }} />

            <Typography
              variant="h4"
              component="div"
              sx={{ pt: 4, display: "flex", justifyContent: "space-between" }}
            >
              Cost:
              <span>
                {cost} {!baseStatsError ? "credits" : ""}
              </span>
            </Typography>
          </Paper>

          <Fab
            sx={{ position: "absolute", bottom: 16, right: 16 }}
            onClick={handleFabClick}
          >
            <GitHubIcon />
          </Fab>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
