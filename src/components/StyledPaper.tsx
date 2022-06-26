import Paper, { PaperProps } from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const StyledPaper = styled(Paper)<PaperProps>(() => ({
  padding: 32,
  margin: "auto",
  maxWidth: 450,
  flexShrink: 1,
  background: "#001e3c",
}));
