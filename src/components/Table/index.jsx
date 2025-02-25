import React from "react";
import { Table, Tag, Popconfirm, Tooltip, Space } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

function MainTable({
  onEdit,
  data,
  onDelete,
  params,
  onTableParamsChange,
  columns
}) {
  const { pagination } = params;
  const columnsTable = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      width: 100,
      render: (_, __, index) =>
        (pagination.page - 1) * pagination.pageSize + index + 1,
    },
    ...columns,
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 100,
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
      align: "center",
      width: 100,
      render: (_, record) => (
        <Space size={"large"}>
          <Tooltip title="Edit" trigger={["hover"]}>
            <EditTwoTone
              style={{ fontSize: "20px" }}
              onClick={() => onEdit(record)}
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
          dataSource={data?.list}
          columns={columnsTable}
          loading={data ? false : true}
          pagination={{
            defaultCurrent: pagination?.page,
            showQuickJumper: true,
            showSizeChanger: true,
            onChange: (page, pageSize) => {
              onTableParamsChange({
                pagination: {
                  page: page,
                  pageSize: pageSize,
                },
              });
            },
            onShowSizeChange: (current, size) => {
              onTableParamsChange({
                pagination: {
                  page: current,
                  pageSize: size,
                },
              });
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

export default MainTable;
