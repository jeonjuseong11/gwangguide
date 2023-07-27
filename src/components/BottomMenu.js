import React from "react";
import {
  HeartOutlined,
  HomeOutlined,
  OrderedListOutlined,
  PlusCircleOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
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
        width: "30rem",
        paddingTop: "1rem",
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <Header />
      <main style={{ height: "32.5rem" }}>
        <Outlet />
      </main>
      <Menu
        style={{ marginTop: "1rem", justifyContent: "center", border: "0", marginBottom: "1rem" }}
        mode="horizontal"
      >
        {items.map((item) => (
          <Link key={item.key} to={item.key}>
            <Menu.Item
              icon={item.icon}
              style={{
                marginLeft: "1rem",
                marginRight: "1rem",
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
