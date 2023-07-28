// RankingPage.js

import React, { useEffect, useState } from "react";
import { List, Spin, Empty, Button } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

function RankingPage() {
  const [loading, setLoading] = useState(true);
  const [storesByCategory, setStoresByCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchStoresByCategory = async () => {
    try {
      const response = await axios.get(
        "https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores?includeReviews=true"
      );
      const stores = response.data;
      // 가게들을 카테고리별로 그룹화하여 평점을 계산합니다.
      const storesByCategory = {};
      for (const store of stores) {
        const category = store.category;
        if (store.Reviews) {
          // Check if store.Reviews exists
          const averageRating =
            store.Reviews.reduce(
              (sum, review) =>
                sum +
                (review.taste_rating +
                  review.service_rating +
                  review.price_rating +
                  review.hygiene_rating) /
                  4,
              0
            ) / store.Reviews.length;
          if (!storesByCategory[category]) {
            storesByCategory[category] = [];
          }
          storesByCategory[category].push({ ...store, averageRating });
        }
      }
      // 평점을 기준으로 내림차순으로 정렬합니다.
      for (const category in storesByCategory) {
        storesByCategory[category].sort((a, b) => b.averageRating - a.averageRating);
      }
      setStoresByCategory(storesByCategory);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStoresByCategory();
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          width: "100vw",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (Object.keys(storesByCategory).length === 0) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}
      >
        <Empty description="가게 정보가 없습니다." />
      </div>
    );
  }
  return (
    <div>
      <div
        style={{ marginBottom: "1rem", display: "flex", justifyContent: "center", width: "100vw" }}
      >
        {Object.keys(storesByCategory).map((category) => (
          <Button
            shape="circle"
            key={category}
            type={selectedCategory === category ? "primary" : "default"}
            onClick={() => handleCategoryClick(category)}
            style={{ marginLeft: ".5rem", marginRight: ".5rem", width: "3rem", height: "3rem" }}
          >
            {category}
          </Button>
        ))}
      </div>
      {selectedCategory ? (
        <div>
          <h2
            style={{
              margin: "0",
              padding: "1rem",
              borderTop: "1px solid #f2f2f2",
              borderBottom: "1px solid #f2f2f2",
            }}
          >
            {selectedCategory} 랭킹
          </h2>
          {storesByCategory[selectedCategory].length > 0 ? (
            <List
              style={{ textAlign: "left" }}
              dataSource={storesByCategory[selectedCategory]}
              renderItem={(item, index) => (
                <Link to={`/restaurant/${item.id}`}>
                  <List.Item key={item.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                    <List.Item.Meta
                      title={
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "1rem",
                          }}
                        >
                          <p>{index + 1}</p>
                          <h2 style={{ marginLeft: "1rem", width: "25vw" }}>{item.name}</h2>
                          <div style={{ marginLeft: "2rem", fontWeight: "500", color: "#a2a2a2" }}>
                            <p style={{ margin: "0" }}>
                              {item.Reviews.length === 0
                                ? "리뷰없음"
                                : `평점: ${item.averageRating.toFixed(1)}`}
                            </p>
                            <p style={{ margin: "0" }}>{item.address}</p>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                </Link>
              )}
            />
          ) : (
            <div>
              <p>리뷰없음</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h2>카테고리를 선택해주세요.</h2>
        </div>
      )}
    </div>
  );
}

export default RankingPage;
