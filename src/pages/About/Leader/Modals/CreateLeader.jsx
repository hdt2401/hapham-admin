import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/firebaseConfig";
import { Button, Form, Image, Input, Modal, Upload } from "antd";
import {
  PlusOutlined, 
  // InboxOutlined,
  // UploadOutlined
} from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function CreateCertificate({
  isOpen,
  handleOpenModal,
  onCreate,
}) {
  const defaultValues = {
    fullname: "",
    position: "",
    scholarship: "",
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
        title="Thêm mới"
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
            name="createCertificateForm"
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
          label="Fullname"
          name="fullName"
          rules={[
            {
              required: true,
              message: "Title is required!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Position" name="position">
          <Input />
        </Form.Item>
        <Form.Item label="Scholarship" name="scholarship">
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
