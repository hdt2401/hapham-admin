import React, { useState } from "react";
// import ModalDefault from '../../../components/Modal/ModalDefault';
// import { PhotoIcon } from '@heroicons/react/24/outline';
import { useForm } from "react-hook-form";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig.js";
import { Button, Form, Image, Input, Modal, Upload } from "antd";

import { InboxOutlined, UploadOutlined, PlusOutlined } from "@ant-design/icons";
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
    title: "",
    subTitle: "",
    price: "",
    description: "",
    image: null,
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const propsUpload = {
    maxCount: 1,
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
      setFile(newFile.length == 0 ? null : newFile);
      console.log(newFile);
    },
  };

  const handleSubmit = async (data) => {
    console.log(file[0].originFileObj)
    const storageRef = ref(storage, `images/${file[0].originFileObj.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file[0].originFileObj);
    setLoading(true);
    uploadTask.on(
      "state_changed",
      (error) => {
        console.error("Upload error: ", error);
      },
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
    )
  };

  return (
    <>
      <Modal
        title="Create product"
        open={isOpen}
        onCancel={handleOpenModal}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          loading: loading
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
              span: 6,
            }}
            wrapperCol={{
              span: 18,
            }}
          >
            {dom}
          </Form>
        )}
      >
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
        <Form.Item
          label="Price"
          name="price"
          rules={[
            {
              required: true,
              message: "Price is required!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: "Description is required!",
            },
          ]}
        >
          <TextArea />
        </Form.Item>
        <Form.Item label="Image" name="image">
          <Upload name="image" {...propsUpload}>
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
