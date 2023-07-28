import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const token = localStorage.getItem("TOKEN");

  useEffect(() => {
    if (token) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [token, isLogin]);

  const handleLogout = () => {
    Modal.confirm({
      title: "로그아웃 확인",
      content: "로그아웃하시겠습니까?",
      centered: true, // Add this prop to center the modal
      onOk: () => {
        localStorage.clear();
        setIsLogin(false);
        navigate("/");
      },
      onCancel() {
        // Do nothing if the user cancels the logout.
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        textAlign: "left",
        margin: "0",
        padding: "2vh",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
        <img
          className="phoneImage"
          src={process.env.PUBLIC_URL + "/image/gglogo.png"}
          alt="GG Logo"
          style={{ width: "2rem" }}
        />
        <span style={{ fontSize: "1.5rem", marginLeft: "0.5rem" }}>GG</span>
      </Link>
      <Link to="/login">
        <Button style={{ border: "0" }}></Button>
      </Link>
      {isLogin ? (
        <Button type="text" onClick={handleLogout} danger>
          로그아웃
        </Button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Header;
