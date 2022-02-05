import { makeStyles } from "@material-ui/core";

export const gameStyles = makeStyles((theme) => ({
  singleCell: {
    width: "6rem",
    height: "6rem",
    "@media (min-width:769px)": {
      width: "10rem",
      height: "10rem",
    },
  },
  topCellBorder: {
    borderTop: `5px solid ${theme.palette.primary.main}`,
  },
  bottomCellBorder: {
    borderBottom: `5px solid ${theme.palette.primary.main}`,
  },
  leftCellBorder: {
    borderLeft: `5px solid ${theme.palette.primary.main}`,
  },
  rightCellBorder: {
    borderRight: `5px solid ${theme.palette.primary.main}`,
  },
  activeHover: {
    "&:hover": {
      backgroundColor: "#b5e2ff",
    },
  },
  disabledCell: {
    backgroundColor: "#f0f0f0",
  },
  goBackFab: {
    margin: 0,
    top: "auto",
    bottom: "auto",
    right: "auto",
    left: "10px",
    position: "fixed",
    zIndex: 1,
  },
}));
