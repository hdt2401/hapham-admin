import React, { useEffect, useState } from "react";
import { useTitle } from "../../components/Title";
import ProductService from "../../services/product.ts";
import { Button, Image } from "antd";
import { useLoading } from "../../components/Loading/index.jsx";
import { useToast } from "../../components/Toast/index.jsx";
import MainTable from "../../components/Table/index.jsx";
import { useNavigate } from "react-router";

export default function Product() {
  useTitle("Danh sách sản phẩm");
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();
  const { openToast } = useToast();
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
          name: e.name,
          description: e.description,
          image: e.image,
          keyword: e.keyword,
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
      title: "Tên dịch vụ",
      dataIndex: ["name", "vi"],
      key: "name",
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 240,
      render: (src) => <Image src={src} alt="image" width={200} />,
    },
    {
      title: "Từ khoá",
      dataIndex: "keyword",
      key: "keyword",
    },
  ];

  const handleDeleteProduct = async (id) => {
    try {
      await ProductService.deleteProduct(id);
      if (dataFetching.list.length === 1 && tableParams.pagination.page > 0) {
        console.log(tableParams.pagination.page - 1);
        setTableParams({
          pagination: {
            page: tableParams.pagination.page - 1,
            pageSize: tableParams.pagination.pageSize,
          },
        });
      } else {
        productListFetch(tableParams.pagination);
      }
    } catch (error) {
      openToast("error", error);
    }
  };

  return (
    <div>
      <Button
        style={{ marginBottom: "2rem" }}
        onClick={() => navigate("/product/create")}
      >
        Thêm mới dịch vụ{" "}
      </Button>

      <div className="flex flex-col gap-10">
        <MainTable
          columns={columns}
          data={dataFetching}
          params={tableParams}
          onDelete={handleDeleteProduct}
          onTableParamsChange={setTableParams}
          onEdit={(record) => navigate("/product/" + record.id)}
        />
      </div>
    </div>
  );
}
