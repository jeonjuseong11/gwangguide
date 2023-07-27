import React, { useEffect, useState } from "react";
import { Form, Input, Rate, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ReviewPost = () => {
  const { id } = useParams();

  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      // API 요청
      const response = await axios.get(
        `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/${id}`
      );
      // API로 받아온 리뷰 데이터를 상태에 저장
      setSelectedData(response.data);
    } catch (error) {
      alert("해당 식당에 데이터가 없습니다");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (!token) {
      alert("관리자만 가능합니다");
      navigate(-1);
    }
  }, []);
  useEffect(() => {
    // API 요청을 보내고 데이터를 받아오는 함수
  }, [id]);
  const onFinish = async (values) => {
    // 리뷰 작성 완료 후 처리하는 로직을 추가할 수 있습니다.
    const token = JSON.parse(localStorage.getItem("TOKEN"));
    console.log("Review submitted:", values);
    try {
      const updatedValues = {
        ...values,
        taste_rating: values.taste_rating * 20,
        service_rating: values.service_rating * 20,
        price_rating: values.price_rating * 20,
        hygiene_rating: values.hygiene_rating * 20,
        storeId: id,
      };

      // API 요청
      const response = await axios.post(
        `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/reviews/`,
        updatedValues,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );
      // API로 받아온 리뷰 데이터를 상태에 저장
      navigate(-1);
      fetchData();
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const [selectedData, setSelectedData] = useState(null); // 상태 변수로 선언
  useEffect(() => {
    // fetchData 함수를 호출하여 API 요청 실행
    fetchData();
  }, [id]);
  return (
    <div style={{ paddingLeft: "2rem", paddingRight: "2rem", textAlign: "left" }}>
      {selectedData && (
        <h3 style={{ marginTop: "0.5rem", marginBottom: "0" }}> {selectedData.name} 리뷰 작성</h3>
      )}
      <Form name="reviewForm" onFinish={onFinish} onFinishFailed={onFinishFailed} layout="vertical">
        <label>리뷰 내용</label>
        <Form.Item
          name="review"
          rules={[
            {
              required: true,
              message: "리뷰 내용을 입력해주세요.",
            },
            {
              max: 300,
              message: "리뷰 내용은 최대 300자까지 입력 가능합니다.",
            },
          ]}
        >
          <Input.TextArea rows={4} showCount maxLength={300} style={{ resize: "none" }} />
        </Form.Item>
        <label>맛 별점</label>
        <Form.Item
          name="taste_rating"
          rules={[
            {
              required: true,
              message: "별점을 입력해주세요.",
            },
          ]}
        >
          <Rate allowHalf />
        </Form.Item>
        <label>서비스 별점</label>
        <Form.Item
          name="service_rating"
          rules={[
            {
              required: true,
              message: "별점을 입력해주세요.",
            },
          ]}
        >
          <Rate allowHalf />
        </Form.Item>
        <label>가격 별점</label>
        <Form.Item
          name="price_rating"
          rules={[
            {
              required: true,
              message: "별점을 입력해주세요.",
            },
          ]}
        >
          <Rate allowHalf />
        </Form.Item>
        <label>위생 별점</label>
        <Form.Item
          name="hygiene_rating"
          rules={[
            {
              required: true,
              message: "별점을 입력해주세요.",
            },
          ]}
        >
          <Rate allowHalf />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%", height: "3rem" }}>
            리뷰 작성
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ReviewPost;
