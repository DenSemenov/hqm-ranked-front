import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage';
import Header from './components/Header';
import "./css/colors.css";
import { ConfigProvider } from 'antd';

function App() {
  return (
    <div className="app light">
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
        <Header />
        <div className='content'>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ConfigProvider>
    </div>
  );
}

export default App;
