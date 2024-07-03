import './App.css';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './components/HomePage';
import Header from './components/Header';
import { App as AppComponent, ConfigProvider, theme as AntdTheme, Tag, Flex, Layout, notification, Button } from 'antd';
import { BrowserView, MobileView, isMobile } from 'react-device-detect';
import PlayersTable from 'components/PlayersTable';
import Games from 'components/Games';
import { useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getPlayerWarnings, getWebsiteSettings } from 'stores/auth/async-actions';
import { getSeasons, getSeasonsGames, getSeasonsStats, getStorage } from 'stores/season/async-actions';
import { getActiveServers } from 'stores/server/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectCurrentGameData, selectCurrentMode, selectCurrentPlayerData, selectCurrentSeason, selectLoading } from 'stores/season';
import { selectCurrentUser, selectIsAuth, selectLoadingUser, selectTheme, setLoadingUser, setTheme } from 'stores/auth';
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
import { useTransition, animated, useSpring } from "react-spring";
import DiscordLogin from 'components/DiscordLogin';
import { IPlayerWarningResponse, WarningType } from 'models/IPlayerWarningResponse';
import TransferMarket from 'components/TransferMarket';
import { getGameInvites, getTeamsState } from 'stores/teams/async-actions';
import { selectCurrentTeam } from 'stores/teams';

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const springProps = useSpring({ to: { opacity: 1 }, from: { opacity: 0 } });

  const currentSeason = useSelector(selectCurrentSeason);
  const theme = useSelector(selectTheme);
  const loadingUser = useSelector(selectLoadingUser);
  const currentMode = useSelector(selectCurrentMode);
  const isAuth = useSelector(selectIsAuth);
  const currentPlayerData = useSelector(selectCurrentPlayerData);
  const currentGameData = useSelector(selectCurrentGameData);
  const currentTeamData = useSelector(selectCurrentTeam);

  const [logInWarningShown, setLogInWarningShown] = useState<boolean>(false);

  const singnalR = new SignalrService();

  const concatTitle = (name: string) => {
    if (name) {
      return "Ranked | " + name;
    } else {
      return "Ranked";
    }

  }

  const getTitle = (pathname: string) => {
    switch (pathname) {
      case "":
        return currentMode === IInstanceType.Ranked ? concatTitle("") : concatTitle("Teams");
      case "player":
        return currentPlayerData ? concatTitle(currentPlayerData.name) : concatTitle("")
      case "game":
        return currentGameData ? concatTitle("Game " + currentGameData.id) : concatTitle("")
      case "team":
        return currentTeamData ? concatTitle(currentTeamData.name) : concatTitle("")
      case "login":
        return concatTitle("Login")
      case "registration":
        return concatTitle("Registration")
      case "admin":
        return concatTitle("Admin")
      case "profile":
        return concatTitle("Profile")
      case "notifications":
        return concatTitle("Notifications settings")
      case "rules":
        return concatTitle("Rules acception")
      case "top":
        return concatTitle("Top stats")
      case "patrol":
        return concatTitle("Patrol")
      case "free-agents":
        return concatTitle("Free agents")
      case "team-settings":
        return concatTitle("Team settings")
      case "transfer-market":
        return concatTitle("Transfer market")
      default:
        return concatTitle("");
    }
  }

  useEffect(() => {
    springProps.opacity.reset();
    springProps.opacity.start();
  }, [location.pathname, currentMode]);

  useEffect(() => {
    window.document.title = getTitle(location.pathname.replace("/", ""))
  }, [location.pathname, currentMode, currentPlayerData, currentGameData, currentTeamData]);

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

      if (!logInWarningShown) {
        notification.warning({
          message: <div style={{ display: "flex", flexDirection: "column" }}>
            <span>{"Please log in to access all the features of the site"}</span>
            <Link to={"/login"} >
              <Button type="primary" >Go to log in</Button>
            </Link>
          </div>,
          placement: "bottomRight"
        })
        setLogInWarningShown(true)
      }
    }
    dispatch(getSeasons());
    dispatch(getActiveServers());
    dispatch(getStorage());
  }, [])

  useEffect(() => {
    if (isAuth) {
      dispatch(getPlayerWarnings()).unwrap().then((data: IPlayerWarningResponse[]) => {
        data.forEach(warning => {
          let message = <div>{warning.message}</div>
          switch (warning.type) {
            case WarningType.DiscordNotConnected:
              message = <div style={{ display: "flex", flexDirection: "column" }}>
                <span>{warning.message}</span>
                <Button type="primary" onClick={() => navigate("/profile")}>Go to profile</Button>
              </div>
              break;
          }
          notification.warning({
            message: message,
            placement: "bottomRight"
          })
        })
      });

      dispatch(getTeamsState())

    }
  }, [isAuth])

  useEffect(() => {
    const theme = localStorage.getItem("theme") ?? "light";
    dispatch(setTheme(theme));
  }, []);

  useEffect(() => {
    singnalR.connect();
    singnalR.onHeartbeat = onHeartbeat;
    singnalR.onGamesChange = onGamesChange;
    singnalR.onInvitesChange = onInvitesChange;
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
      dispatch(getWebsiteSettings())
    }
  }, [currentSeason])

  const onHeartbeat = (data: IHeartbeatResponse) => {
    dispatch(setUpdatedServer(data));
  }

  const onGamesChange = () => {
    if (currentSeason) {
      dispatch(getSeasonsGames({
        seasonId: currentSeason,
        offset: 0,
      }));
    }
  }

  const onInvitesChange = () => {
    dispatch(getGameInvites());
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
        <Route path="/discordlogin" element={<DiscordLogin />} />
        <Route path="/transfer-market" element={<TransferMarket />} />

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
        <Route path="/discordlogin" element={<DiscordLogin />} />
        <Route path="/transfer-market" element={<TransferMarket />} />
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
              <Layout.Header style={headerStyle}>
                <Header />
              </Layout.Header>
              <Layout.Content style={contentStyle} id="layout">
                <animated.div style={springProps} className={"animated"}>
                  {routes}
                </animated.div>
              </Layout.Content>
              {isMobile &&
                <Layout.Footer style={footerStyle}>
                  <Footer />
                </Layout.Footer>
              }
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
