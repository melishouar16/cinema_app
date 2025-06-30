import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavigation = (path) => {
    navigate(path);
  };

  const menuItems = [
    { slug: "home", text: "Accueil", icon: <FaHome />, path: "/" },
    { slug: "create", text: "Créer", icon: <FaPlus />, path: "/creer" },
    { slug: "play", text: "Jouer", icon: <FaGamepad />, path: "/play" },
    { slug: "auth", text: isAuthenticated ? "Profil" : "Connexion", icon: <FaUser />, path: "/connexion" },
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
              {menuItems.map((item) => (
                <Menu.Tab
                  key={item.slug}
                  callBack={() => handleNavigation(item.path)}
                  active={location.pathname === item.path}
                  icon={item.icon}
                >
                  {item.text}
                </Menu.Tab>
              ))}
              <Button.ToggleNight />
            </Menu.Bar>

            <main style={{ padding: "1rem" }}>
              <Routes>
                <Route path="/" element={<Pages.Home onNavigate={handleNavigation} />} />
                <Route path="/creer" element={<Pages.CreateEnquete onNavigate={handleNavigation} />} />
                <Route path="/play" element={<Pages.PlayEnquete onNavigate={handleNavigation} />} />
                <Route path="/connexion" element={<Pages.Auth onNavigate={handleNavigation} />} />
              </Routes>
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
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
