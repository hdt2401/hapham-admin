import { Form, Input, Modal, Upload } from "antd";
import React, { useEffect, useState } from "react";
// import ModalDefault from '../../../components/Modal/ModalDefault';
// import { PhotoIcon } from '@heroicons/react/24/outline';

import { InboxOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";

export default function UpdateProduct({
  isOpen,
  handleOpenModal,
  onCreate,
  dataDetail,
}) {
  const [base64String, setBase64String] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();
  
  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.file;
  };

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result);
    };
    reader.readAsDataURL(file); // Chuyển đổi tệp thành Base64
  };

  const handleChangeImage = (event) => {
    const file = event.target.files[0];
    convertToBase64(file);
  };

  const onSubmit = async (data) => {
    const dataToSend = { ...data, image: base64String };
    onCreate(dataToSend, reset);
  };

  return (
    <>
      <Modal
        title="Edit product"
        open={isOpen}
        onCancel={handleOpenModal}
        onOk={() => handleSubmit()}
      >
        <Form initialValues={dataDetail}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              {
                required: true,
                message: "Title is required!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Sub-Title" name="subTitle">
            <Input />
          </Form.Item>
          <Form.Item label="Price" name="price">
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="Image">
            <Form.Item
              name="image"
              valuePropName="file"
              getValueFromEvent={normFile}
              noStyle
            >
              <Upload.Dragger name="image" action="/upload.do">
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for a single or bulk upload.
                </p>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
