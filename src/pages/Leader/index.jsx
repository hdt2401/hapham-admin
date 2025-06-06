import React, { useEffect, useState } from "react";
import LeaderService from "../../services/leader.ts";
import CreateLeader from "./Modals/CreateLeader.jsx";
import UpdateLeader from "./Modals/UpdateLeader.jsx";
import { Button, Table, Image, Tag, Popconfirm, Tooltip, Space } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  // LockTwoTone,
  // UnlockTwoTone,
} from "@ant-design/icons";
import { useLoading } from "../../components/Loading/index.jsx";
import { useToast } from "../../components/Toast/index.jsx";
import { useTitle } from "../../components/Title/index.jsx";
import MainTable from "../../components/Table/index.jsx";

function LeaderTable() {
  useTitle("Người đứng đầu");
  const [leaderList, setLeaderList] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
  const [dataDetail, setDataDetail] = useState();

  useEffect(() => {
    leaderListFetch();
  }, []);

  const leaderListFetch = async () => {
    try {
      startLoading();
      const res = await LeaderService.getLeaderList();
      if (res) {
        const list = [...res.data.data].map((e) => {
          return {
            id: e._id,
            key: e._id,
            fullName: e.fullName,
            position: e.position,
            scholarship: e.scholarship,
            image: e.image,
            status: e.status,
          };
        });
        setLeaderList(list);
      }
    } catch (error) {
    } finally {
      stopLoading();
    }
  };

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 240,
      render: (src) => <Image src={src} alt="image" width={200} />,
    },
    {
      title: "Học vị",
      dataIndex: "scholarship",
      key: "scholarship",
    },
    {
      title: "Vị trí",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Trạng thái",
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
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size={"large"}>
          <Tooltip title="Chỉnh sửa" trigger={["hover"]}>
            <EditTwoTone
              style={{ fontSize: "20px" }}
              onClick={() => onOpenUpdateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete" trigger={["hover"]}>
            <Popconfirm
              title={`Do you want to delete leader ${record.title}?`}
              onConfirm={() => handleDeleteLeader(record.id)}
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

  const onOpenCreateModal = () => {
    setOpenCreateModal(!openCreateModal);
  };
  const onOpenUpdateModal = async (record) => {
    if (openUpdateModal) {
      setOpenUpdateModal(!openUpdateModal);
    } else {
      setDataDetail(record);
      setOpenUpdateModal(!openUpdateModal);
    }
  };

  const handleCreateLeader = async (data) => {
    try {
      const result = await LeaderService.createLeader(data);
      setOpenCreateModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      console.log(result);
      leaderListFetch();
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleUpdateLeader = async (id, data) => {
    try {
      const result = await LeaderService.updateLeader(id, data);
      setOpenUpdateModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      leaderListFetch();
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleDeleteLeader = async (id) => {
    try {
      await LeaderService.deleteLeader(id);
      leaderListFetch();
    } catch (error) {
      openToast("error", error);
    }
  };

  return (
    <div className="leader-table">
      <CreateLeader
        isOpen={openCreateModal}
        handleOpenModal={onOpenCreateModal}
        onCreate={handleCreateLeader}
      />
      <UpdateLeader
        isOpen={openUpdateModal}
        handleOpenModal={onOpenUpdateModal}
        onUpdate={handleUpdateLeader}
        dataDetail={dataDetail}
      />
      <Button style={{ marginBottom: "2rem" }} onClick={onOpenCreateModal}>
        Thêm mới
      </Button>
      <div className="flex flex-col gap-10">
        <Table dataSource={leaderList} columns={columns} />
        {/* <MainTable
          columns={columns}
          data={leaderList}
          onEdit={handleUpdateLeader}
          onDelete={handleDeleteLeader}
          // params={tableParams}
          // onTableParamsChange={setTableParams}
        /> */}
      </div>
    </div>
  );
}

export default LeaderTable;
