import "./styles.scss";

import React, { useCallback, useState } from "react";
import { Button } from "antd";
import { EditorContent, useEditor } from "@tiptap/react";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar";
import ImageModal from "./Modals/ImageModal";
import ImageResize from "tiptap-extension-resize-image";
import { useTitle } from "../../components/Title";
import { useLoading } from "../../components/Loading";
import { useToast } from "../../components/Toast";
import PostService from "../../services/post.ts";

const extensions = [
  Underline,
  ImageResize,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  Placeholder.configure({
    placeholder: "Write something …",
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

export default function News() {
  useTitle("News");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const editor = useEditor({
    extensions: extensions,
    content: null,
  });
  const {startLoading, stopLoading} = useLoading();
  const {openToast} = useToast();

  const setImage = useCallback((image) => {
    if (image) {
      editor.chain().focus().setImage({ src: image }).run();
    }
  }, [editor]);

  const handleOpen = () => {
    setOpen(!open);
  };

  if (!editor) {
    return null;
  }

  const handleSubmit = () => {
    console.log(editor.getHTML());
    const dataToSend = {
      title: "test title post",
      subTitle: "test sub",
      content: editor.getHTML(),
      image: null,
      tag: "Hot",
      status: "active"
    }
    startLoading();
    setLoading(true);
    try {
      const result = PostService.createPost(dataToSend);
      openToast("success", result.code);
    } catch (error) {
      openToast("error", error);
    } finally {
      stopLoading();
      setLoading(false);
    }
  };

  return (
    <>
      <div className="control-group">
        <div className="button-group">
          <Button onClick={handleSubmit} loading={loading}>Submit</Button>
        </div>
      </div>
      <ImageModal isOpen={open} handleOpen={handleOpen} setImage={setImage}/>
      <MenuBar editor={editor} openModalImage={()=> handleOpen()}/>
      <EditorContent editor={editor} />
    </>
  );
}
