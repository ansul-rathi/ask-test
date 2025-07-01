/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import type { Questionnaire } from "@/app/types/questionaire";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionnaireService from "@/app/services/questionnaire";

const RenderBool = ({ bool }: { bool: boolean }) => (
  <div
    style={{
      color: bool ? "green" : "red",
    }}
  >
    {bool ? "Yes" : "No"}
  </div>
);

const QuestionnaireTable = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [rows, setRows] = useState<Questionnaire[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10, // Changed initial page size to 10
  });
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);
  const [rowCount, setRowCount] = useState(100); // Set a reasonable initial value to enable pagination
  const [loading, setLoading] = useState(false);
  const [pageHistory, setPageHistory] = useState<{[key: number]: {data: Questionnaire[], lastKey: string | null}}>({});

  const columns: GridColDef<Questionnaire>[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
      minWidth: 100,
      hideable: true,
      // hide: isMobile
    },
    {
      field: "receiverEmail",
      headerName: "Patient Email",
      flex: 1,
      minWidth: 200,
      // Make email wrap on mobile
      renderCell: (params) => (
        <div
          style={{
            whiteSpace: "normal",
            wordWrap: "break-word",
            lineHeight: "1.2em",
          }}
        >
          {params.value}
        </div>
      ),
    },
    {
      field: "consent",
      headerName: "Consent",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <RenderBool bool={params.value} />,
    },
    {
      field: "images",
      headerName: isMobile ? "Images" : "Requested Images",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <RenderBool bool={params.value} />,
    },
    {
      field: "submitted",
      headerName: "Submitted",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => <RenderBool bool={params.value} />,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 70,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDelete(params.row.id)}
          aria-label="delete"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this questionnaire?")) {
      try {
        console.log("confirm delete");
        const response = await QuestionnaireService.deleteQuestionnaire(id);
        console.log("delete confirm: , ", response);
        if (response.success) {
          setRows(rows.filter((row) => row.id !== id));
        } else {
          console.error("Failed to delete questionnaire");
        }
      } catch (error) {
        console.error("Error deleting questionnaire:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetch data got called", paginationModel);
      if (loading) return;
      
      // Check if we already have data for this page
      if (pageHistory[paginationModel.page] && paginationModel.page > 0) {
        console.log("Using cached data for page", paginationModel.page);
        setRows(pageHistory[paginationModel.page].data);
        setLastEvaluatedKey(pageHistory[paginationModel.page].lastKey);
        return;
      }
      
      setLoading(true);
      try {
        // For the first page or when pageSize changes, we don't use lastEvaluatedKey
        let nextKey = paginationModel.page === 0 ? null : lastEvaluatedKey;
        
        // If we're changing page size, reset pagination
        if (pageHistory[0] && pageHistory[0].data.length !== paginationModel.pageSize && paginationModel.page === 0) {
          nextKey = null;
          setPageHistory({});
        }

        const params = new URLSearchParams({
          limit: paginationModel.pageSize.toString(),
          ...(nextKey && { lastEvaluatedKey: nextKey }),
        });

        const response = await fetch(`/api/questionnaire/list?${params}`);
        const {
          items,
          lastEvaluatedKey: newKey,
          hasData,
        } = await response.json();
        
        // No need to reverse items since the API is now returning them in reverse order
        setRows(items);
        setLastEvaluatedKey(newKey);
        
        // Store this page's data and lastKey for future reference
        setPageHistory(prev => ({
          ...prev, 
          [paginationModel.page]: {
            data: items,
            lastKey: newKey
          }
        }));
        
        // Update row count to enable/disable pagination
        if (items.length === 0 || !newKey) {
          // If we've reached the end, set rowCount to exact count
          setRowCount((paginationModel.page + 1) * paginationModel.pageSize);
        } else {
          // Otherwise, ensure rowCount allows for more pagination
          setRowCount(Math.max(rowCount, (paginationModel.page + 2) * paginationModel.pageSize));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paginationModel.page, paginationModel.pageSize]);

  const handlePaginationModelChange = (newModel: GridPaginationModel) => {
    console.log("Pagination model change:", newModel);
    setPaginationModel(newModel);
  };

  // Add useEffect for handling window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ height: 600, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={isMobile ? [10] : [10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        loading={loading}
        disableRowSelectionOnClick
        disableColumnFilter
        disableColumnMenu
        sx={{
          "& .MuiDataGrid-cell": {
            padding: isMobile ? "8px 4px" : "8px 16px",
            fontSize: isMobile ? "0.875rem" : "1rem",
          },
          "& .MuiDataGrid-columnHeader": {
            padding: isMobile ? "8px 4px" : "8px 16px",
            fontSize: isMobile ? "0.875rem" : "1rem",
          },
        }}
      />

      {!loading && !lastEvaluatedKey && rows.length > 0 && (
        <div style={{ padding: "16px", textAlign: "center" }}>
          No more records to load
        </div>
      )}
    </div>
  );
};

export default QuestionnaireTable;