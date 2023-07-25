import { Button } from "antd";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReviewItem from "./ReviewItem";

const ReviewList = ({ reviews }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("TOKEN");
  return (
    <div className="review-list">
      {token ? (
        <Button
          style={{ float: "right", marginRight: "2rem", marginTop: "1rem" }}
          onClick={() => {
            navigate(`/restaurant/${id}/review`);
          }}
        >
          리뷰 작성
        </Button>
      ) : (
        <></>
      )}
      <h3
        style={{
          marginTop: "0",
          textAlign: "left",
          marginLeft: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid black",
          marginRight: "2rem",
        }}
      >
        Reviews
      </h3>
      {reviews.map((review, index) => (
        <ReviewItem key={index} {...review} />
      ))}
    </div>
  );
};

export default ReviewList;
