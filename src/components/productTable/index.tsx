import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import CustomButton from "../atoms/customButton";
import { InputField } from "../atoms/customTextField";
import ReviewsModal from "../reviewModal";
import CustomHeader from "./customHeader";

interface Product {
  id: number;
  title: string;
  price: number;
}

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const response: AxiosResponse = await apiClient.get("users/products");

        const productsData = response.data.products.map(
          (product: Product, index: number) => ({
            ...product,
            id: index + 1,
          })
        );
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onClose = () => {
    setSelectedProductId(null);
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "name",
      headerName: "Title",
      flex: 2,
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 1.2,
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "price",
      headerName: "Price",
      flex: 0.7,
      headerAlign: "center",
      align: "right",
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "discountPercentage",
      headerName: "Discount (%)",
      flex: 1,
      align: "right",
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "availabilityStatus",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: CustomHeader,
      sortable: false,
      renderCell: (params) => {
        const color = params.value === "In Stock" ? "green" : "red";
        return <span style={{ color: color }}>{params.value}</span>;
      },
    },
    {
      field: "review",
      headerName: "Review",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: CustomHeader,
      sortable: false,
      renderCell: (params) => (
        <CustomButton
          sx={{ height: "30px", fontSize: "10px" }}
          onClick={() => setSelectedProductId(params.row.id)}
        >
          View
        </CustomButton>
      ),
    },
  ];

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((item: { name: string }) =>
          item.name.toLowerCase().includes(searchValue)
        )
      );
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Card sx={{ marginTop: 1 }}>
        <CardHeader
          title="PRODUCTS LIST"
          action={
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <InputField
                handleChange={handleSearch}
                fullWidth={true}
                placeholder="Search..."
                isErrorRequired={false}
                required={false}
                rootSx={{ mb: 0 }}
              />
            </Box>
          }
          titleTypographyProps={{
            variant: "h6",
          }}
          sx={{
            backgroundColor: "#e2e6e7",
            borderBottom: "1px solid #ddd",
            padding: "8px 16px",
            display: "flex",
            alignItems: "center",
          }}
        />
        <CardContent
          sx={{
            padding: "0px",
            "&.MuiCardContent-root:last-child": {
              paddingBottom: "0px !important",
            },
          }}
        >
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pagination
            autoHeight
            pageSizeOptions={[10]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableColumnMenu
            rowHeight={40}
            sx={{
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-cell": {
                borderRight: "1px solid #ccc",
              },
              "& .MuiDataGrid-columnHeader": {
                backgroundColor: "#f5f5f5 !important",
                borderBottom: "1px solid #ddd",
                borderRight: "1px solid #ccc",
                height: "35px !important",
              },
              "& .MuiTypography-root": {
                fontSize: "14px",
              },
              "& .MuiDataGrid-footerContainer": {
                minHeight: "30px",
                maxHeight: "30px",
              },
              "& .MuiTablePagination-toolbar": {
                minHeight: "40px",
                maxHeight: "40px",
                padding: "0px",
              },
              overflowX: "hidden",
            }}
          />
        </CardContent>

        {selectedProductId !== null && (
          <ReviewsModal
            productId={selectedProductId}
            open={true}
            onClose={onClose}
          />
        )}
      </Card>
    </>
  );
};

export default ProductsTable;
