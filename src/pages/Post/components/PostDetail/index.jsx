import React, { useCallback, useState } from "react";
import { Button, Input, Form } from "antd";
import { EditorContent, useEditor } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar.jsx";
import ImageModal from "../Modals/ImageModal.jsx";
import ImageResize from "tiptap-extension-resize-image";
import { useTitle } from "../../../../components/Title/index.jsx";
import "../../styles.scss";
import { MODE } from "../../../../utils/constant.js";

const extensions = [
  Underline,
  ImageResize,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  Placeholder.configure({
    placeholder: "Write something…",
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Dropcursor.configure({
    color: "#6A00F5",
    width: 2,
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];

export default function PostDetail({ postMode, title, onSubmit, detail }) {
  useTitle(postMode == MODE.create ? "Post detail" : detail.title);
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const editor = useEditor({
    extensions: extensions,
    content: postMode == MODE.create ? "" : detail.content,
  });

  const defaultValues = {
    title: postMode == MODE.create ? "" : detail.title,
    subTitle: postMode == MODE.create ? "" : detail.subTitle,
  };

  const setImage = useCallback(
    (image) => {
      if (image) {
        editor.chain().focus().setImage({ src: image }).run();
      }
    },
    [editor]
  );

  const handleOpen = () => {
    setOpen(!open);
  };

  if (!editor) {
    return null;
  }

  const handleFinish = async () => {
    try {
      await form.validateFields();
      const data = form.getFieldsValue();
      const dataToSend = {
        title: data?.title,
        subTitle: data?.subTitle,
        content: editor.getHTML(),
        image: null,
        tag: "Hot",
        status: "active",
      };
      onSubmit(dataToSend);
    } catch (error) {
      console.log(error)
    }
  };

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
        <ImageModal isOpen={open} handleOpen={handleOpen} setImage={setImage} />
        <MenuBar editor={editor} openModalImage={() => handleOpen()} />
        <EditorContent editor={editor} className="post-editor" />
      </div>
    </>
  );
}
