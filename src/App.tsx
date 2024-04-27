import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage';
import Header from './components/Header';
import "./css/colors.css";
import { App as AppComponent, ConfigProvider, theme as AntdTheme } from 'antd';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import PlayersTable from 'components/PlayersTable';
import Games from 'components/Games';
import { useEffect, useMemo } from 'react';
import { getCurrentUser } from 'stores/auth/async-actions';
import { getSeasons, getSeasonsGames, getSeasonsStats } from 'stores/season/async-actions';
import { getActiveServers } from 'stores/server/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectCurrentSeason } from 'stores/season';
import { selectLoadingUser, selectTheme, setLoadingUser, setTheme } from 'stores/auth';
import Player from 'components/Player';
import LoginModal from 'components/LoginModal';
import RegisterModal from 'components/RegisterModal';
import Admin from 'components/Admin';
import { LoadingOutlined } from "@ant-design/icons";
import ProfilePage from 'components/ProfilePage';
import Game from 'components/Game';

function App() {
  const dispatch = useAppDispatch();

  const currentSeason = useSelector(selectCurrentSeason);
  const theme = useSelector(selectTheme);
  const loadingUser = useSelector(selectLoadingUser);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    } else {
      dispatch(setLoadingUser(false))
    }
    dispatch(getSeasons());
    dispatch(getActiveServers());
  }, [])

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    dispatch(setTheme(theme));
  }, []);

  useEffect(() => {
    if (theme) {
      localStorage.setItem("theme", theme);

      document.body.classList.remove("light", "dark");
      document.body.classList.add(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (currentSeason) {
      dispatch(getSeasonsStats({
        seasonId: currentSeason
      }));
      dispatch(getSeasonsGames({
        seasonId: currentSeason
      }));

    }
  }, [currentSeason])

  const routes = useMemo(() => {
    return <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/players" element={<PlayersTable full={true} />} />
      <Route path="/games" element={<Games />} />
      <Route path="/player" element={<Player />} />
      <Route path="/game" element={<Game />} />
      <Route path="/login" element={<LoginModal />} />
      <Route path="/registration" element={<RegisterModal />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  }, [])

  return (
    <ConfigProvider
      theme={{
        token: {
          sizeStep: 4,
          fontSize: 14,
          borderRadius: 8,
          wireframe: false,
        },
        components: {
          Table: {
            borderRadius: 0,
            headerBorderRadius: 0,
          },
          Card: {
            borderRadius: isMobile ? 0 : 8,
            borderRadiusOuter: isMobile ? 0 : 8,
            borderRadiusSM: isMobile ? 0 : 8,
            borderRadiusXS: isMobile ? 0 : 8,
            borderRadiusLG: isMobile ? 0 : 8,
          },
          Button: {
            colorBorder: "transparent",
            boxShadow: "none"
          },
          Select: {
            colorBorder: "transparent"
          },
          Input: {
            colorBorder: "transparent"
          },
        },
        algorithm: theme === "dark" ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm,
      }}
    >
      <div className="app">
        {!loadingUser &&
          <BrowserRouter>
            <Header />
            <BrowserView>
              <div className='content'>
                {routes}
              </div>
            </BrowserView>
            <MobileView>
              <div className='content-mobile'>
                {routes}
              </div>
            </MobileView>
          </BrowserRouter>
        }
        {loadingUser &&
          <div className='content-loading'>
            <LoadingOutlined style={{ fontSize: 64 }} />
          </div>
        }
      </div>
    </ConfigProvider>
  );
}

export default App;
