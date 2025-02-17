import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { useLoading } from "../../components/Loading/index.jsx";
import { useToast } from "../../components/Toast/index.jsx";
import PostService from "../../services/post.ts";
import { useTitle } from "../../components/Title/index.jsx";
import "./styles.scss";
// import PostTable from "./components/PostTable/index.js";
// import PostDetail from "./components/PostDetail/index.js";
import PostTable from "./components/PostTable/index.jsx";
import PostDetail from "./components/PostDetail/index.jsx";
import { MODE } from "../../utils/constant.js";

export default function Post() {
  useTitle("Post");
  const [loading, setLoading] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
  const [mode, setMode] = useState(MODE.list);
  const [dataDetail, setDataDetail] = useState();
  const [postList, setPostList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    postListFetch(tableParams.pagination);
  }, [tableParams.pagination?.page, tableParams.pagination?.pageSize]);

  const postListFetch = async ({ page, pageSize }) => {
    try {
      startLoading();
      const res = await PostService.getPostList({ page, pageSize });
      const data = res.data.data;
      const list = [...data.posts].map((e) => {
        return {
          id: e._id,
          title: e.title,
          status: e.status,
        };
      });
      const postList = {
        list,
        total: data.totalPosts,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      }
      setPostList(postList);
    } catch (error) {
      openToast("error", error.message);
    } finally {
      stopLoading();
    }
  };

  const handleSubmit = async (data) => {
    setLoading(true);
    startLoading();
    try {
      if (mode === MODE.update) {
        await PostService.updatePost(dataDetail._id, data);
        openToast("success", "Post updated successfully");
      } else {
        await PostService.createPost(data);
        openToast("success", "Post created successfully");
      }
      setMode(MODE.list);
      postListFetch(tableParams.pagination);
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
  };

  const handleDelete = async (id) => {
    try {
      await PostService.deletePost(id);
      openToast("success", "Post deleted successfully");
      postListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error.message);
    }
  };

  return (
    <>
      {mode === MODE.list ? (
        <div className="post-table">
          <Button
            style={{ marginBottom: "2rem" }}
            onClick={() => setMode(MODE.create)}
          >
            Add new post
          </Button>
          <PostTable
            onNavigate={navigateToDetail}
            data={postList}
            onDelete={handleDelete}
            onLoadData={postListFetch}
          />
        </div>
      ) : (
        <div className="post-detail">
          <Button
            style={{ marginBottom: "2rem" }}
            onClick={() => setMode(MODE.list)}
          >
            Back
          </Button>
          <PostDetail
            postMode={mode}
            onSubmit={handleSubmit}
            detail={dataDetail}
          />
        </div>
      )}
    </>
  );
}
