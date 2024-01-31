import { Box, Card, CardContent, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { PieChart } from '@mui/x-charts/PieChart';
import ReactFusioncharts from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";

charts(FusionCharts);

export default function Analytics() {
  const [data, setData] = useState([]);
  const [selectedSheetName, setSelectedSheetName] = useState('ALL');
  const [selectedSid, setSelectedSid] = useState('ALL');
  const [selectedSsid, setSelectedSsid] = useState('ALL');
  const [summedData, setSummedData] = useState<any>({});
  const [uniqueSheetNames, setUniqueSheetNames] = useState<string[]>([]);
  const [uniqueSids, setUniqueSids] = useState<string[]>([]);
  const [uniqueSsids, setUniqueSsids] = useState<string[]>([]);
  const [startDate, setStartDate] = useState(dayjs('2024-01-01'));
  const [endDate, setEndDate] = useState(dayjs('2024-01-30'));
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/v1/analytics`);
        const jsonData: any = await response.json();
        setData(jsonData);
        setUniqueSheetNames(['ALL', ...new Set<string>(jsonData.map((item: any) => item.sheetName))]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000); // 60000 milliseconds = 1 minute

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const filteredData = data.filter((item: any) => {
      // Parse the date string from the item, ignoring the time part
      const [day, month, year] = item.date.split(' ')[0].split('/');
      const itemDate = new Date(year, month - 1, day); // Note: months are 0-indexed in JS Date

      // Check if the item's date is within the selected date range
      const isDateInRange = itemDate >= startDate.subtract(1, 'day').toDate() && itemDate <= endDate.toDate();
      // Check if other conditions for sheetName, sid, and ssid match
      const matchesSheetName = selectedSheetName === 'ALL' || item.sheetName === selectedSheetName;

      // Return true if all conditions are met
      return matchesSheetName && isDateInRange;
    });
    const sortedSids = [...new Set(filteredData.map((item: any) => item.sid))]
      .sort((a, b) => a - b); // Sort numerically
    setUniqueSids(['ALL', ...sortedSids]);
  }, [selectedSheetName, data]);

  useEffect(() => {
    const filteredData = data.filter((item: any) => {
      // Parse the date string from the item, ignoring the time part
      const [day, month, year] = item.date.split(' ')[0].split('/');
      const itemDate = new Date(year, month - 1, day); // Note: months are 0-indexed in JS Date

      // Check if the item's date is within the selected date range
      const isDateInRange = itemDate >= startDate.subtract(1, 'day').toDate() && itemDate <= endDate.toDate();

      // Check if other conditions for sheetName, sid, and ssid match
      const matchesSheetName = selectedSheetName === 'ALL' || item.sheetName === selectedSheetName;
      const matchesSid = selectedSid === 'ALL' || item.sid == selectedSid;
      // Return true if all conditions are met
      return matchesSheetName && matchesSid && isDateInRange;
    });

    const sortedSsids = [...new Set(filteredData.map((item: any) => item.ssid))]
      .sort((a, b) => a - b); // Sort numerically
    setUniqueSsids(['ALL', ...sortedSsids]);
  }, [selectedSheetName, selectedSid, data]);

  useEffect(() => {
    const filteredData = data.filter((item: any) => {
      // Parse the date string from the item, ignoring the time part
      const [day, month, year] = item.date.split(' ')[0].split('/');
      const itemDate = new Date(year, month - 1, day); // Note: months are 0-indexed in JS Date

      // Check if the item's date is within the selected date range
      const isDateInRange = itemDate >= startDate.subtract(1, 'day').toDate() && itemDate <= endDate.toDate();

      // Check if other conditions for sheetName, sid, and ssid match
      const matchesSheetName = selectedSheetName === 'ALL' || item.sheetName == selectedSheetName;
      const matchesSid = selectedSid === 'ALL' || item.sid == selectedSid;
      const matchesSsid = selectedSsid === 'ALL' || item.ssid == selectedSsid;
      if (item.sheetName == 'JAUTOCONSOM PAC') {
        console.log("here!")
        console.log(item['Pas interessé']);
        console.log(`sid: ${matchesSid} ssid: ${matchesSsid} date: ${isDateInRange}`);
        console.log(matchesSheetName && matchesSid && matchesSsid && isDateInRange);
      }
      // Return true if all conditions are met
      return matchesSheetName && matchesSid && matchesSsid && isDateInRange;
    });

    const sums = filteredData.reduce((acc: any, row: any) => {
      Object.keys(row).forEach(key => {
        if (!['sid', 'ssid', 'sheetName'].includes(key)) {
          acc[key] = (acc[key] || 0) + row[key];
        }
      });
      return acc;
    }, {});
    console.log(sums);
    setSummedData(sums);
  }, [selectedSheetName, selectedSid, selectedSsid, data, startDate, endDate]);

  const dataSource = {
    chart: {
      caption: "Percent of views",
      showvalues: "1",
      showpercentintooltip: "1",
      showPercentValues: '1',
      enablemultislicing: "1",
      theme: "fusion"
    },
    data: [
      {
        label: "NRP",
        value: summedData["NRP"] || 0,
        valuePosition: "outside",
      },
      {
        label: "A Rappeler",
        value: summedData["A Rappeler"] || 0
      },
      {
        label: "RDV",
        value: summedData["RDV"] || 0,
      },
      {
        label: "Pas interessé",
        value: summedData["Pas interessé"] || 0
      }
      ,
      {
        label: "Locataire",
        value: summedData["Locataire"] || 0
      }
      ,
      {
        label: "Pas la bonne personne",
        value: summedData["Pas la bonne personne"] || 0
      }
      ,
      {
        label: "Demande pour autre produit",
        value: summedData["Demande pour autre produit"] || 0
      }
      ,
      {
        label: "Dejà installé",
        value: summedData["Deja installé"] || 0
      }
      ,
      {
        label: "Abandon de projet",
        value: summedData["Abandon de projet"] || 0
      },
      {
        label: "Faux numéro",
        value: summedData["Faux numéro"] || 0
      }
    ]
  };
  // const dataSource = [
  //   {
  //     label: "NRP",
  //     value: summedData["NRP"] || 0,
  //     valuePosition: "outside",
  //   },
  //   {
  //     label: "A Rappeler",
  //     value: summedData["A Rappeler"] || 0
  //   },
  //   {
  //     label: "RDV",
  //     value: summedData["RDV"] || 0,
  //   },
  //   {
  //     label: "Pas interessé",
  //     value: summedData["Pas interessé"] || 0
  //   }
  //   ,
  //   {
  //     label: "Locataire",
  //     value: summedData["Locataire"] || 0
  //   }
  //   ,
  //   {
  //     label: "Pas la bonne personne",
  //     value: summedData["Pas la bonne personne"] || 0
  //   }
  //   ,
  //   {
  //     label: "Demande pour autre produit",
  //     value: summedData["Demande pour autre produit"] || 0
  //   }
  //   ,
  //   {
  //     label: "Dejà installé",
  //     value: summedData["Deja installé"] || 0
  //   }
  //   ,
  //   {
  //     label: "Abandon de projet",
  //     value: summedData["Abandon de projet"] || 0
  //   }
  // ];
  const removeLicense = () => {
    const picker = document.getElementsByClassName("MuiDateRangeCalendar-root");
    (!picker[0] || !picker[0].children[0]) ? setTimeout(removeLicense, 50) : picker[0].children[0].remove()
  }

  return (<>
    <Typography variant="h4" component="h4" my={5}>
      Analytics Dashboard
    </Typography>

    <Card>
      <CardContent>
        <DateRangePicker
          sx={{ mb: 2 }}
          onOpen={() => setTimeout(removeLicense, 50)}
          // onAccept={removeLicense}
          onChange={(value: any) => {
            setStartDate(value[0])
            setEndDate(value[1])
          }}
          value={[startDate, endDate]}
        />
        <Box component={'div'} display={'flex'} gap={2}>
          <FormControl sx={{ flexGrow: 2 }}>
            <InputLabel id="demo-simple-select-label">Sheet Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              value={selectedSheetName}
              label="sheet"
              onChange={e => setSelectedSheetName(e.target.value)}
            >
              {uniqueSheetNames.map(name => (
                <MenuItem key={name} value={name}>{name === 'ALL' ? 'ALL Sheets' : name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flexGrow: 1 }}>
            <InputLabel id="demo-simple-select-label1">SID</InputLabel>
            <Select
              labelId="demo-simple-select-label1"
              value={selectedSid}
              label="sid"
              onChange={e => setSelectedSid(e.target.value)}
            >
              {uniqueSids.map(sid => (
                <MenuItem key={sid} value={sid}>{sid === 'ALL' ? 'ALL SIDs' : sid}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flexGrow: 1 }}>
            <InputLabel id="demo-simple-select-label2">SSID</InputLabel>
            <Select
              labelId="demo-simple-select-label2"
              value={selectedSsid}
              label="ssid"
              onChange={e => setSelectedSsid(e.target.value)}
            >
              {uniqueSsids.map(ssid => (
                <MenuItem key={ssid} value={ssid}>{ssid === 'ALL' ? 'ALL SSIDs' : ssid}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </CardContent>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>RDV</TableCell>
              <TableCell>A Rappeler</TableCell>
              <TableCell>NRP</TableCell>
              <TableCell>Pas interessé</TableCell>
              <TableCell>Locataire</TableCell>
              <TableCell>Pas la bonne personne</TableCell>
              <TableCell>Demande pour autre produit</TableCell>
              <TableCell>Deja installé</TableCell>
              <TableCell>Abandon de projet</TableCell>
              <TableCell>Faux numéro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(summedData).length > 0 && (
              <TableRow>
                <TableCell component="th" scope="row">{summedData["RDV"] || 0}</TableCell>
                <TableCell>{summedData["A Rappeler"] || 0}</TableCell>
                <TableCell>{summedData["NRP"] || 0}</TableCell>
                <TableCell>{summedData["Pas interessé"] || 0}</TableCell>
                <TableCell>{summedData["Locataire"] || 0}</TableCell>
                <TableCell>{summedData["Pas la bonne personne"] || 0}</TableCell>
                <TableCell>{summedData["Demande pour autre produit"] || 0}</TableCell>
                <TableCell>{summedData["Deja installé"] || 0}</TableCell>
                <TableCell>{summedData["Abandon de projet"] || 0}</TableCell>
                <TableCell>{summedData["Faux numéro"] || 0}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Card>
        <CardContent>

          {/* <PieChart
            series={[
              {
                data: dataSource,
                highlightScope: { faded: 'global', highlighted: 'item' },
                faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
              },
            ]}
            height={500}
          /> */}
          <ReactFusioncharts
            type="pie2d"
            width={"100%"}
            height={600}
            dataFormat="JSON"
            dataSource={dataSource}
          />
        </CardContent>
      </Card>
    </Card>

  </>)
}