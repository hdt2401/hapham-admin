import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/firebaseConfig";
import { Button, DatePicker, Form, Image, Input, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function Certificate({
  isOpen,
  handleCancel,
  onCreate,
  mode,
  dataDetail
}) {
  console.log(mode, isOpen)
  // const defaultValues = {
  //   title: "",
  //   date: "",
  //   image: null,
  // };
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
        title="Create certificate"
        open={isOpen}
        onCancel={() => handleCancel(false)}
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
            initialValues={dataDetail}
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
        <Form.Item
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Date is required!",
            },
          ]}
        >
          <DatePicker />
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
