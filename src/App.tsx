import { useState, useEffect } from "react";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import "./App.css";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import Fab from "@mui/material/Fab";
import GitHubIcon from "@mui/icons-material/GitHub";
import ReactGA from "react-ga4";
import { Title, OverallInput, NumberTextField } from "./components";
import data from "./data/card_pricing.json";

function App() {
  let darkTheme = createTheme({ palette: { mode: "dark" } });
  darkTheme = responsiveFontSizes(darkTheme);

  const [overall, setOverall] = useState(90);
  const [upgradeLevel, setUpgradeLevel] = useState(0);
  const [baseStats, setBaseStats] = useState("");
  const [baseStatsError, setBaseStatsError] = useState("");
  const [cost, setCost] = useState("n/a");

  // render upgrade level only for base stat higher than 399 due to missing data
  const showUpgradeLevel = !!Number(baseStats) && Number(baseStats) >= 400;

  useEffect(() => {
    ReactGA.send("pageview");
  }, []);

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
    } else {
      setBaseStatsError("");
      ReactGA.event({
        category: "engagement",
        action: "Set Total BS Correctly",
        value: Number(baseStats),
        label: "input",
      });
    }
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

  const handleOverallChange = (event: any) =>
    setOverall(event.target.value === "" ? 70 : Number(event.target.value));

  const handleOverallBlur = () => {
    if (overall < 70) setOverall(70);
    else if (overall > 99) setOverall(99);
  };

  const handleBaseStatsChange = (event: any) =>
    setBaseStats(event.target.value);

  const handleUpgradeLevelChange = (
    event: Event,
    newValue: number | number[]
  ) => setUpgradeLevel(Array.isArray(newValue) ? newValue[0] : newValue);

  const handleFabClick = () => {
    window.open("https://github.com/rubek-joshi/sg-cost-calculator", "_blank");
    ReactGA.event({ category: "Curiosity", action: "Visit Github Link" });
  };

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Container>
          <Title />

          <Paper
            sx={{
              p: 4,
              margin: "auto",
              maxWidth: 450,
              flexShrink: 1,
              background: "#001e3c",
            }}
          >
            <Grid container sx={{ pb: 1 }}>
              <Grid item xs={12}>
                <Box alignItems="flex-start">
                  <Grid container>
                    <Typography id="input-slider" gutterBottom>
                      Select Overall
                    </Typography>
                  </Grid>

                  <OverallInput
                    overall={overall}
                    onOverallSliderChange={setOverall}
                    onOverallChange={handleOverallChange}
                    onOverallBlur={handleOverallBlur}
                  />
                </Box>
              </Grid>
            </Grid>

            <Grid container sx={{ pb: showUpgradeLevel ? 3 : 1 }}>
              <Grid item xs={12}>
                <Box alignItems="flex-start">
                  <Grid container>
                    <Typography id="input-slider" gutterBottom>
                      Total Base Stats
                    </Typography>
                  </Grid>

                  <Grid container spacing={2}>
                    <Grid item xs>
                      <NumberTextField
                        id="standard-number"
                        autoFocus
                        required
                        placeholder="Eg. 532"
                        value={baseStats}
                        onChange={handleBaseStatsChange}
                        helperText={baseStatsError}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            {showUpgradeLevel && (
              <Grid container sx={{ pb: 1 }}>
                <Grid item xs={12}>
                  <Box alignItems="flex-start">
                    <Grid container>
                      <Typography id="upgrade-level-slider" gutterBottom>
                        Select Upgrade Level
                      </Typography>
                    </Grid>

                    <Grid container>
                      <Grid item xs>
                        <Box sx={{ px: 1 }}>
                          <Slider
                            value={upgradeLevel}
                            onChange={handleUpgradeLevelChange}
                            aria-labelledby="upgrade-level-slider"
                            min={0}
                            max={5}
                            marks={Array.from({ length: 6 }, (_, index) => ({
                              value: index,
                              label: index,
                            }))}
                            sx={{ color: "#90caf9" }}
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            )}

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
