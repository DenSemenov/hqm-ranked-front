import './App.css';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import HomePage from './components/HomePage';
import Header from './components/Header';
import { App as AppComponent, ConfigProvider, theme as AntdTheme, Tag, Flex, Layout, notification, Button } from 'antd';
import { isMobile } from 'react-device-detect';
import Games from 'components/Games';
import { Suspense, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, getPlayerWarnings, getWebsiteSettings } from 'stores/auth/async-actions';
import { getHomeStats, getSeasons, getSeasonsGames, getSeasonsStats, getStorage } from 'stores/season/async-actions';
import { getActiveServers } from 'stores/server/async-actions';
import { useAppDispatch } from 'hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectCurrentGameData, selectCurrentMode, selectCurrentPlayerData, selectCurrentSeason, selectLoading } from 'stores/season';
import { selectCurrentUser, selectHoveredPosition, selectIsAuth, selectLoadingUser, selectTheme, setLoadingUser, setTheme } from 'stores/auth';
import Player from 'components/Player';
import { LoadingOutlined } from "@ant-design/icons";
import SignalrService from 'services/SignalrService';
import { IHeartbeatResponse } from 'models/IHeartbeatResponse';
import { setUpdatedServer } from 'stores/server';
import { initializeFirebase } from 'firebaseService';
import { getTheme } from 'css/themeConfig';
import Footer from 'components/Footer';
import { IInstanceType } from 'models/IInstanceType';
import Teams from 'components/Teams';
import TeamsGames from 'components/TeamsGames';
import TeamsControl from 'components/TeamsControl';
import { useTransition, animated, useSpring } from "react-spring";
import { IPlayerWarningResponse, WarningType } from 'models/IPlayerWarningResponse';
import { getGameInvites, getTeamsState } from 'stores/teams/async-actions';
import { selectCurrentTeam } from 'stores/teams';
import { getCoins, getContracts } from 'stores/contract/async-actions';
import HoveredPlayerItem from 'shared/HoveredPlayerItem';
import AvatarShapes from 'shared/AvatarShapes';
import { getShopSelects } from 'stores/shop/async-actions';
import ServerDeploy from 'shared/ServerDeploy';
import { getCurrentWeeklyTourneyId, getWeeklyTourney, getWeeklyTourneys } from 'stores/weekly-tourney/async-actions';
import { lazy } from 'react';

const PlayersTable = lazy(() => import('./components/PlayersTable'));
const Game = lazy(() => import('./components/Game'));
const LoginModal = lazy(() => import('./components/LoginModal'));
const RegisterModal = lazy(() => import('./components/RegisterModal'));
const Admin = lazy(() => import('./components/Admin'));
const ProfilePage = lazy(() => import('./components/ProfilePage'));
const ReplayViewerNew = lazy(() => import('./components/ReplayViewerNew'));
const Notifications = lazy(() => import('./components/Notifications'));
const Servers = lazy(() => import('./components/Servers'));
const Other = lazy(() => import('./components/Other'));
const RulesAcception = lazy(() => import('./components/RulesAcception'));
const Top = lazy(() => import('./components/Top'));
const Patrol = lazy(() => import('./components/Patrol'));
const FreeAgents = lazy(() => import('./components/FreeAgents'));
const Team = lazy(() => import('./components/Team'));
const TeamSettings = lazy(() => import('./components/TeamSettings'));
const DiscordLogin = lazy(() => import('./components/DiscordLogin'));
const TransferMarket = lazy(() => import('./components/TransferMarket'));
const PlayersMap = lazy(() => import('./components/PlayersMap'));
const Shop = lazy(() => import('./components/Shop'));
const ReplayTesting = lazy(() => import('./components/ReplayTesting'));
const Faq = lazy(() => import('./components/Faq'));
const WeeklyTourneyComponent = lazy(() => import('./components/WeeklyTourneyComponent'));

const App = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [api, contextHolder] = notification.useNotification();

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
      case "faq":
        return concatTitle("FAQ")
      default:
        return concatTitle("");
    }
  }

  useEffect(() => {
    window.document.title = getTitle(location.pathname.replace("/", ""))
  }, [location.pathname, currentMode, currentPlayerData, currentGameData, currentTeamData]);

  const contentStyle: React.CSSProperties = {
    height: isMobile ? "calc(-124px + 100vh)" : "calc(-48px + 100vh)",
    padding: isMobile ? 0 : 16,
    marginBottom: isMobile ? 68 : 0,
    width: "100vw",
    overflow: "auto"
  };

  const headerStyle: React.CSSProperties = {
    height: 48,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100vw",
    padding: "0 32px",
    background: "rgb(20 20 20 / 45%)"
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
        api.warning({
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
    dispatch(getHomeStats());
    dispatch(getContracts());
    dispatch(getShopSelects());
    dispatch(getCurrentWeeklyTourneyId());
    dispatch(getWeeklyTourneys());
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
      dispatch(getCoins());
    }
  }, [isAuth])

  useEffect(() => {
    const theme = "dark";
    dispatch(setTheme(theme));
  }, []);

  useEffect(() => {
    singnalR.connect();
    singnalR.onHeartbeat = onHeartbeat;
    singnalR.onGamesChange = onGamesChange;
    singnalR.onInvitesChange = onInvitesChange;
    singnalR.onWeeklyTourneyChange = onWeeklyTourneyChange;
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

  const onWeeklyTourneyChange = (id: string) => {
    dispatch(getWeeklyTourneys())
    dispatch(getWeeklyTourney({
      id: id
    }))
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
        <Route path="/replay" element={<ReplayViewerNew />} />
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
        <Route path="/map" element={<PlayersMap />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/replay-testing" element={<ReplayTesting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/replay-viewer-new" element={<ReplayViewerNew />} />
        <Route path="/server-deploy" element={<ServerDeploy />} />
        <Route path="/weekly-tourney" element={<WeeklyTourneyComponent />} />
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
        <Route path="/replay" element={<ReplayViewerNew />} />
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
        <Route path="/map" element={<PlayersMap />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/replay-testing" element={<ReplayTesting />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/replay-viewer-new" element={<ReplayViewerNew />} />
        <Route path="/server-deploy" element={<ServerDeploy />} />
        <Route path="/weekly-tourney" element={<WeeklyTourneyComponent />} />
      </Routes>
    }
  }, [currentMode])

  return (
    <ConfigProvider
      theme={getTheme(true)}
    >
      <Flex gap="middle" className='main-layoutr' >
        <Layout style={{ height: "100vh" }} className='layout'>
          {!loadingUser &&
            <>
              <Layout.Header style={headerStyle}>
                <Header />
              </Layout.Header>
              <Layout.Content style={contentStyle} id="layout">
                <Suspense fallback={<LoadingOutlined />}>
                  {routes}
                </Suspense>
              </Layout.Content>
              {isMobile &&
                <Layout.Footer style={footerStyle}>
                  <Footer />
                </Layout.Footer>
              }
              <AvatarShapes />
            </>
          }
          {loadingUser &&
            <div className='content-loading'>
              <LoadingOutlined style={{ fontSize: 64 }} />
            </div>
          }
          {contextHolder}
        </Layout>
      </Flex>

    </ConfigProvider>
  );
}

export default App;
