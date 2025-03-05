import React, { useEffect, useState } from "react";
import CertificateService from "../../../services/about/certificate.ts";
import CreateCertificate from "./Modals/CreateCertificate.jsx";
import UpdateCertificate from "./Modals/UpdateCertificate.jsx";
import { Button, Table, Image, Tag, Popconfirm, Tooltip, Space } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  // LockTwoTone,
  // UnlockTwoTone,
} from "@ant-design/icons";
import { useLoading } from "../../../components/Loading";
import { useToast } from "../../../components/Toast";
import { useTitle } from "../../../components/Title/index.jsx";
import MainTable from "../../../components/Table/index.jsx";

function Certificate() {
  useTitle("Certificate");
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
  const [dataDetail, setDataDetail] = useState();
  const [dataFetching, setDataFetching] = useState();
  const [tableParams, setTableParams] = useState({
    pagination: {
      page: 1,
      pageSize: 10,
    },
  });

  useEffect(() => {
    certificateListFetch(tableParams.pagination);
  }, [tableParams.pagination?.page, tableParams.pagination?.pageSize]);

  const certificateListFetch = async ({ page, pageSize }) => {
    try {
      startLoading();
      const res = await CertificateService.getCertificateList({ page, pageSize });
      const data = res.data.data;
      const list = [...data.list].map((e) => {
        return {
          id: e._id,
          title: e.title,
          date: e.date,
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
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 240,
      render: (src) => <Image src={src} alt="image" width={200} />,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  const onOpenCreateModal = () => {
    setOpenCreateModal(!openCreateModal);
  };
  const onOpenUpdateModal = async (record) => {
    console.log(record)
    if (openUpdateModal) {
      setOpenUpdateModal(!openUpdateModal);
    } else {
      setDataDetail(record);
      setOpenUpdateModal(!openUpdateModal);
    }
  };

  const handleCreateCertificate = async (data) => {
    try {
      const result = await CertificateService.createCertificate(data);
      setOpenCreateModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      console.log(result);
      certificateListFetch();
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleUpdateCertificate = async (id, data) => {
    try {
      const result = await CertificateService.updateCertificate(id, data);
      setOpenUpdateModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      certificateListFetch();
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleDeleteCertificate = async (id) => {
    try {
      await CertificateService.deleteCertificate(id);
      certificateListFetch();
    } catch (error) {
      openToast("error", error);
    }
  };

  return (
    <div className="certificate-table">
      <CreateCertificate
        isOpen={openCreateModal}
        handleOpenModal={onOpenCreateModal}
        onCreate={handleCreateCertificate}
      />
      <UpdateCertificate
        isOpen={openUpdateModal}
        handleOpenModal={onOpenUpdateModal}
        onUpdate={handleUpdateCertificate}
        dataDetail={dataDetail}
      />
      <Button style={{ marginBottom: "2rem" }} onClick={onOpenCreateModal}>
        Add new certificate
      </Button>
      <div className="flex flex-col gap-10">
        <MainTable
          columns={columns}
          data={dataFetching}
          params={tableParams}
          onEdit={onOpenUpdateModal}
          onDelete={handleDeleteCertificate}
          onTableParamsChange={setTableParams}
        />
      </div>
    </div>
  );
}

export default Certificate;
