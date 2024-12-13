import React, { useEffect, useState } from "react";
import CertificateService from "../../../services/about/certificate.ts";
import CreateCertificate from "./Modals/CreateCertificate.jsx";
import UpdateCertificate from "./Modals/UpdateCertificate.jsx";
import { Button, Table, Image, Tag, Popconfirm, Tooltip, Space } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  LockTwoTone,
  UnlockTwoTone,
} from "@ant-design/icons";
import { useLoading } from "../../../components/Loading";
import { useToast } from "../../../components/Toast";

function CertificateTable() {
  const [certificateList, setCertificateList] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
  const [dataDetail, setDataDetail] = useState();

  useEffect(() => {
    certificateListFetch();
  }, []);

  const certificateListFetch = async () => {
    try {
      startLoading();
      const res = await CertificateService.getCertificateList();
      if (res) {
        const list = [...res.data.data].map((e) => {
          return {
            id: e._id,
            title: e.title,
            date: e.date,
            image: e.image,
            status: e.status,
          };
        });
        setCertificateList(list);
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
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (src) => (
        <Tag
          color={src == "active" ? "green" : src == "inactive" ? "red" : "null"}
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
              onClick={() => onOpenUpdateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete" trigger={["hover"]}>
            <Popconfirm
              title={`Do you want to delete certificate ${record.title}?`}
              onConfirm={() => handleDeleteCertificate(record.id)}
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
            title={record.status == "active" ? "Inactive" : "Active"}
            trigger={["hover"]}
          >
            {record.status == "active" ? (
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
        <Table dataSource={certificateList} columns={columns} />
      </div>
    </div>
  );
}

export default CertificateTable;
