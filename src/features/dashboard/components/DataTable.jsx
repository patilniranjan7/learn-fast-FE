import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

export function DataTable({
  columns,
  rows,
  rowKey = (row) => row.id,
  emptyMessage = 'Nothing to show yet.',
}) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 500 }}>
        <TableHead sx={{ bgcolor: 'background.default' }}>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key}
                align={column.align}
                sx={{ color: 'text.secondary', fontSize: 12, py: 2 }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={rowKey(row)} hover>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align} sx={{ py: 2.25 }}>
                  {column.render ? column.render(row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
          {!rows.length && (
            <TableRow>
              <TableCell colSpan={columns.length}>
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
                  {emptyMessage}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
