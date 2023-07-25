import { LockOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddRestaurant = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("TOKEN");

  const onFinish = async (values) => {
    console.log(values);
    // try {
    // const response = await axios.post(
    //   "https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/admin/signup",
    //   values
    // );
    //   console.log("회원가입 성공:", response.data);
    //   navigate("/login");
    //   // Do something with the successful response, such as redirect to another page or update the state.
    // } catch (error) {
    //   console.log("회원가입 실패:", error);
    //   alert("중복된 것이 있습니다");
    //   // Handle the error, such as displaying an error message to the user.
    // }
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
      <h1>식당 추가</h1>
      <Form.Item
        name="address"
        rules={[
          {
            required: true,
            message: "주소를 입력해주세요",
          },
        ]}
      >
        <Input
          style={{ padding: "1rem" }}
          name="address"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="주소"
        />
      </Form.Item>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: "매장명을 입력해주세요.",
          },
        ]}
      >
        <Input
          style={{ padding: "1rem" }}
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="name"
          placeholder="매장명을 입력해주세요"
        />
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
      <Form.Item
        name="image"
        rules={[
          {
            required: true,
            message: "카테고리를 입력해주세요.",
          },
        ]}
      >
        <Upload action="/upload.do" listType="picture-card">
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
