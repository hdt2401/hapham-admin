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

export default function ProductDetail({ mode }) {
  useTitle(`${mode == "CREATE" ? "Thêm mới" : "Cập nhật"} sản phẩm`);
  const navigate = useNavigate();
  const { openToast } = useToast();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const defaultValue = {
    name: {
      vi: "",
      en: "",
    },
    description: {
      vi: "",
      en: "",
    },
    keyword: "",
    status: "active",
    image: "",
  };

  const { id } = useParams();

  useEffect(() => {
    if (mode === "UPDATE") {
      fetchProduct();
    }
  }, []);

  const fetchProduct = async () => {
    try {
      const result = await ProductService.getProduct(id);
      const data = result.data.data;
      if (result) {
        form.setFieldsValue({
          name: {
            vi: data.name.vi,
            en: data.name.en,
          },
          description: {
            vi: data.description.vi,
            en: data.description.en,
          },
          keyword: data.keyword,
          status: data.status,
          image: data.image,
        });
        setFile([
          {
            uid: data.id,
            name: decodeURIComponent(data.image)
              .substring(decodeURIComponent(data.image).lastIndexOf("/") + 1)
              .split("?")[0],
            status: "done",
            url: data.image,
          },
        ]);
        setPreviewImage(data.image);
      }
    } catch (error) {
      openToast("error", error);
    }
  };

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

  const resetForm = () => {
    form.resetFields();
    setFile([]);
    setPreviewImage("");
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
    try {
      await form.validateFields();
      setLoading(true);
      const formValues = form.getFieldsValue();

      if (file.length > 0 && file[0].originFileObj) {
        const storageRef = ref(storage, `images/${file[0].originFileObj.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file[0].originFileObj);

        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            openToast("error", error.message);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const payload = { ...formValues, image: downloadURL };

              if (mode === "UPDATE") {
                await handleUpdateProduct(id, payload);
              } else {
                await handleCreateProduct(payload);
                resetForm();
              }
            } catch (error) {
              openToast("error", error.message);
            } finally {
              setLoading(false);
            }
          }
        );
      } else {
        try {
          if (mode === "UPDATE") {
            await handleUpdateProduct(id, formValues);
          } else {
            await handleCreateProduct(formValues);
            resetForm();
          }
        } catch (error) {
          openToast("error", error.message);
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      openToast("error", error.message);
    } finally {
      setLoading(false);
    }
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
        initialValues={mode === "CREATE" ? defaultValue : form.getFieldsValue()}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 20,
        }}
      >
        <Form.Item
          label="Tên (VI)"
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
        <Form.Item label="Tên (EN)" name={["name", "en"]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="Mô tả (VI)"
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
        <Form.Item label="Mô tả (EN)" name={["description", "en"]}>
          <TextArea />
        </Form.Item>
        <Form.Item label="Status" name="status">
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
        <Form.Item
          label="Image"
          name="image"
          rules={[
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
          <Upload
            maxCount={1}
            listType="picture"
            accept="image/*"
            fileList={file}
            onPreview={propsUpload.onPreview}
            onChange={propsUpload.onChange}
            beforeUpload={propsUpload.beforeUpload}
          >
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
      <Button onClick={handleSubmit} type="primary">
        {mode == "CREATE" ? "Thêm mới" : "Cập nhật"}
      </Button>
    </div>
  );
}
