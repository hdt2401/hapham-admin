import React, { useEffect, useState } from "react";
import CertificateService from "../../../services/certificate.ts";
import CertificateDetail from "./Modals/CertificateDetail.jsx";
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
import dayjs from "dayjs";

function Certificate() {
  useTitle("Certificate");
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
          key: e._id,
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

  const onOpenModal = (mode) => {
    if(mode) {
      setModeModal(mode);
    }
    setOpenModal(true);
  };

  const handleCreateCertificate = async (data) => {
    try {
      const result = await CertificateService.createCertificate(data);
      setOpenModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      console.log(result);
      certificateListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleUpdateCertificate = async (id, data) => {
    try {
      const result = await CertificateService.updateCertificate(id, data);
      setOpenModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      certificateListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleDeleteCertificate = async (id) => {
    try {
      await CertificateService.deleteCertificate(id);
      certificateListFetch(tableParams.pagination);
      if (dataFetching.list.length === 1 && tableParams.pagination.page > 0) {
        setTableParams({
          pagination: {
            page: tableParams.pagination.page - 1,
            pageSize: tableParams.pagination.pageSize,
          },
        });
      } else {
        certificateListFetch(tableParams.pagination);
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
    <div className="certificate-table">
      <CertificateDetail
        mode={modeModal}
        isOpen={openModal}
        dataDetail={dataDetail}
        handleCancel={setOpenModal}
        onCreate={handleCreateCertificate}
        onUpdate={handleUpdateCertificate}
      />
      <Button style={{ marginBottom: "2rem" }} onClick={() => onOpenModal("CREATE")}>
        Add new certificate
      </Button>
      <div className="flex flex-col gap-10">
        <MainTable
          columns={columns}
          data={dataFetching}
          params={tableParams}
          onEdit={handleEdit}
          onDelete={handleDeleteCertificate}
          onTableParamsChange={setTableParams}
        />
      </div>
    </div>
  );
}

export default Certificate;
