import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Input, Spin, Modal, message, Form, Button } from "antd";
import axios from "axios";
import RestaurantList from "../components/RestaurantList";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [homeReviewList, setHomeReviewList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasToken, setHasToken] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState(null);

  useEffect(() => {
    fetchData();
    checkToken();
  }, []);

  useEffect(() => {
    calculateAverageRatings();
  }, [homeReviewList]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/?includeReviews=true"
      );
      setHomeReviewList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  const calculateAverageRatings = () => {
    const updatedData = homeReviewList.map((item) => {
      const reviews = item.Reviews;
      const totalRatings = reviews.length;
      const sumRatings = reviews.reduce(
        (acc, review) =>
          acc +
          (review.taste_rating +
            review.service_rating +
            review.price_rating +
            review.hygiene_rating),
        0
      );

      const averageRating = totalRatings === 0 ? 0 : sumRatings / (20 * 4);
      return {
        ...item,
        averageRating: averageRating.toFixed(1),
      };
    });
    setFilteredData(updatedData);
  };

  const checkToken = () => {
    const token = localStorage.getItem("TOKEN");
    setHasToken(!!token);
  };

  const handleSearch = (value) => {
    setFilteredData(
      homeReviewList.filter((item) => item.name.toLowerCase().includes(value.trim().toLowerCase()))
    );
  };

  const showDeleteConfirm = (restaurantId) => {
    Modal.confirm({
      title: "정말로 이 식당을 삭제하시겠습니까?",
      okText: "확인",
      okType: "danger",
      centered: true,
      cancelText: "취소",
      onOk() {
        handleDeleteRestaurant(restaurantId);
      },
      onCancel() {
        console.log("취소");
      },
    });
  };

  const handleDeleteRestaurant = async (restaurantId) => {
    try {
      await axios.delete(
        `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
          },
        }
      );

      setFilteredData((prevData) => prevData.filter((item) => item.id !== restaurantId));
      message.success("식당이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("식당 삭제 오류:", error);
      message.error("식당 삭제에 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handleEditRestaurant = async (values) => {
    try {
      await axios.put(
        `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/${editingRestaurant.id}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
          },
        }
      );

      setFilteredData((prevData) =>
        prevData.map((item) => (item.id === editingRestaurant.id ? { ...item, ...values } : item))
      );

      message.success("식당 정보가 성공적으로 수정되었습니다.");
      setEditingRestaurant(null);
    } catch (error) {
      console.error("식당 정보 업데이트 오류:", error);
      message.error("식당 정보 업데이트에 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <div style={{ width: "100vw", margin: "0 auto", height: "20vh" }}>
        <img
          style={{ width: "100vw", height: "20vh", objectFit: "cover" }}
          alt="main"
          src={`${process.env.PUBLIC_URL}/image/MainImage.jpeg`}
        />
        <Input
          prefix={<SearchOutlined />}
          style={{ position: "relative", top: "-7rem", width: "80%", padding: "1rem" }}
          placeholder="어떤 음식을 찾을까요?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={(e) => handleSearch(e.target.value)}
        />
      </div>
      <div style={{ height: "65vh", overflowY: "auto" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "50vh",
            }}
          >
            <Spin size="large" />
          </div>
        ) : (
          <div style={{ height: "65vh", overflowY: "auto" }}>
            <RestaurantList
              data={filteredData}
              loading={loading}
              hasToken={hasToken}
              onEdit={setEditingRestaurant}
              onDelete={showDeleteConfirm}
            />
          </div>
        )}
      </div>
      <Modal
        title="식당 정보 수정"
        visible={!!editingRestaurant}
        onCancel={() => setEditingRestaurant(null)}
        footer={null}
      >
        <Form
          name="editRestaurant"
          initialValues={{
            name: editingRestaurant?.name,
            address: editingRestaurant?.address,
            category: editingRestaurant?.category,
          }}
          onFinish={handleEditRestaurant}
        >
          <label>매장명</label>
          <Form.Item
            name="name"
            rules={[
              {
                required: true,
                message: "매장명을 입력해주세요.",
              },
            ]}
          >
            <Input style={{ padding: "1rem" }} type="name" placeholder="매장명을 입력해주세요" />
          </Form.Item>
          <label>주소</label>
          <Form.Item
            name="address"
            rules={[
              {
                required: true,
                message: "주소를 입력해주세요",
              },
            ]}
          >
            <Input style={{ padding: "1rem" }} name="address" placeholder="주소를 입력해주세요" />
          </Form.Item>
          <label>카테고리</label>
          <Form.Item
            name="category"
            rules={[
              {
                required: true,
                message: "카테고리를 입력해주세요.",
              },
            ]}
          >
            <Input
              style={{ padding: "1rem" }}
              type="category"
              placeholder="카테고리를 입력해주세요."
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: "100%", height: "3.5rem" }}>
              수정 완료
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
