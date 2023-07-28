import { Spin, Empty } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewList from "../components/ReviewList";

function DetailRestaurant() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [restaurantData, setRestaurantData] = useState(null);
  const [rateText, setRateText] = useState("평가 없음");

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get(
          `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/${id}?includeReviews=true`
        );
        const updatedData = response.data.Reviews.map((item) => {
          const averageRating =
            (item.taste_rating + item.service_rating + item.price_rating + item.hygiene_rating) / 4;
          return {
            ...item,
            averageRating: Math.min(averageRating / 20, 5),
          };
        });
        setReviews(updatedData);
        setRestaurantData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalAverageRating = reviews.reduce((sum, review) => sum + review.averageRating, 0);
      const overallAverageRating = totalAverageRating / reviews.length;

      switch (Math.round(overallAverageRating)) {
        case 5:
          setRateText("너무 좋아요");
          break;
        case 4:
          setRateText("좋아요");
          break;
        case 3:
          setRateText("보통이에요");
          break;
        case 2:
          setRateText("별로에요");
          break;
        case 1:
          setRateText("다신 안가요");
          break;
        default:
          setRateText("평가 없음");
      }
    } else {
      setRateText("평가 없음");
    }
  }, [reviews]);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "33rem" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (!restaurantData) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}
      >
        <Empty description="해당 가게가 없습니다." />
      </div>
    );
  }

  return (
    <div
      style={{
        overflow: "hidden",
        overflowY: "auto",
        maxHeight: "33rem",
      }}
    >
      <div
        style={{
          borderRadius: "10px",
          backgroundColor: "#f2f2f2",
          height: "100%",
          margin: "0 auto",
        }}
      >
        <img style={{ width: "100%", height: "100%" }} alt="logo" src={restaurantData.image} />
      </div>
      <div
        style={{
          paddingTop: "1rem",
          padding: "2rem",
          textAlign: "left",
          paddingBottom: "0",
        }}
      >
        <h1 style={{ margin: "0" }}>{restaurantData.name}</h1>
        <div style={{ display: "flex" }}>
          <img
            style={{ width: "5rem", height: "5rem" }}
            alt="rateImage"
            src={
              rateText === "너무 좋아요"
                ? process.env.PUBLIC_URL + "/image/veryHigh.png"
                : rateText === "좋아요"
                ? process.env.PUBLIC_URL + "/image/high.png"
                : rateText === "보통이에요"
                ? process.env.PUBLIC_URL + "/image/middle.png"
                : rateText === "별로에요"
                ? process.env.PUBLIC_URL + "/image/low.png"
                : process.env.PUBLIC_URL + "/image/veryLow.png"
            }
          />
          <p style={{ fontSize: "1.5rem" }}>{rateText}</p>
        </div>
      </div>
      <ReviewList admin={restaurantData.Admin} reviews={reviews} />
    </div>
  );
}

export default DetailRestaurant;
