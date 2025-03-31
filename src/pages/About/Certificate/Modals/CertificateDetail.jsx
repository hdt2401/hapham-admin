import {
  Button,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Upload,
} from "antd";
import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../../firebase/firebaseConfig";
import dayjs from 'dayjs';
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function CertificateDetail({
  mode,
  isOpen,
  onCreate,
  onUpdate,
  dataDetail,
  handleCancel,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [file, setFile] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [checkImage, setCheckImage] = useState(false);

  useEffect(() => {
    if (mode === "UPDATE") {
      setInitialValues({ ...dataDetail, date: dayjs(dataDetail?.date) });
      setFile([
        {
          uid: dataDetail?.id,
          name: decodeURIComponent(dataDetail?.image)
            .substring(
              decodeURIComponent(dataDetail?.image).lastIndexOf("/") + 1
            )
            .split("?")[0],
          status: "done",
          url: dataDetail?.image,
        },
      ]);
    } else {
      setInitialValues({});
      setFile([]);
    }
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
      setFile(newFile.length === 0 ? null : newFile);
      setCheckImage(!checkImage);
    },
  };

  const handleApi = async (data, url) => {
    if (mode === "CREATE") {
      await onCreate({ ...data, image: url });
    } else {
      await onUpdate(dataDetail.id, { ...data, image: url });
    }
  }

  const handleSubmit = async (data) => {
    if (file?.length > 0 && file[0].originFileObj) {
      setLoading(true);
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
            await handleApi(data, downloadURL);
          } catch (error) {
          } finally {
            setLoading(false);
          }
        }
      );
    } else {
      setLoading(true);
      await handleApi(data);
      setLoading(false);
    }
  };
  
  return (
    <>
      <Modal
        title={mode === "CREATE" ? "Create Certificate" : `Update Certificate: ${dataDetail?.title}`}
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
            name="updateCertificateForm"
            initialValues={initialValues}
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
        <Form.Item label="Status" name="status">
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
            defaultValue={"active"}
          />
        </Form.Item>
        <Form.Item
          label="Image"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
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
