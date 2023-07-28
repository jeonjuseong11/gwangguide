import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, message, Modal } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const { confirm } = Modal;

const AddRestaurant = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("TOKEN"));

  const onFinish = async (values) => {
    try {
      const data = {
        address: values.address,
        name: values.name,
        category: values.category,
        image: values.image.file.thumbUrl,
      };

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
      confirm({
        title: "알림",
        icon: <ExclamationCircleOutlined />,
        content: "관리자만 사용가능한 기능입니다.",
        onOk: () => navigate("/"),
        onCancel: () => navigate("/"),
      });
    }
  }, []);
  const checkImageType = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("이미지 파일만 업로드 가능합니다.");
    }
    return isImage;
  };

  const checkImageSize = (file) => {
    const maxSizeMB = 5; // Maximum size in MB
    const isSizeValid = file.size / 1024 / 1024 < maxSizeMB;
    if (!isSizeValid) {
      message.error(`이미지 크기는 최대 ${maxSizeMB}MB까지 허용됩니다.`);
    }
    return isSizeValid;
  };

  const beforeUpload = (file) => {
    return checkImageType(file) && checkImageSize(file);
  };
  return (
    <Form
      style={{
        backgroundColor: "#ffffff",
        padding: "2rem",
        paddingTop: "0",
        paddingBottom: "0",
        textAlign: "left",
        borderRadius: "10px",
        width: "100vw",
      }}
      name="normal_login"
      className="login-form"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
    >
      <h3 style={{ margin: "0", paddingTop: "2vh", paddingBottom: "2vh" }}>식당 추가</h3>
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
        <Upload listType="picture-card" beforeUpload={beforeUpload}>
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
