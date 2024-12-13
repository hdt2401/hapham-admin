import React, { useEffect, useState } from "react";
import ProductService from "../../services/product.ts";
import CreateProduct from "./Modals/CreateProduct.jsx";
import UpdateProduct from "./Modals/UpdateProduct.jsx";
import { Button, Table, Image, Tag, Popconfirm, Tooltip, Space } from "antd";
import {
  EditTwoTone,
  DeleteTwoTone,
  LockTwoTone,
  UnlockTwoTone,
} from "@ant-design/icons";
import { useLoading } from "../../components/Loading/index.jsx";
import { useToast } from "../../components/Toast/index.jsx";

function ProductTable() {
  const [productList, setProductList] = useState([]);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const {openToast} = useToast();
  const [dataDetail, setDataDetail] = useState();
  useEffect(() => {
    productListFetch();
  }, []);

  const productListFetch = async () => {
    try {
      startLoading();
      const res = await ProductService.getProductList();
      if (res) {
        const list = [...res.data.data].map((e) => {
          return {
            id: e._id,
            title: e.title,
            subTitle: e.subTitle,
            description: e.description,
            image: e.image,
            price: e.price,
            status: e.status,
          };
        });
        setProductList(list);
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
      title: "Sub-Title",
      dataIndex: "subTitle",
      key: "subTitle",
    },

    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 240,
      render: (src) => <Image src={src} alt="image" width={200} lazyload/>,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
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
              title={`Do you want to delete product ${record.title}?`}
              onConfirm={() => handleDeleteProduct(record.id)}
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

  const handleCreateProduct = async (data) => {
    try {
      const result = await ProductService.createProduct(data);
      setOpenCreateModal(false);
      if(result) {
        openToast('success', "Thành công");
      }
      console.log(result);
      productListFetch();
    } catch (error) {
      openToast('error', error);
    }
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      const result = await ProductService.updateProduct(id, data);
      setOpenUpdateModal(false);
      if(result) {
        openToast('success', "Thành công");
      }
      productListFetch();
    } catch (error) {
      openToast('error', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await ProductService.deleteProduct(id);
      productListFetch();
    } catch (error) {
      openToast('error', error);
    }
  };

  return (
    <div className="product-table">
      <CreateProduct
        isOpen={openCreateModal}
        handleOpenModal={onOpenCreateModal}
        onCreate={handleCreateProduct}
      />
      <UpdateProduct
        isOpen={openUpdateModal}
        handleOpenModal={onOpenUpdateModal}
        onUpdate={handleUpdateProduct}
        dataDetail={dataDetail}
      />

      <Button style={{ marginBottom: "2rem" }} onClick={onOpenCreateModal}>
        Add new product
      </Button>

      <div className="flex flex-col gap-10">
        <Table dataSource={productList} columns={columns} />
      </div>
    </div>
  );
}

export default ProductTable;
