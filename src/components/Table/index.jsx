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
      title: "STT",
      dataIndex: "index",
      key: "index",
      width: 100,
      render: (_, __, index) =>
        (pagination.page - 1) * pagination.pageSize + index + 1,
    },
    ...columns,
    {
      title: "Trạng thái",
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
      title: "Hành động",
      key: "action",
      align: "center",
      width: 200,
      render: (_, record) => (
        <Space size={"large"}>
          <Tooltip title="Chỉnh sửa" trigger={["hover"]}>
            <EditTwoTone
              style={{ fontSize: "20px" }}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa" trigger={["hover"]}>
            <Popconfirm
              title={`Bạn có muốn xóa ${record.title}?`}
              onConfirm={() => onDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
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
            total: data?.total,
            showTotal: (result) => `Tổng số ${result}`,
            locale: {
              items_per_page: "/ trang",
            },
            showSizeChanger: true,
            defaultCurrent: pagination?.page,
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
