import React from "react";
import { Button, Input, Popover } from "antd";
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  FontColorsOutlined,
  ItalicOutlined,
  MenuOutlined,
  OrderedListOutlined,
  PictureOutlined,
  RedoOutlined,
  UnderlineOutlined,
  UndoOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

const buttonGroupStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px",
  backgroundColor: "#f2f2f2",
};

const MenuBar = ({ editor, openModalImage }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group" style={buttonGroupStyle}>
        <Button
          icon={<UndoOutlined />}
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        />
        <Button
          icon={<RedoOutlined />}
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        />
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          type={editor.isActive("heading", { level: 1 }) ? "primary" : ""}
        >
          H1
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          type={editor.isActive("heading", { level: 2 }) ? "primary" : ""}
        >
          H2
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          type={editor.isActive("heading", { level: 3 }) ? "primary" : ""}
        >
          H3
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          type={editor.isActive("heading", { level: 4 }) ? "primary" : ""}
        >
          H4
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          type={editor.isActive("heading", { level: 5 }) ? "primary" : ""}
        >
          H5
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          type={editor.isActive("heading", { level: 6 }) ? "primary" : ""}
        >
          H6
        </Button>
        <Button
          onClick={() => editor.chain().focus().setParagraph().run()}
          type={editor.isActive("paragraph") ? "primary" : ""}
        >
          Paragraph
        </Button>
        <Button
          icon={<BoldOutlined />}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          type={editor.isActive("bold") ? "primary" : ""}
        />
        <Button
          icon={<ItalicOutlined />}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          type={editor.isActive("italic") ? "primary" : ""}
        />
        <Button
          icon={<UnderlineOutlined />}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          type={editor.isActive("underline") ? "primary" : ""}
        />
        <Popover
          content={
            <Input
              type="color"
              onInput={(event) =>
                editor.chain().focus().setColor(event.target.value).run()
              }
              value={editor.getAttributes("textStyle").color}
              data-testid="setColor"
            />
          }
          title="Text color"
          trigger="click"
        >
          <Button icon={<FontColorsOutlined />}>
            <span
              style={{
                display: "inline-block",
                width: "12px",
                height: "12px",
                backgroundColor: `${
                  editor.getAttributes("textStyle").color
                    ? editor.getAttributes("textStyle").color
                    : "black"
                }`,
                border: "1px solid black",
              }}
            ></span>
          </Button>
        </Popover>
        <Button
          icon={<AlignLeftOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          type={editor.isActive({ textAlign: "left" }) ? "primary" : ""}
        />
        <Button
          icon={<AlignCenterOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          type={editor.isActive({ textAlign: "center" }) ? "primary" : ""}
        />
        <Button
          icon={<AlignRightOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          type={editor.isActive({ textAlign: "right" }) ? "primary" : ""}
        />
        <Button
          icon={<MenuOutlined />}
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          type={editor.isActive({ textAlign: "justify" }) ? "primary" : ""}
        />
        <Button
          icon={<UnorderedListOutlined />}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type={editor.isActive("bulletList") ? "primary" : ""}
        />
        <Button
          icon={<OrderedListOutlined />}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type={editor.isActive("orderedList") ? "primary" : ""}
        />
        <Button icon={<PictureOutlined />} onClick={openModalImage} />
      </div>
    </div>
  );
};

export default MenuBar;
