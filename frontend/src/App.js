import logo from './logo.svg';
import React, { useState, useContext } from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from "./store";
import { AuthProvider, AuthContext } from './context/AuthContext';
import { NightModeProvider, NightModeContext } from './context/NightModeContext';
import { Menu, Button } from './components/molecules';
import { Typography } from './components/atoms'
import * as Pages from './components/pages';

import './App.css';

function App() {

  const nightTheme = {
    default: { color: "white" },
    typography: {
      title: "white",
      subTitle: "white",
      link: "#4A90E2",
      paragraph: "white"
    },
    container: { primary: "#1a1a1a" },
    color: "white",
    bgColor: "#1a1a1a"

  };

  const dayTheme = {
    default: { color: "black" },
    typography: {
      title: "black",
      subTitle: "black",
      link: "#4A90E2",
      paragraph: "black"

    },
    container: { primary: 'white' },
    color: "black",
    bgColor: "white"

  };

  const [nightMode, setNightMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  let context = useContext(NightModeContext);
  const [currentPage, setCurrentPage] = useState("home");

  const getPageContent = () => {

    switch (currentPage) {
      case "home":
        return <Pages.Home />;

      case "create":
        return <Pages.CreateEnquete />;

      case "play":
        return <Pages.PlayEnquete />;

      case "auth":
        return <Pages.Auth />;

      default:
        return <Pages.Home />;

    }
  };

  // onglets cliquables
  const menuItems = [
    { slug: "home", text: "Accueil" },
    { slug: "create", text: "Créer une enquete" },

  ];

  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider theme={nightMode ? nightTheme : dayTheme}>
          <NightModeProvider value={{
            nightMode: nightMode,
            switchNightMode: () => setNightMode(!nightMode)
          }}>

            <Menu.Bar>
              {menuItems.map((item, i) => (
                <Menu.Tab
                  key={i}
                  callBack={() => setCurrentPage(item.slug)}
                >
                  {item.text}
                </Menu.Tab>
              ))}

              <Button.ToggleNight />

              <Typography.Paragraph>
                👤 Utilisateur
              </Typography.Paragraph>
            </Menu.Bar>

            {getPageContent()}

          </NightModeProvider>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}





export default App;
