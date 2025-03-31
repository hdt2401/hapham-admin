import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig.js";
import { Button, Form, Image, Input, Modal, Upload } from "antd";

import {
  PlusOutlined,
  // InboxOutlined,
  // UploadOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea.js";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function CreateProduct({ isOpen, handleOpenModal, onCreate }) {
  const defaultValues = {
    name: {
      vi: "",
      en: ""
    },
    description: {
      vi: "",
      en: ""
    },
    keyword: "",
    image: null,
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const propsUpload = {
    maxCount: 1,
    name: "image",
    listType: "picture",
    accept: "image/*",
    beforeUpload: () => {
      return false;
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
    },
    onChange: ({ fileList: newFile }) => {
      setFile(newFile.length === 0 ? null : newFile);
    },
  };

  const handleSubmit = async (data) => {
    console.log(data)
    const storageRef = ref(storage, `images/${file[0].originFileObj.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0].originFileObj);
    setLoading(true);
    uploadTask.on(
      "state_changed",
      (error) => {
        console.error("Upload error: ", error);
      },
      (snapshot) => {},
      async () => {
        // Complete function
        let downloadURL;
        try {
          downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        } catch (error) {
        } finally {
          setLoading(false);
          onCreate({ ...data, image: downloadURL, status: "active" });
        }
      }
    );
  };

  return (
    <>
      <Modal
        title="Thêm mới dịch vụ"
        open={isOpen}
        onCancel={handleOpenModal}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          loading: loading,
        }}
        destroyOnClose
        okText="Submit"
        cancelText="Cancel"
        modalRender={(dom) => (
          <Form
            form={form}
            name="createProductForm"
            initialValues={defaultValues}
            onFinish={handleSubmit}
            clearOnDestroy
            labelCol={{
              span: 8,
            }}
            wrapperCol={{
              span: 16,
            }}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          label="Tên dịch vụ (VI)"
          name={["name", "vi"]}
          rules={[
            {
              required: true,
              message: "Nhập tên dịch vụ!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Tên dịch vụ (EN)"
          name={["name", "en"]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả dịch vụ (VI)"
          name={["description", "vi"]}
          rules={[
            {
              required: true,
              message: "Nhập mô tả dịch vụ!",
            },
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Mô tả dịch vụ (EN)"
          name={["description", "en"]}
          rules={[
            {
              required: true,
              message: "Description is required!",
            },
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item
          label="Từ khoá"
          name="keyword"
        >
          <Input />
        </Form.Item>
        <Form.Item label="Image" name="image">
          <Upload {...propsUpload}>
            <Button>
              <PlusOutlined />
              Upload
            </Button>
          </Upload>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </Form.Item>
      </Modal>
    </>
  );
}
