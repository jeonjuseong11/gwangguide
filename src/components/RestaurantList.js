import React from "react";
import { List, Spin } from "antd";
import RestaurantItem from "./RestaurantItem";

const RestaurantList = ({ data, loading, hasToken, onEdit, onDelete }) => {
  // Move the getImageUrl function outside the component body
  const getImageUrl = (averageRating) => {
    if (averageRating >= 4.5) {
      return process.env.PUBLIC_URL + "/image/veryHigh.png";
    } else if (averageRating >= 3.5) {
      return process.env.PUBLIC_URL + "/image/high.png";
    } else if (averageRating >= 2.5) {
      return process.env.PUBLIC_URL + "/image/middle.png";
    } else if (averageRating >= 1.5) {
      return process.env.PUBLIC_URL + "/image/low.png";
    } else {
      return process.env.PUBLIC_URL + "/image/veryLow.png";
    }
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Spin size="large" />
        </div>
      ) : (
        <List
          itemLayout="vertical"
          size="small"
          style={{
            textAlign: "left",
            position: "relative",
            overflowX: "hidden", // 가로 스크롤 숨김
            whiteSpace: "nowrap",
          }}
          grid={{
            xs: 1,
            sm: 2,
            md: 2,
            lg: 3,
            xl: 3,
            xxl: 3,
          }}
          dataSource={data}
          renderItem={(item) => (
            <RestaurantItem
              item={item}
              hasToken={hasToken}
              onEdit={onEdit}
              onDelete={onDelete}
              getImageUrl={getImageUrl}
            />
          )}
        />
      )}
    </div>
  );
};

export default RestaurantList;
