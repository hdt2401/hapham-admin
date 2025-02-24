import React from "react";
import { Table, Tag, Popconfirm, Tooltip, Space } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { useTitle } from "../../../../components/Title/index.jsx";

function TTable({ onNavigate, data, onDelete, onLoadData }) {
  useTitle("Post");

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
          color={
            src === "active" ? "green" : src === "inactive" ? "red" : "null"
          }
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
              title={`Do you want to delete post ${record.title}?`}
              onConfirm={() => onDelete(record.id)}
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

  return (
    <div className="post-table">
      <div className="flex flex-col gap-10">
        <Table
          dataSource={data.list}
          columns={columns}
          loading={data ? false : true}
          pagination={{
            defaultCurrent: 1,
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: async (page, pageSize) => {
              await onLoadData({ page, pageSize });
            },
            onShowSizeChange: async (current, size) => {
              await onLoadData({ current, size });
            },
            total: data?.total,
            showTotal: (result) => `Total ${result} items`,
          }}
          scroll={{
            x: "max-content",
            y: "calc(100vh - 320px)",
          }}
        />
      </div>
    </div>
  );
}

export default TTable;
