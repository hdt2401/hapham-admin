import React, { useEffect, useState } from "react";
import PostService from "../../../../services/post.ts";
import { Button, Table, Image, Tag, Popconfirm, Tooltip, Space } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
} from "@ant-design/icons";
import { useLoading } from "../../../../components/Loading";
import { useToast } from "../../../../components/Toast";
import { useTitle } from "../../../../components/Title/index.jsx";

function NewsTable({onNavigate}) {
  useTitle("News");
  const [newsList, setNewsList] = useState([]);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
  const [dataDetail, setDataDetail] = useState();

  useEffect(() => {
    newsListFetch();
  }, []);

  const newsListFetch = async () => {
    try {
      startLoading();
      const res = await PostService.getPostList();
      if (res) {
        const list = [...res.data.data].map((e) => {
          return {
            id: e._id,
            title: e.title,
            status: e.status,
          };
        });
        setNewsList(list);
      }
    } catch (error) {
    } finally {
      stopLoading();
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (src) => (
        <Tag
          color={src === "active" ? "green" : src === "inactive" ? "red" : "null"}
        >
          {src}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size={"large"}>
          <Tooltip title="Edit" trigger={["hover"]}>
            <EditTwoTone
              style={{ fontSize: "20px" }}
              onClick={() => onNavigate(record)}
            />
          </Tooltip>
          <Tooltip title="Delete" trigger={["hover"]}>
            <Popconfirm
              title={`Do you want to delete news ${record.title}?`}
              onConfirm={() => handleDeleteNews(record.id)}
              okText="Delete"
              cancelText="Cancel"
            >
              <DeleteTwoTone
                style={{ fontSize: "20px" }}
                twoToneColor="ff4d4f"
              />
            </Popconfirm>
          </Tooltip>
          {/* <Tooltip
            title={record.status === "active" ? "Inactive" : "Active"}
            trigger={["hover"]}
          >
            {record.status === "active" ? (
              <LockTwoTone
                style={{ fontSize: "20px" }}
                onClick={() => console.log(record)}
                twoToneColor="#f5222d"
              />
            ) : (
              <UnlockTwoTone
                style={{ fontSize: "20px" }}
                onClick={() => console.log(record)}
                twoToneColor="#52c41a"
              />
            )}
          </Tooltip> */}
        </Space>
      ),
    },
  ];

  const handleDeleteNews = async (id) => {
    try {
      await PostService.deleteNews(id);
      newsListFetch();
    } catch (error) {
      openToast("error", error);
    }
  };

  return (
    <div className="news-table">
      <div className="flex flex-col gap-10">
        <Table dataSource={newsList} columns={columns} />
      </div>
    </div>
  );
}

export default NewsTable;
