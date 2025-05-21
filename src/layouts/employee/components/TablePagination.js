import React from "react";
import { Box, IconButton, Typography, Tooltip } from "@mui/material";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";

const TablePagination = ({ page, rowsPerPage, count, onPageChange }) => {
    console.log("count", count, page, rowsPerPage);
  const totalPages = Math.ceil(count / rowsPerPage);

  const handlePrevious = () => {
    if (page > 0) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) onPageChange(page + 1);
  };

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      mt={2}
      px={2}
    >
      <Typography variant="body2" sx={{ mr: 2 }}>
        Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong>
      </Typography>

      <Tooltip title="Previous Page">
        <span>
          <IconButton
            onClick={handlePrevious}
            disabled={page === 0}
            size="small"
            aria-label="previous page"
          >
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Tooltip title="Next Page">
        <span>
          <IconButton
            onClick={handleNext}
            disabled={page >= totalPages - 1}
            size="small"
            aria-label="next page"
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </Box>
  );
};

export default TablePagination;
