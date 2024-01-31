import { AppBar, Box, Button, Container, CssBaseline, Drawer, IconButton, List, ListItem, ListItemText, ListItemButton, Toolbar } from '@mui/material';
// import { ThemeProvider } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
// import theme from './theme';
import './App.css';
import { Link, LinkProps, Route, Routes } from 'react-router-dom';
import GoogleSheet from './GoogleSheet';
import Analytics from './Analytics';
import React from 'react';
import styled from 'styled-components';

const NavButton = styled(Button)<LinkProps>(({ theme }) => ({}));
const MenuButton = styled(ListItemButton)<LinkProps>(({ theme }) => ({}));

function App() {
  const [state, setState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setState(open);
      };

  return (
    // <ThemeProvider theme={theme}>
    <>
      <CssBaseline />

      <Box sx={{ flexGrow: 1, bgcolor: '#f8f8f8', height: '100vh' }}>
        <AppBar position="static" sx={{ bgcolor: '#fff' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor='left'
              open={state}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <List>
                  <ListItem disablePadding>
                    <MenuButton LinkComponent={Link} to="/">
                      <ListItemText primary={"Google Sheet"} />
                    </MenuButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <MenuButton LinkComponent={Link} to="/analytics">
                      <ListItemText primary={"Analytics"} />
                    </MenuButton>
                  </ListItem>
                </List>
              </Box>
            </Drawer>

            <Box sx={{ flexGrow: 1 }} />
            <NavButton LinkComponent={Link} to="/">Google Sheet</NavButton>
            <NavButton LinkComponent={Link} to="/analytics">Analytics</NavButton>
          </Toolbar>
        </AppBar>

        <Container>
          <Routes>
            <Route path="/">
              <Route index element={<GoogleSheet />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </Container>

      </Box>
    </>
    // </ThemeProvider >
  );
}

export default App;
