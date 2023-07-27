import { LockOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("TOKEN"));

  const onFinish = async (values) => {
    console.log(values);
    try {
      const data = {
        address: values.address,
        name: values.name,
        category: values.category,
        image: values.image.file.thumbUrl, // values.image.file.thumbUrl -> values.image.fileList로 수정
      };
      console.log(data);

      // API 요청
      const response = await axios.post(
        `https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/stores`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        }
      );
      alert("식당 등록이 완료되었습니다");
      navigate(`/restaurant/${response.data.id}`, { replace: true });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (!token) {
      alert("관리자만 사용가능한 기능입니다.");
      navigate("/");
    }
  }, []);

  return (
    <Form
      style={{
        backgroundColor: "#ffffff",
        padding: "2rem",
        paddingTop: "0",
        paddingBottom: "0",
        textAlign: "left",
        borderRadius: "10px",
        minWidth: "20rem",
      }}
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <h3 style={{ margin: "0", paddingTop: ".5rem", paddingBottom: ".5rem" }}>식당 추가</h3>
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
      <Form.Item
        name="category"
        rules={[
          {
            required: true,
            message: "카테고리를 입력해주세요.",
          },
        ]}
      >
        <Input style={{ padding: "1rem" }} type="category" placeholder="카테고리를 입력해주세요." />
      </Form.Item>
      <label>매장 사진</label>
      <Form.Item
        name="image"
        rules={[
          {
            required: true,
            message: "이미지를 업로드해주세요",
          },
        ]}
      >
        <Upload listType="picture-card">
          <div>
            <PlusOutlined />
            <div
              style={{
                marginTop: 8,
              }}
            >
              Upload
            </div>
          </div>
        </Upload>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%", height: "3.5rem" }}>
          매장 등록
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddRestaurant;
