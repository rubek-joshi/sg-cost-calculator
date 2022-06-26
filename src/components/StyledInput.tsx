import MuiInput from "@mui/material/Input";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

export const Input = styled(MuiInput)`
  width: 42px;
`;

export const NumberTextField = styled((props) => (
  <TextField
    fullWidth
    type="number"
    variant="standard"
    InputLabelProps={{ shrink: true }}
    {...props}
  />
))<TextFieldProps>(() => ({}));
