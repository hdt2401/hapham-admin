import React, { useState } from "react";
import { Button } from "antd";
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
  const [dataDetail, setDataDetail] = useState();

  const handleSubmit = async (data) => {
    setLoading(true);
    startLoading();
    try {
      if (mode === MODE.update) {
        await PostService.updatePost(dataDetail._id, data);
        openToast("success", "News updated successfully");
      } else {
        await PostService.createPost(data);
        openToast("success", "News created successfully");
      }
      setMode(MODE.list);
    } catch (error) {
      openToast("error", error.message);
    } finally {
      setLoading(false);
      stopLoading();
    }
  };

  const navigateToDetail = async (data) => {
    try {
      const result = await PostService.getPost(data.id);
      setDataDetail(result.data.data);
      setMode(MODE.update);
    } catch (error) {
      openToast("error", error.message);
    }
  }

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
          <NewsTable onNavigate={navigateToDetail}/>
        </div>
      ) : (
        <div className="news-detail">
          <Button
            style={{ marginBottom: "2rem" }}
            onClick={() => setMode(MODE.list)}
          >
            Back
          </Button>
          <NewsDetail newsMode={mode} onSubmit={handleSubmit} detail={dataDetail}/>
        </div>
      )}
    </>
  );
}
