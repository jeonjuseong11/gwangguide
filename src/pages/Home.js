import React, { useEffect, useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { List, Rate, Input } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [homeReviewList, setHomeReviewList] = useState([]);

  useEffect(() => {
    // API 요청을 보내고 데이터를 받아오는 함수
    const fetchData = async () => {
      try {
        // API 요청
        const response = await axios.get(
          `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores/?includeReviews=true`
        );
        setHomeReviewList(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    // fetchData 함수를 호출하여 API 요청 실행
    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState(""); // 검색어를 담을 상태

  const handleSearch = (value) => {
    // 검색어를 Enter 키를 눌렀을 때만 업데이트
    setFilteredData(
      homeReviewList.filter((item) => item.name.toLowerCase().includes(value.trim().toLowerCase()))
    );
  };

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
  const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터를 담을 상태

  return (
    <div>
      <div style={{ width: "100%", margin: "0 auto", height: "15rem" }}>
        <img
          style={{ width: "100%", objectFit: "fit", height: "15rem" }}
          alt="main"
          src={process.env.PUBLIC_URL + "/image/MainImage.jpeg"}
        />
        <Input
          prefix={<SearchOutlined />}
          style={{ position: "relative", top: "-10rem", width: "80%", padding: "1rem" }}
          placeholder="어떤 음식을 찾을까요?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // 입력값이 바뀌면 검색어 업데이트
          onPressEnter={(e) => handleSearch(e.target.value)} // Enter 키를 누를 때만 검색
        />
      </div>
      <div style={{ height: "27rem", overflowY: "auto" }}>
        <List
          itemLayout="vertical"
          size="small"
          style={{ textAlign: "left", height: "20rem" }}
          dataSource={filteredData} // 원본 데이터 대신 필터링된 데이터 사용
          renderItem={(item) => (
            <Link to={`/restaurant/${item.id}`}>
              <List.Item key={item.name}>
                <List.Item.Meta
                  avatar={<img width={120} alt="logo" src={item.image} />}
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
                      {/* <Rate
                        allowHalf
                        disabled
                        defaultValue={parseFloat(item.averageRating)}
                        style={{ fontSize: "1rem", top: "-10rem" }}
                      /> */}
                    </div>
                  }
                />
                {item.content}
              </List.Item>
            </Link>
          )}
        />
      </div>
    </div>
  );
}

export default Home;
