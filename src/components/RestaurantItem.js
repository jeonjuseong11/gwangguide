// RestaurantItem.js
import React from "react";
import { Link } from "react-router-dom";
import { List, Dropdown, Menu } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

const DropdownMenu = ({ item, onEdit, onDelete }) => (
  <Menu>
    <Menu.Item onClick={() => onEdit(item)}>수정하기</Menu.Item>
    <Menu.Item danger onClick={() => onDelete(item.id)}>
      삭제하기
    </Menu.Item>
  </Menu>
);

const RestaurantItem = ({ item, hasToken, onEdit, onDelete, getImageUrl }) => (
  <List.Item key={item.name} style={{ position: "relative" }}>
    <Link to={`/restaurant/${item.id}`}>
      <List.Item.Meta
        avatar={<img style={{ width: "8rem" }} src={item.image} />}
        description={
          <div>
            <span style={{ color: "black", fontWeight: "600" }}>{item.name}</span>
            <br />
            <span>{item.address}</span>
            <br />
            <img
              style={{ width: "3rem", height: "3rem" }}
              alt="rateImage"
              src={getImageUrl(parseFloat(item.averageRating))}
            />
          </div>
        }
      />
      {item.content}
    </Link>
    {hasToken && (
      <div style={{ position: "absolute", right: "1rem", top: ".5rem" }}>
        <Dropdown
          overlay={<DropdownMenu item={item} onEdit={onEdit} onDelete={onDelete} />}
          trigger={["hover"]}
        >
          <EllipsisOutlined />
        </Dropdown>
      </div>
    )}
  </List.Item>
);

export default RestaurantItem;
