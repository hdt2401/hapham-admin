import React, { useEffect, useState } from "react";
import MissionService from "../../services/mission.ts";
import MissionDetail from "./Modals/MissionDetail.jsx";
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
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

function Mission() {
  useTitle("Chứng chỉ");
  const [openModal, setOpenModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
  const [dataDetail, setDataDetail] = useState();
  const [dataFetching, setDataFetching] = useState();
  const [modeModal, setModeModal] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    missionListFetch(tableParams.pagination);
  }, [tableParams.pagination?.page, tableParams.pagination?.pageSize]);

  const missionListFetch = async ({ page, pageSize }) => {
    try {
      startLoading();
      const res = await MissionService.getMissionList({ page, pageSize });
      const data = res.data.data;
      const list = [...data.list].map((e) => {
        return {
          id: e._id,
          key: e._id,
          title: e.title,
          content: e.content,
          image: e.image,
          status: e.status,
        };
      });
      setDataFetching({
        list,
        total: data.totalElements,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (error) {
    } finally {
      stopLoading();
    }
  };

  const columns = [
    {
      title: "Nhiệm vụ",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 240,
      render: (src) => <Image src={src} alt="image" width={200} />,
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
    },
  ];

  const onOpenModal = (mode) => {
    if(mode) {
      setModeModal(mode);
    }
    setOpenModal(true);
  };

  const handleCreateMission = async (data) => {
    try {
      const result = await MissionService.createMission(data);
      setOpenModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      console.log(result);
      missionListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleUpdateMission = async (id, data) => {
    try {
      const result = await MissionService.updateMission(id, data);
      setOpenModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      missionListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleDeleteMission = async (id) => {
    try {
      await MissionService.deleteMission(id);
      missionListFetch(tableParams.pagination);
      if (dataFetching.list.length === 1 && tableParams.pagination.page > 0) {
        setTableParams({
          pagination: {
            page: tableParams.pagination.page - 1,
            pageSize: tableParams.pagination.pageSize,
          },
        });
      } else {
        missionListFetch(tableParams.pagination);
      }
    } catch (error) {
      openToast("error", error);
    }
  };
  const handleEdit = (data) => {
    setDataDetail(data);
    onOpenModal("UPDATE");
  }
  return (
    <div className="mission-table">
      <MissionDetail
        mode={modeModal}
        isOpen={openModal}
        dataDetail={dataDetail}
        handleCancel={setOpenModal}
        onCreate={handleCreateMission}
        onUpdate={handleUpdateMission}
      />
      <Button style={{ marginBottom: "2rem" }} onClick={() => onOpenModal("CREATE")}>
        <PlusOutlined />
        Thêm mới
      </Button>
      <div className="flex flex-col gap-10">
        <MainTable
          columns={columns}
          data={dataFetching}
          params={tableParams}
          onEdit={handleEdit}
          onDelete={handleDeleteMission}
          onTableParamsChange={setTableParams}
        />
      </div>
    </div>
  );
}

export default Mission;
