import { Button, Card, CardContent, Chip, Modal, TextField, Typography } from "@mui/material";
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useMemo, useState } from "react";

interface Data {
  id: string | number; name: string | number; url: string | number; date: string | number; count: string | number; status: string | number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'date',
    numeric: false,
    disablePadding: true,
    label: 'DATE',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'SHEET NAME',
  },
  {
    id: 'url',
    numeric: false,
    disablePadding: false,
    label: 'URL',
  },
  {
    id: 'count',
    numeric: true,
    disablePadding: false,
    label: 'COUNT',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'STATUS',
  },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
  row: any;
  load: () => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, row, load } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [mode, setMode] = useState(false)
  const handleOpen = (mode: boolean) => {
    setOpen(true);
    setMode(mode);
  }

  console.log(row)
  const add = () => {
    // Using the Fetch API to send a POST request
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sheet`, {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify({ url: value }), // Convert the JavaScript object to a JSON string
    })
      .then(response => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON in the response
      })
      .then(data => {
        // Work with the data returned from the server
        console.log('Success:', data);
        load()
      })
      .catch(error => {
        // Handle errors from fetch or your error throw
        console.error('Error:', error);
      });
  }

  const edit = () => {
    // Using the Fetch API to send a POST request
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sheet/${row.id}`, {
      method: 'PUT', // Specify the method
      headers: {
        'Content-Type': 'application/json', // Specify the content type
      },
      body: JSON.stringify({ url: value }), // Convert the JavaScript object to a JSON string
    })
      .then(response => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON in the response
      })
      .then(data => {
        // Work with the data returned from the server
        console.log('Success:', data);
        load()
      })
      .catch(error => {
        // Handle errors from fetch or your error throw
        console.error('Error:', error);
      });
  }

  const del = () => {
    // Using the Fetch API to send a POST request
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sheet/${row.id}`, {
      method: 'DELETE', // Specify the method
    })
      .then(response => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parse the JSON in the response
      })
      .then(data => {
        // Work with the data returned from the server
        console.log('Success:', data);
        load()
      })
      .catch(error => {
        // Handle errors from fetch or your error throw
        console.error('Error:', error);
      });
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 }
      }}
    >
      <Box component="div" flexGrow={1} />
      {numSelected !== -1 ? (
        <>
          <Tooltip title="Edit">
            <IconButton color="primary" onClick={() => {
              setValue(row.url)
              handleOpen(true)
            }} >
              <EditIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton color="primary" onClick={del} >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <>
        <Tooltip title="Refresh">
          <IconButton color="primary" onClick={load} >
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add new sheet">
          <IconButton color="primary" onClick={() => {
            setValue('')
            handleOpen(false)
          }} >
            <AddIcon />
          </IconButton>
        </Tooltip>
        </>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <TextField id="outlined-basic" label="Google Sheet URL" variant="outlined" value={value} onChange={(e) => setValue(e.target.value)} fullWidth />
          <Button onClick={() => {
            handleClose()
            mode ? edit() : add()
          }} color="primary" variant="contained" sx={{ float: 'right', mt: 2 }}>OK</Button>
        </Paper>
      </Modal>
    </Toolbar>
  );
}

export default function GoogleSheet() {
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof Data>('date');
  const [selected, setSelected] = useState<number>(-1);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState<Data[]>([])
  // [{ "id": 3, "name": '', "url": "https://docs.google.com/spreadsheets/d/1C8vX0j0kD81SQoKCuhUAlfKgv4ou3Hk762bu8PkJ-lo/edit#gid=0", "date": "2024-01-30T05:09:39.665Z", "count": 0, "status": "No Access" }]


  const loadData = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/sheet`);
    const jsonData: any = await response.json();
    setRows(jsonData)
  }

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000); // 60000 milliseconds = 1 minute

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function formatDate(datestr: string) {
    const date = new Date(datestr)
    let datePart = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ].map((n, i) => n.toString().padStart(i === 0 ? 4 : 2, "0")).join("-");
    let timePart = [
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ].map((n, i) => n.toString().padStart(2, "0")).join(":");
    return datePart + " " + timePart;
  }
  // const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.checked) {
  //     const newSelected = rows.map((n) => n.id);
  //     setSelected(newSelected);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    // const selectedIndex = selected.indexOf(id);
    // let newSelected: readonly number[] = [];

    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, id);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
    // }
    // setSelected(newSelected);

    setSelected(selected === id ? -1 : id)
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const isSelected = (id: number) => selected.indexOf(id) !== -1;
  const isSelected = (id: number) => selected === id;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );

  return (<>
    <Typography variant="h4" component="h4" my={5}>
      Google Sheet URLs
    </Typography>
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ mb: 2, px: 2 }}>
        <EnhancedTableToolbar numSelected={selected} row={selected === -1 ? {} : rows.filter(({id}) => (selected===id))[0]} load={loadData} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {visibleRows.map((row: any, index: number) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {formatDate(row.date)}
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.url}</TableCell>
                    <TableCell align="right">{row.count}</TableCell>
                    <TableCell>{(row.status) === 'Access' ? <Chip label="Access" color="success" variant="outlined" /> : <Chip label="No Access" variant="outlined" />}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  </>)
}