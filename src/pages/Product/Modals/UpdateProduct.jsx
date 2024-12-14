import { Button, Form, Image, Input, Modal, Select, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { storage } from "../../../firebase/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function UpdateProduct({
  isOpen,
  handleOpenModal,
  onUpdate,
  dataDetail,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [checkImage, setCheckImage] = useState(false);
  useEffect(() => {
    setFile([
      {
        uid: dataDetail?.id,
        name: decodeURIComponent(dataDetail?.image)
          .substring(decodeURIComponent(dataDetail?.image).lastIndexOf("/") + 1)
          .split("?")[0],
        status: "done",
        url: dataDetail?.image,
      },
    ]);
  }, [dataDetail, isOpen]);

  useEffect(() => {
    form.validateFields(["image"]);
  }, [checkImage, form]);

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
      setCheckImage(!checkImage);
    },
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    if (file?.length > 0 && file[0].originFileObj) {
      const storageRef = ref(storage, `images/${file[0].originFileObj.name}`);
      const uploadTask = uploadBytesResumable(
        storageRef,
        file[0].originFileObj
      );
      let downloadURL;
      uploadTask.on(
        "state_changed",
        (error) => {
          console.error("Upload error: ", error);
        },
        (snapshot) => {},
        async () => {
          try {
            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await onUpdate(dataDetail.id, { ...data, image: downloadURL });
          } catch (error) {
          } finally {
            setLoading(false);
          }
        }
      );
    } else {
      await onUpdate(dataDetail.id, data);
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        title="Update product"
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
            name="updateProductForm"
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
        <Form.Item name="status" label="Status">
          <Select
            options={[
              {
                value: "active",
                label: "Active",
              },
              {
                value: "inactive",
                label: "Inactive",
              },
            ]}
          />
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
        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList" // Synchronize fileList with form
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)} // Ensure proper file handling
          rules={[
            {
              required: true,
              message: "Please upload an image!",
            },
            () => ({
              validator(_, value) {
                if (file && file.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("You must upload an image!"));
              },
            }),
          ]}
        >
          <Upload {...propsUpload} fileList={file}>
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
