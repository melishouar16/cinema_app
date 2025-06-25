import React, { useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { Provider } from 'react-redux';
import { store } from "./store";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NightModeProvider } from './contexts/NightModeContext';
import { Menu, Button } from './components/molecules';
import * as Pages from './components/pages';
import { FaHome, FaPlus, FaGamepad, FaUser } from 'react-icons/fa';
import './App.css';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  // théme jour/nuit
  const nightTheme = {
    nightMode: true,
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
    nightMode: false,
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

  const [nightMode, setNightMode] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");

  // Fonction de navigation que nous passerons aux composants
  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  // navigation simple
  const getPageContent = () => {
    switch (currentPage) {
      case "home":
        return <Pages.Home onNavigate={handleNavigation} />;
      case "create":
        return <Pages.CreateEnquete onNavigate={handleNavigation} />;
      case "play":
        return <Pages.PlayEnquete onNavigate={handleNavigation} />;
      case "auth":
        return <Pages.Auth onNavigate={handleNavigation} />;
      default:
        return <Pages.Home onNavigate={handleNavigation} />;
    }
  };

  const menuItems = [
    { slug: "home", text: "Accueil", icon: <FaHome /> },
    { slug: "create", text: "Créer", icon: <FaPlus /> },
    { slug: "play", text: "Jouer", icon: <FaGamepad /> },
    { slug: "auth", text: isAuthenticated ? "Profil" : "Connexion", icon: <FaUser /> },
  ];

  return (
    <Provider store={store}>
      <NightModeProvider value={{ nightMode, switchNightMode: () => setNightMode(!nightMode) }}>
        <ThemeProvider theme={nightMode ? nightTheme : dayTheme}>
          <div style={{
            backgroundColor: nightMode ? "#1a1a1a" : "white",
            minHeight: "100vh",
            color: nightMode ? "white" : "black"
          }}>

            <Menu.Bar>
              {menuItems.map((item, i) => (
                <Menu.Tab
                  key={i}
                  callBack={() => setCurrentPage(item.slug)}
                  active={currentPage === item.slug}
                  icon={item.icon}
                >
                  {item.text}
                </Menu.Tab>
              ))}
              <Button.ToggleNight />
            </Menu.Bar>

            <main>
              {getPageContent()}
            </main>

          </div>
        </ThemeProvider>
      </NightModeProvider>
    </Provider>
  );
};

// react monte AuthProvider et crée le contexte ensuite useAuth s'execute (contexte disponible)
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
