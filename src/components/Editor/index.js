import React, { useCallback, useState } from "react";
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
import ImageModal from "./Modals/ImageModal.jsx";
import ImageResize from "tiptap-extension-resize-image";
import "./styles.scss";

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

export default function Editor({ content, onChangeContent }) {
  const [open, setOpen] = useState(false);
  const editor = useEditor({
    extensions: extensions,
    content: content,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      onChangeContent(newContent);
    },
  });

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

  return (
    <>
      <ImageModal isOpen={open} handleOpen={handleOpen} setImage={setImage} />
      <MenuBar editor={editor} openModalImage={() => handleOpen()} />
      <EditorContent editor={editor} className="main-editor" />
    </>
  );
}
