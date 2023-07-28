import { EllipsisOutlined } from "@ant-design/icons";
import { Modal, Rate, Input, Dropdown, Menu, Avatar, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ReviewItem = ({ id: itemId, review, averageRating, content, Admin }) => {
  const { id } = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updatedReview, setUpdatedReview] = useState(review);
  const [updatedTasteRating, setUpdatedTasteRating] = useState(averageRating);
  const [updatedServiceRating, setUpdatedServiceRating] = useState(averageRating);
  const [updatedPriceRating, setUpdatedPriceRating] = useState(averageRating);
  const [updatedHygieneRating, setUpdatedHygieneRating] = useState(averageRating);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("TOKEN"));
      if (!token) {
        message.error("로그인 후 수정할 수 있습니다.");
        return;
      }

      // Send PUT request to update the review
      await axios.put(
        `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/reviews/${itemId}`,
        {
          review: updatedReview,
          taste_rating: updatedTasteRating * 20,
          service_rating: updatedServiceRating * 20,
          price_rating: updatedPriceRating * 20,
          hygiene_rating: updatedHygieneRating * 20,
          storeId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );
      message.success("Review updated successfully!");

      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to update review.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDeleteReview = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("TOKEN"));
      if (!token) {
        message.error("로그인 후 삭제할 수 있습니다.");
        return;
      }

      // Show confirmation modal before deleting the review
      Modal.confirm({
        title: "정말로 이 리뷰를 삭제하시겠습니까?",
        okText: "확인",
        okType: "danger",
        cancelText: "취소",
        centered: true, // Add this prop to center the modal
        onOk: async () => {
          try {
            // Send DELETE request to delete the review
            await axios.delete(
              `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/reviews/${itemId}`,
              {
                headers: {
                  Authorization: `Bearer ${token.token}`,
                },
              }
            );
            message.success("리뷰 삭제 성공");
          } catch (error) {
            message.error("리뷰 삭제 실패");
          }
        },
        onCancel() {
          // Do nothing if user cancels the deletion
          console.log("취소");
        },
      });
    } catch (error) {
      message.error("리뷰 삭제 실패");
    }
  };

  const token = localStorage.getItem("TOKEN");
  return (
    <div
      className="review-item"
      style={{
        textAlign: "left",
        paddingLeft: "2rem",
        paddingRight: "2rem",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", marginBottom: "1rem" }}>
          <Avatar size={40}>{Admin.nickname[0]}</Avatar>
          <div style={{ marginLeft: "1rem" }}>
            <p style={{ fontWeight: "600", margin: "0" }}>{Admin.nickname}</p>
            <Rate allowHalf disabled value={averageRating} style={{ fontSize: "1rem" }} />
          </div>
        </div>
        <p style={{ marginLeft: "3.5rem" }}>{review}</p>
      </div>
      {token && (
        <div>
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={showModal}>수정하기</Menu.Item>
                <Menu.Item danger onClick={handleDeleteReview}>
                  삭제하기
                </Menu.Item>
              </Menu>
            }
            trigger={["hover"]}
          >
            <EllipsisOutlined />
          </Dropdown>
        </div>
      )}
      <Modal title="리뷰 수정" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input
          value={updatedReview}
          onChange={(e) => setUpdatedReview(e.target.value)}
          onPressEnter={handleOk}
        />
        <p>맛</p>
        <Rate
          allowHalf
          value={updatedTasteRating}
          onChange={(value) => setUpdatedTasteRating(value)}
        />
        <p>서비스</p>
        <Rate
          allowHalf
          value={updatedServiceRating}
          onChange={(value) => setUpdatedServiceRating(value)}
        />
        <p>가격</p>
        <Rate
          allowHalf
          value={updatedPriceRating}
          onChange={(value) => setUpdatedPriceRating(value)}
        />
        <p>위생</p>
        <Rate
          allowHalf
          value={updatedHygieneRating}
          onChange={(value) => setUpdatedHygieneRating(value)}
        />
      </Modal>
    </div>
  );
};

export default ReviewItem;
