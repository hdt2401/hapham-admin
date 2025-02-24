import React, { useEffect, useState } from "react";
import { useTitle } from "../../components/Title";
import ProductService from "../../services/product.ts";
import CreateProduct from "./Modals/CreateProduct.jsx";
import UpdateProduct from "./Modals/UpdateProduct.jsx";
import { Button, Image } from "antd";
import { useLoading } from "../../components/Loading/index.jsx";
import { useToast } from "../../components/Toast/index.jsx";
import MainTable from "../../components/Table/index.jsx";

export default function Product() {
  useTitle("Product");
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

  const productListFetch = async ({ page, pageSize }) => {
    try {
      startLoading();
      const res = await ProductService.getProductList({ page, pageSize });
      const data = res.data.data;
      const list = [...data.products].map((e) => {
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
      setDataFetching({
        list: list,
        total: data.totalProducts,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });
    } catch (error) {
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    productListFetch(tableParams.pagination);
  }, [tableParams.pagination?.page, tableParams.pagination?.pageSize]);

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
      render: (src) => <Image src={src} alt="image" width={200} />,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    }
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
      if (result) {
        openToast("success", "Thành công");
      }
      console.log(result);
      productListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleUpdateProduct = async (id, data) => {
    try {
      const result = await ProductService.updateProduct(id, data);
      setOpenUpdateModal(false);
      if (result) {
        openToast("success", "Thành công");
      }
      productListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await ProductService.deleteProduct(id);
      productListFetch(tableParams.pagination);
    } catch (error) {
      openToast("error", error);
    }
  };

  return (
    <div>
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
        <MainTable
          columns={columns}
          data={dataFetching}
          params={tableParams}
          onEdit={onOpenUpdateModal}
          onDelete={handleDeleteProduct}
          onTableParamsChange={setTableParams}
        />
      </div>
    </div>
  );
}
