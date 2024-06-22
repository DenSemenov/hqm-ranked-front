import './App.css';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import HomePage from './components/HomePage';
import Header from './components/Header';
import { App as AppComponent, ConfigProvider, theme as AntdTheme, Tag, Flex, Layout } from 'antd';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import PlayersTable from 'components/PlayersTable';
import Games from 'components/Games';
import { useEffect, useMemo } from 'react';
import { getCurrentUser } from 'stores/auth/async-actions';
import { getSeasons, getSeasonsGames, getSeasonsStats, getStorage } from 'stores/season/async-actions';
import { getActiveServers } from 'stores/server/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectCurrentMode, selectCurrentSeason, selectLoading } from 'stores/season';
import { selectCurrentUser, selectLoadingUser, selectTheme, setLoadingUser, setTheme } from 'stores/auth';
import Player from 'components/Player';
import LoginModal from 'components/LoginModal';
import RegisterModal from 'components/RegisterModal';
import Admin from 'components/Admin';
import { LoadingOutlined } from "@ant-design/icons";
import ProfilePage from 'components/ProfilePage';
import Game from 'components/Game';
import SignalrService from 'services/SignalrService';
import { IHeartbeatResponse } from 'models/IHeartbeatResponse';
import { setUpdatedServer } from 'stores/server';
import ReplayViewer from 'components/ReplayViewer';
import { initializeFirebase } from 'firebaseService';
import Notifications from 'components/Notifications';
import { getTheme } from 'css/themeConfig';
import Footer from 'components/Footer';
import Servers from 'components/Servers';
import Other from 'components/Other';
import RulesAcception from 'components/RulesAcception';
import Top from 'components/Top';
import Patrol from 'components/Patrol';
import { IInstanceType } from 'models/IInstanceType';
import Teams from 'components/Teams';
import FreeAgents from 'components/FreeAgents';
import Team from 'components/Team';
import TeamSettings from 'components/TeamSettings';
import TeamsGames from 'components/TeamsGames';
import TeamsControl from 'components/TeamsControl';

function App() {
  const dispatch = useAppDispatch();

  const currentSeason = useSelector(selectCurrentSeason);
  const theme = useSelector(selectTheme);
  const loadingUser = useSelector(selectLoadingUser);
  const loading = useSelector(selectLoading);
  const currentMode = useSelector(selectCurrentMode);

  const singnalR = new SignalrService();

  const contentStyle: React.CSSProperties = {
    height: isMobile ? "calc(-124px + 100vh)" : "calc(-48px + 100vh)",
    padding: isMobile ? 0 : 16,
    width: "100vw",
    overflow: "auto",
    paddingBottom: isMobile ? 68 : 0
  };

  const headerStyle: React.CSSProperties = {
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100vw",
    padding: "0 32px",
    background: "#141414"
  };

  const footerStyle: React.CSSProperties = {
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100vw",
    padding: "0 16px",
    background: "#141414",
    position: "fixed",
    bottom: 0,
    zIndex: 100
  };

  useEffect(() => {
    initializeFirebase();
  }, [])

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getCurrentUser());
    } else {
      dispatch(setLoadingUser(false))
    }
    dispatch(getSeasons());
    dispatch(getActiveServers());
    dispatch(getStorage());
  }, [])

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    dispatch(setTheme(theme));
  }, []);

  useEffect(() => {
    singnalR.connect();
    singnalR.onHeartbeat = onHeartbeat;
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
        seasonId: currentSeason,
        offset: 0
      }));
      dispatch(getSeasonsGames({
        seasonId: currentSeason,
        offset: 0,
      }));

    }
  }, [currentSeason])

  const onHeartbeat = (data: IHeartbeatResponse) => {
    dispatch(setUpdatedServer(data));
  }

  const routes = useMemo(() => {
    if (currentMode === IInstanceType.Ranked) {
      return <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/players" element={<PlayersTable />} />
        <Route path="/games" element={<Games />} />
        <Route path="/player" element={<Player />} />
        <Route path="/game" element={<Game />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/registration" element={<RegisterModal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/replay" element={<ReplayViewer />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/other" element={<Other />} />
        <Route path="/rules" element={<RulesAcception />} />
        <Route path="/top" element={<Top />} />
        <Route path="/patrol" element={<Patrol />} />
        <Route path="/free-agents" element={<FreeAgents />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team-settings" element={<TeamSettings />} />
      </Routes>
    }
    if (currentMode === IInstanceType.Teams) {
      return <Routes>
        <Route path="/" element={<Teams />} />
        <Route path="/player" element={<Player />} />
        <Route path="/game" element={<Game />} />
        <Route path="/games" element={<TeamsControl />} />
        <Route path="/login" element={<LoginModal />} />
        <Route path="/registration" element={<RegisterModal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/replay" element={<ReplayViewer />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/servers" element={<Servers />} />
        <Route path="/other" element={<Other />} />
        <Route path="/rules" element={<RulesAcception />} />
        <Route path="/top" element={<Top />} />
        <Route path="/patrol" element={<Patrol />} />
        <Route path="/free-agents" element={<FreeAgents />} />
        <Route path="/team" element={<Team />} />
        <Route path="/team-settings" element={<TeamSettings />} />
      </Routes>
    }
  }, [currentMode])

  return (
    <ConfigProvider
      theme={getTheme(theme === "dark")}
    >
      <Flex gap="middle" className='main-layoutr'>
        <Layout style={{ height: "100vh" }}>
          {!loadingUser &&
            <>
              <BrowserRouter>
                <Layout.Header style={headerStyle}>
                  <Header />
                </Layout.Header>
                <Layout.Content style={contentStyle} id="layout">
                  {routes}
                </Layout.Content>
                {isMobile &&
                  <Layout.Footer style={footerStyle}>
                    <Footer />
                  </Layout.Footer>
                }
              </BrowserRouter>
            </>
          }
          {loadingUser &&
            <div className='content-loading'>
              <LoadingOutlined style={{ fontSize: 64 }} />
            </div>
          }

        </Layout>
      </Flex>
    </ConfigProvider>
  );
}

export default App;
