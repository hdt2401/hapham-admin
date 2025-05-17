import {
  Button,
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
import { storage } from "../../../firebase/firebaseConfig";
import dayjs from "dayjs";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default function MissionDetail({
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
      setInitialValues({ ...dataDetail });
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
  };

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
        title={mode === "CREATE" ? "Thêm mới" : `Cập nhật ${dataDetail?.title}`}
        open={isOpen}
        onCancel={() => handleCancel(false)}
        okButtonProps={{
          autoFocus: true,
          htmlType: "submit",
          loading: loading,
        }}
        destroyOnClose
        okText={mode === "CREATE" ? "Thêm mới" : "Cập nhật"}
        cancelText="Hủy"
        modalRender={(dom) => (
          <Form
            form={form}
            name="updateMissionForm"
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
          label="Nhiệm vụ"
          name="title"
          rules={[
            {
              required: true,
              message: "Nhiệm vụ không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Nội dung"
          name="content"
          rules={[
            {
              required: true,
              message: "Nội dung không được để trống!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Select
            options={[
              {
                value: "active",
                label: "Hoạt động",
              },
              {
                value: "inactive",
                label: "Khóa",
              },
            ]}
            defaultValue={"active"}
          />
        </Form.Item>
        <Form.Item
          label="Hình ảnh"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload {...propsUpload} fileList={file}>
            <Button>
              <PlusOutlined />
              Chọn ảnh
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
