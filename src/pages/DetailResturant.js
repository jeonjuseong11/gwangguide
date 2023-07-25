import { Rate } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewList from "../components/ReviewList";

function DetailRestaurant() {
  const { id } = useParams();

  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    // API 요청을 보내고 데이터를 받아오는 함수
    const fetchData = async () => {
      try {
        // API 요청
        const response = await axios.get(
          `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/${id}?includeReviews=true`
        );
        // API로 받아온 리뷰 데이터를 상태에 저장
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
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchData();
  }, []);

  const [restaurantData, setRestaurantData] = useState(null);
  const [rateText, setRateText] = useState("평가 없음"); // Initialize with default value

  useEffect(() => {
    if (reviews.length > 0) {
      // Calculate averageRating for the reviews
      const totalAverageRating = reviews.reduce((sum, review) => sum + review.averageRating, 0);
      const overallAverageRating = totalAverageRating / reviews.length;

      // Set rateText based on the overallAverageRating
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

  if (!restaurantData) {
    return <div>해당 식당이 없습니다...</div>;
  }

  return (
    <div style={{ overflowY: "auto", maxHeight: "80vh", height: "calc(100vh - 16rem)" }}>
      <div
        style={{
          borderRadius: "10px",
          backgroundColor: "#f2f2f2",
          height: "15rem",
          width: "90%",
          margin: "0 auto",
        }}
      >
        <img style={{ width: "100%", height: "100%" }} alt="logo" src={restaurantData.image} />
      </div>
      <div style={{ paddingTop: "1rem", padding: "2rem", textAlign: "left", paddingBottom: "0" }}>
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
