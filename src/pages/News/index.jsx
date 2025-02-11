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
import ImageResize from "tiptap-extension-resize-image";
import { useLoading } from "../../components/Loading";
import { useToast } from "../../components/Toast";
import PostService from "../../services/post.ts";
import { useTitle } from "../../components/Title/index.jsx";
import "./styles.scss";
import NewsTable from "./components/NewsTable/index.jsx";
import NewsDetail from "./components/NewsDetail/index.jsx";

export const MODE = {
  list: "LIST",
  create: "CREATE",
  update: "UPDATE",
};

export default function News() {
  useTitle("News");
  const [loading, setLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
  const [mode, setMode] = useState(MODE.list);

  const handleSubmit = async (data) => {
    console.log(data)
    setLoading(true);
    startLoading();
    try {
      await PostService.createPost(data);
      openToast("success", "News created successfully");
      setMode(MODE.list);
    } catch (error) {
      openToast("error", error.message);
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  return (
    <>
      {mode === MODE.list ? (
        <div className="news-table">
          <Button
            style={{ marginBottom: "2rem" }}
            onClick={() => setMode(MODE.create)}
          >
            Add new news
          </Button>
          <NewsTable />
        </div>
      ) : (
        <div className="news-detail">
          <Button
            style={{ marginBottom: "2rem" }}
            onClick={() => setMode(MODE.list)}
          >
            Back
          </Button>
          <NewsDetail newsMode={mode} onSubmit={handleSubmit}/>
        </div>
      )}
    </>
  );
}
