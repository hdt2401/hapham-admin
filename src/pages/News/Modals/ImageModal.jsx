import React, { useState } from "react";
import { Image, Modal, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { useToast } from "../../../components/Toast";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig";

const { Dragger } = Upload;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageModal = ({ isOpen, handleOpen, setImage }) => {
  const { openToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const props = {
    maxCount: 1,
    name: "image",
    listType: "picture",
    accept: "image/*",
    beforeUpload: () => {
      return false;
    },
    onChange: ({ fileList: newFile }) => {
      setFile(newFile.length == 0 ? null : newFile);
    },
    onDrop: ({ fileList: newFile }) => {
      setFile(newFile.length == 0 ? null : newFile);
    },
    onPreview: async (file) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      setPreviewImage(file.url || file.preview);
      setPreviewOpen(true);
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
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImage(downloadURL);
          handleOpen();
          openToast("success", "Thành công");
        } catch (error) {
          openToast("error", "Thất bại");
        } finally {
          setLoading(false);
        }
      }
    );
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleOpen}
      okButtonProps={{
        autoFocus: true,
        loading: loading,
        onClick: handleSubmit
      }}
      destroyOnClose
      okText="Submit"
      cancelText="Cancel"
      title="Upload image"
    >
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
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
    </Modal>
  );
};
export default ImageModal;
