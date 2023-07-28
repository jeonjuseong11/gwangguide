import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await axios.post(
        "https://ajvxbu60qa.execute-api.ap-northeast-2.amazonaws.com/admin/signup",
        values
      );
      console.log("회원가입 성공:", response.data);
      navigate("/login");
      // Do something with the successful response, such as redirect to another page or update the state.
    } catch (error) {
      console.log("회원가입 실패:", error);
      alert("중복된 것이 있습니다");
      // Handle the error, such as displaying an error message to the user.
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <Form
      style={{
        backgroundColor: "#ffffff",
        padding: "2rem",
        marginTop: "5rem",
        marginBottom: "5rem",
        borderRadius: "10px",
        width: "25%",
        minWidth: "20rem",
      }}
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <Link to="/" style={{ textDecoration: "none", display: "inline-block" }}>
        <img
          className="phoneImage"
          src={process.env.PUBLIC_URL + "/image/gglogo.png"}
          alt="GG Logo"
          style={{ width: "2rem" }}
        />
      </Link>
      <h1>회원가입</h1>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: "아이디 또는 이메일을 입력해주세요.",
          },
        ]}
      >
        <Input
          style={{ padding: "1rem" }}
          name="email"
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="아이디 또는 이메일"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: "비밀번호를 입력해주세요.",
          },
        ]}
      >
        <Input
          style={{ padding: "1rem" }}
          prefix={<LockOutlined className="site-form-item-icon" />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item
        name="nickname"
        rules={[
          {
            required: true,
            message: "비밀번호를 입력해주세요.",
          },
        ]}
      >
        <Input style={{ padding: "1rem" }} type="nickname" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%", height: "3.5rem" }}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SignUp;
