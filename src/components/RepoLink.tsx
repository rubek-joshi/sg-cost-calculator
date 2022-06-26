import Fab from "@mui/material/Fab";
import GitHubIcon from "@mui/icons-material/GitHub";
import ReactGA from "react-ga4";

export const RepoLink = () => {
  const handleFabClick = () => {
    window.open("https://github.com/rubek-joshi/sg-cost-calculator", "_blank");
    ReactGA.event({ category: "Curiosity", action: "Visit Github Link" });
  };

  return (
    <Fab
      sx={{ position: "absolute", bottom: 16, right: 16 }}
      onClick={handleFabClick}
    >
      <GitHubIcon />
    </Fab>
  );
};
