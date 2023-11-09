import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage';
import Header from './components/Header';
import "./css/colors.css";
import { ConfigProvider } from 'antd';
import { BrowserView, MobileView } from 'react-device-detect';
import PlayersTable from 'components/PlayersTable';
import Games from 'components/Games';
import Servers from 'components/Servers';
import MobileHeader from 'components/MobileHeader';
import { useEffect } from 'react';
import { getCurrentUser } from 'stores/auth/async-actions';
import { getSeasons, getSeasonsGames, getSeasonsStats } from 'stores/season/async-actions';
import { getActiveServers } from 'stores/server/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectCurrentSeason } from 'stores/season';
import { selectTheme, setTheme } from 'stores/auth';

function App() {
  const dispatch = useAppDispatch();

  const currentSeason = useSelector(selectCurrentSeason);
  const theme = useSelector(selectTheme);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    }

    dispatch(getSeasons());
    dispatch(getActiveServers());
  }, [])

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    console.log(theme);
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

  return (
    <div className="app">
      <ConfigProvider
        theme={{
          token: {
            colorText: "var(--text)",
            borderRadius: 4,
            colorPrimaryBg: 'var(--primary)',
            colorLink: "var(--text)",
            fontFamily: "RF Dewi",
            fontSize: 14,
            fontWeightStrong: 900,
            colorBorderSecondary: "var(--border)",
          },
        }}
      >
        <BrowserView >
          <BrowserRouter>
            <Header />
            <div className='content'>
              <Routes>
                <Route path="/" element={<HomePage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </BrowserView>
        <MobileView>
          <BrowserRouter>
            <MobileHeader />
            <div className='mobile-content'>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/players" element={<PlayersTable full={true} />} />
                <Route path="/games" element={<Games />} />
              </Routes>
            </div>
            <Header />
          </BrowserRouter>
        </MobileView>
      </ConfigProvider>

    </div>
  );
}

export default App;
