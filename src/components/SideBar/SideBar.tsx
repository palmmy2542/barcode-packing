import { ChevronLeftRounded } from "@mui/icons-material";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { useMediaQuery, useTheme } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const drawerWidth = 240;

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isDownMedium",
})<{
  open?: boolean;
  shouldShowNavbar?: boolean;
  isDownMedium?: boolean;
}>(({ theme, open, isDownMedium }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: "100%",
  marginLeft: `${open && !isDownMedium ? `-${drawerWidth}px` : 0}`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft({ main }: { main: JSX.Element }) {
  const navigate = useNavigate();
  const isOpen = localStorage.getItem("isOpenSideNav") ?? "true";
  const [open, setOpen] = useState(/true/.test(isOpen));
  const theme = useTheme();
  const isDownMedium = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = (open: boolean) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    localStorage.setItem("isOpenSideNav", JSON.stringify(open));

    setOpen(open);
  };

  useEffect(() => {
    if (isDownMedium) {
      setOpen(false);
    } else {
      setOpen(/true/.test(isOpen));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDownMedium]);
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
            onClick={toggleDrawer(!open)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        onClose={toggleDrawer(false)}
        anchor="left"
        variant={isDownMedium ? "temporary" : "persistent"}
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawer(false)}>
            <ChevronLeftRounded />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            { text: "แสกนสินค้า", path: "/scanning", icon: <InboxIcon /> },
            { text: "สินค้าทั้งหมด", path: "/", icon: <InboxIcon /> },
            { text: "กล่อง/ลังทั้งหมด", path: "/cases", icon: <MailIcon /> },
            { text: "พาเลสทั้งหมด", path: "/palettes", icon: <MailIcon /> },
          ].map(({ text, icon, path }, index) => (
            <ListItem key={`${text}-${index}`} onClick={() => navigate(path)}>
              <ListItemButton>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open} isDownMedium={isDownMedium}>
        <DrawerHeader />
        {main}
      </Main>
    </Box>
  );
}
