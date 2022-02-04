import { makeStyles } from "@material-ui/core";

export const gameStyles = makeStyles((theme) => ({
  singleCell: {
    border: `5px solid ${theme.palette.primary.main}`,
    width: "6rem",
    height: "6rem",
    ["@media (min-width:769px)"]: {
      width: "10rem",
      height: "10rem",
    },
  },
  activeHover: {
    "&:hover": {
      backgroundColor: "#b5e2ff",
    },
  },
  disabledCell: {
    backgroundColor: "#f0f0f0",
  },
}));
