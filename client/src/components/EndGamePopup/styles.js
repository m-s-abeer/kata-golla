import { makeStyles } from "@material-ui/core/styles";

export const popUpStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: "rgba(175, 216, 255, 0.90)",
    boxShadow: theme.shadows[5],
    width: "100%",
    padding: theme.spacing(2, 4, 3),
  },
}));
