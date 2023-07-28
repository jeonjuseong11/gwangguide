import React from "react";
import { HomeOutlined, OrderedListOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";

const items = [
  {
    label: "홈",
    key: "/",
    icon: <HomeOutlined />,
  },
  {
    label: "랭킹",
    key: "/rank",
    icon: <OrderedListOutlined />,
  },
  {
    label: "식당 추가",
    key: "/add",
    icon: <PlusCircleOutlined />,
  },
];

const BottomMenu = ({ selectedMenu }) => {
  return (
    <div
      style={{
        borderRadius: "10px",
        backgroundColor: "white",
        textAlign: "center",
        height: "100vh",
      }}
    >
      <Header />
      <main style={{ height: "82vh", overflow: "hidden" }}>
        <Outlet />
      </main>
      <Menu
        style={{
          justifyContent: "center",
          border: "0",
          marginBottom: "2vh",
          marginTop: "2vh",

          backgroundColor: "white",
        }}
        mode="horizontal"
      >
        {items.map((item) => (
          <Link key={item.key} to={item.key}>
            <Menu.Item
              icon={item.icon}
              style={{
                marginLeft: "2vw",
                fontSize: "2vh",
                marginRight: "2vw",
                borderRadius: "10px",
                backgroundColor: selectedMenu === item.key ? "#1890ff" : "transparent",
                color: selectedMenu === item.key ? "white" : "black",
              }}
            >
              {item.label}
            </Menu.Item>
          </Link>
        ))}
      </Menu>
    </div>
  );
};

export default BottomMenu;
