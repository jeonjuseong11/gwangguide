import { ConfigProvider } from "antd";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";

import Home from "./pages/Home";

import BottomMenu from "./components/BottomMenu";
import RankPage from "./pages/RankPage";
import AddRestaurant from "./pages/AddRestaurant";
import DetailResturant from "./pages/DetailResturant";
import { useEffect, useState } from "react";
import ReviewPost from "./components/ReviewPost";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

function App() {
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState(location.pathname);

  useEffect(() => {
    setSelectedMenu(location.pathname);
  }, [location]);
  return (
    <ConfigProvider>
      <div
        className="App"
        style={{
          backgroundColor: "#f2f2f2",
          width: "100vw",
          height: "99vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Routes>
          <Route element={<BottomMenu selectedMenu={selectedMenu} />}>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/add" element={<AddRestaurant />} />
            <Route exact path="/rank" element={<RankPage />} />
            <Route exact path="/restaurant/:id" element={<DetailResturant />} />
            <Route exact path="/restaurant/:id/review" element={<ReviewPost />} />
          </Route>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </ConfigProvider>
  );
}

export default App;
