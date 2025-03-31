import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig.js";
import { Button, Form, Image, Input, Select, Upload } from "antd";
import {
  PlusOutlined,
  // InboxOutlined,
  // UploadOutlined,
} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea.js";
import { useTitle } from "../../../components/Title/index.jsx";
import { useNavigate, useParams } from "react-router";
import ProductService from "../../../services/product.ts";
import { useToast } from "../../../components/Toast/index.jsx";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function ProductDetail({ mode, onCreate }) {
  useTitle(`${mode == "CREATE" ? "Thêm mới" : "Cập nhật"} sản phẩm`);
  const navigate = useNavigate();
  const { openToast } = useToast();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const { id } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await ProductService.getProduct(id);
        if (result) {
          form.setFieldsValue({
            name: {
              vi: result.data.data.name.vi,
              en: result.data.data.name.en,
            },
            description: {
              vi: result.data.data.description.vi,
              en: result.data.data.description.en,
            },
            keyword: result.data.data.keyword,
            status: result.data.data.status,
            image: result.data.data.image,
          });
          form.validateFields(["image"]);
          setFile([
            {
              uid: result.data.data?.id,
              name: decodeURIComponent(result.data.data?.image)
                .substring(decodeURIComponent(result.data.data?.image).lastIndexOf("/") + 1)
                .split("?")[0],
              status: "done",
              url: result.data.data?.image,
            },
          ]);
        }
      } catch (error) {
        openToast("error", error);
      }
    };
    if (mode === "UPDATE") {
      fetchProduct();
    }
  }, [id]);

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

  const handleCreateProduct = async (data) => {
    try {
      const result = await ProductService.createProduct(data);
      if (result) {
        openToast("success", "Thành công");
      }
      console.log(result);
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      const result = await ProductService.updateProduct(id, data);
      if (result) {
        openToast("success", "Thành công");
      }
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleSubmit = async () => {
    const validate = await form.validateFields();
    console.log(validate)
    if (validate) {
      const data = form.getFieldsValue();
      console.log(data);
    }
      

    // const storageRef = ref(storage, `images/${file[0].originFileObj.name}`);
    // const uploadTask = uploadBytesResumable(storageRef, file[0].originFileObj);
    // setLoading(true);
    // uploadTask.on(
    //   "state_changed",
    //   (error) => {
    //     console.error("Upload error: ", error);
    //   },
    //   (snapshot) => {},
    //   async () => {
    //     // Complete function
    //     let downloadURL;
    //     try {
    //       downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    //     } catch (error) {
    //     } finally {
    //       setLoading(false);
    //       onCreate({ ...data, image: downloadURL, status: "active" });
    //     }
    //   }
    // );
  };

  return (
    <div>
      <Button style={{ marginBottom: "2rem" }} onClick={() => navigate(-1)}>
        Quay lại
      </Button>
      <Form
        form={form}
        name="ProductDetailForm"
        onFinish={handleSubmit}
        clearOnDestroy
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
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
        <Form.Item label="Tên dịch vụ (EN)" name={["name", "en"]}>
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
        >
          <TextArea />
        </Form.Item>
        <Form.Item name="status" label="Status">
          <Select
            defaultValue="active"
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
        <Form.Item label="Từ khoá" name="keyword">
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
      </Form>
      <Button onClick={handleSubmit} type="primary" loading={loading}>
        {mode == "CREATE" ? "Thêm mới" : "Cập nhật"}
      </Button>
    </div>
  );
}
