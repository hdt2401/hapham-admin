import React, { useState } from "react";
import { Button, Input, Form } from "antd";
import { useTitle } from "../../../components/Title/index.jsx";
import { MODE } from "../../../utils/constant.js";
import Editor from "../../../components/Editor/index.js";

export default function PostDetail({ postMode, onSubmit, detail }) {
  useTitle(postMode == MODE.create ? "Post detail" : detail.title);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [newContent, setNewContent] = useState("");

  const defaultValues = {
    title: postMode == MODE.create ? "" : detail.title,
    subTitle: postMode == MODE.create ? "" : detail.subTitle,
  };

  const handleFinish = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      const data = form.getFieldsValue();
      const dataToSend = {
        title: data?.title,
        subTitle: data?.subTitle,
        content: newContent,
        image: null,
        tag: "Hot",
        status: "active",
      };
      onSubmit(dataToSend);
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const handleChangeContent = (content) => {
    setNewContent(content);
  }

  return (
    <>
      <div className="create-post">
        <Button onClick={handleFinish} loading={loading}>
          {postMode == MODE.create ? "Thêm mới" : "Cập nhật"}
        </Button>
        <Form
          form={form}
          name="form"
          initialValues={defaultValues}
          onFinish={handleFinish}
          labelCol={{
            span: 2,
          }}
          wrapperCol={{
            span: 22,
          }}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              {
                required: true,
                message: "Tiêu đề không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Tiêu đề phụ"
            name="subTitle"
            rules={[
              {
                required: true,
                message: "Tiêu đề phụ không được để trống!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
        <Editor content={postMode == MODE.create ? "" : detail.content} onChangeContent={handleChangeContent}/>
      </div>
    </>
  );
}
