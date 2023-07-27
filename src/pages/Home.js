import React, { useEffect, useState } from "react";
import { SearchOutlined, EllipsisOutlined } from "@ant-design/icons";
import { List, Input, Avatar, Dropdown, Menu, Modal, message, Spin } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { confirm } = Modal;

function Home() {
  const [loading, setLoading] = useState(true);
  const [homeReviewList, setHomeReviewList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasToken, setHasToken] = useState(false);

  const DropdownMenu = ({ item }) => (
    <Menu>
      <Menu.Item>
        <Link to={`/edit/${item.id}`}>수정하기</Link>
      </Menu.Item>
      <Menu.Item danger onClick={() => showDeleteConfirm(item.id)}>
        삭제하기
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    // API 요청을 보내고 데이터를 받아오는 함수
    const fetchData = async () => {
      try {
        // API 요청
        const response = await axios.get(
          `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/?includeReviews=true`
        );
        setHomeReviewList(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    // fetchData 함수를 호출하여 API 요청 실행
    fetchData();
  }, []);

  useEffect(() => {
    // Calculate and set the average rating for each item in the list
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

        const averageRating = totalRatings === 0 ? 0 : sumRatings / (20 * 4); // 20으로 나누어서 5점 만점으로 변환
        return {
          ...item,
          averageRating: averageRating.toFixed(1), // 소수점 첫째 자리까지 반올림
        };
      });
      setFilteredData(updatedData);
    };

    calculateAverageRatings();
  }, [homeReviewList]);

  const handleSearch = (value) => {
    // 검색어를 Enter 키를 눌렀을 때만 업데이트
    setFilteredData(
      homeReviewList.filter((item) => item.name.toLowerCase().includes(value.trim().toLowerCase()))
    );
  };

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

  const showDeleteConfirm = (restaurantId) => {
    confirm({
      title: "정말로 이 식당을 삭제하시겠습니까?",
      okText: "확인",
      okType: "danger",
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
      // 식당 삭제를 위한 API 요청
      await axios.delete(
        `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/${restaurantId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("TOKEN")}`,
          },
        }
      );

      // 삭제가 성공한 후에 식당을 목록에서 제거합니다.
      setFilteredData((prevData) => prevData.filter((item) => item.id !== restaurantId));
      message.success("식당이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("식당 삭제 오류:", error);
      message.error("식당 삭제에 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    // localStorage에 토큰이 있는지 확인합니다.
    const token = localStorage.getItem("TOKEN");
    setHasToken(!!token);
  }, []);

  return (
    <div>
      <div style={{ width: "100%", margin: "0 auto", height: "10rem" }}>
        <img
          style={{ width: "100%", objectFit: "fit", height: "10rem" }}
          alt="main"
          src={process.env.PUBLIC_URL + "/image/MainImage.jpeg"}
        />
        <Input
          prefix={<SearchOutlined />}
          style={{ position: "relative", top: "-7rem", width: "80%", padding: "1rem" }}
          placeholder="어떤 음식을 찾을까요?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 입력값이 바뀌면 검색어 업데이트
          onPressEnter={(e) => handleSearch(e.target.value)} // Enter 키를 누를 때만 검색
        />
      </div>
      <div style={{ height: "23rem", overflowY: "auto" }}>
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
            style={{ textAlign: "left", height: "20rem", position: "relative" }}
            dataSource={filteredData}
            renderItem={(item) => (
              <List.Item key={item.name}>
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
                  <div style={{ position: "relative", left: "21rem", top: "-10rem" }}>
                    <Dropdown overlay={<DropdownMenu item={item} />} trigger={["hover"]}>
                      <EllipsisOutlined />
                    </Dropdown>
                  </div>
                )}
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
