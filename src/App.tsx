import { useState, useEffect } from "react";
import {
  createTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@mui/material/styles";
import "./App.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Divider from "@mui/material/Divider";
import ReactGA from "react-ga4";

import {
  Title,
  OverallInput,
  NumberTextField,
  RepoLink,
  StyledPaper,
} from "./components";
import { formatStringCredits } from "./utils";

import data from "./data/card_pricing.json";
import upgradeData from "./data/upgrade_pricing.json";

function App() {
  let darkTheme = createTheme({ palette: { mode: "dark" } });
  darkTheme = responsiveFontSizes(darkTheme);

  const [overall, setOverall] = useState(90);
  const [upgradeLevel, setUpgradeLevel] = useState(0);
  const [baseStats, setBaseStats] = useState("");
  const [baseStatsError, setBaseStatsError] = useState("");
  const [cost, setCost] = useState("n/a");
  const [upgradeCost, setUpgradeCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // upgrade level available only for base stat higher than 399
  const allowUpgradeLevel =
    !!Number(baseStats) && Number(baseStats) >= 400 && Number(baseStats) <= 594;

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
      Number(baseStats) < 400
        ? setBaseStatsError(
            "Needs to be higher than 399 to unlock upgrade level"
          )
        : setBaseStatsError("");

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

  useEffect(() => {
    if (!baseStatsError && allowUpgradeLevel) {
      const info = upgradeData.find(({ baseStat }) => baseStat === baseStats);
      if (info) setUpgradeCost(info.cost * upgradeLevel);
    } else setUpgradeCost(0);
  }, [baseStats, upgradeLevel, allowUpgradeLevel, baseStatsError]);

  useEffect(() => {
    if (cost === "n/a") setTotalCost(0);
    else setTotalCost(Number(cost.replace(/,/gi, "")) + upgradeCost);
  }, [cost, upgradeCost]);

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

  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
        <Container>
          <Title />

          <StyledPaper>
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

            <Grid container sx={{ pb: allowUpgradeLevel ? 3 : 1 }}>
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
                          disabled={!allowUpgradeLevel}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ pt: 2 }} />

            <Typography
              variant="body1"
              component="div"
              sx={{ pt: 2, display: "flex", justifyContent: "space-between" }}
            >
              Card Cost:
              <span>
                {cost} {!baseStatsError ? "credits" : ""}
              </span>
            </Typography>

            <Typography
              variant="body1"
              component="div"
              sx={{ pt: 1, display: "flex", justifyContent: "space-between" }}
            >
              Upgrade Cost:
              <span>{formatStringCredits(upgradeCost)}</span>
            </Typography>

            <Divider sx={{ pb: 2 }} />

            <Typography
              variant="h5"
              component="div"
              sx={{ pt: 2, display: "flex", justifyContent: "space-between" }}
            >
              Total Cost:
              <span>{formatStringCredits(totalCost)}</span>
            </Typography>
          </StyledPaper>

          <RepoLink />
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
