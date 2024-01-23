import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FusionCharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

charts(FusionCharts);


const Styles = styled.div`
padding: 1rem;

table {
width: 100%;
border-spacing: 0;
border: 1px solid gray;

tr {
:last-child {
td {
border-bottom: 0;
}
}
}

th,
td {
padding: 0.5rem;
border-bottom: 1px solid gray;
border-right: 1px solid gray;

:last-child {
border-right: 0;
}
}

th {
background: #2c3e50;
color: white;
font-weight: bold;
}
}

.filters {
    padding-bottom: 10px;
margin-bottom: 1rem;

select {
margin-right: 0.5rem;
padding: 0.5rem;
border-radius: 0.25rem;
border: 1px solid #ccc;
}
}

// Custom styles for the DatePicker
.datepicker {
  font-family: 'Fashion Font', sans-serif; // Use your desired font
  padding: 8px;
  border-radius: 4px;
  min-width: 150px;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #9ecaed;
  }
}

.react-datepicker-wrapper {
  display: inline-block;
  margin-left: 10px;
}

.react-datepicker__input-container {
  input {
    width: 150px;
    cursor: pointer;
  }
}
`;
// Styled DatePicker component
const StyledDatePicker = styled(DatePicker)`
  &.datepicker {
    // Custom styles for the input field
  }
`;

const AnalyticsTable = () => {
    const [data, setData] = useState([]);
    const [selectedSheetName, setSelectedSheetName] = useState('ALL');
    const [selectedSid, setSelectedSid] = useState('ALL');
    const [selectedSsid, setSelectedSsid] = useState('ALL');
    const [summedData, setSummedData] = useState({});
    const [uniqueSheetNames, setUniqueSheetNames] = useState([]);
    const [uniqueSids, setUniqueSids] = useState([]);
    const [uniqueSsids, setUniqueSsids] = useState([]);
    const [startDate, setStartDate] = useState(new Date('2024-01-01'));
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://95.164.44.248:3909/analytics-data');
                const jsonData = await response.json();
                setData(jsonData);
                setUniqueSheetNames(['ALL', ...new Set(jsonData.map(item => item.sheetName))]);
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
        const filteredData = data.filter(item => {
            // Parse the date string from the item, ignoring the time part
            const [day, month, year] = item.date.split(' ')[0].split('/');
            const itemDate = new Date(year, month - 1, day); // Note: months are 0-indexed in JS Date

            // Check if the item's date is within the selected date range
            const isDateInRange = itemDate >= startDate && itemDate <= endDate;
            // Check if other conditions for sheetName, sid, and ssid match
            const matchesSheetName = selectedSheetName === 'ALL' || item.sheetName === selectedSheetName;
            
            // Return true if all conditions are met
            return matchesSheetName && isDateInRange;
        });
        console.log(filteredData);
        const sortedSids = [...new Set(filteredData.map(item => item.sid))]
            .sort((a, b) => a - b); // Sort numerically
        setUniqueSids(['ALL', ...sortedSids]);
    }, [selectedSheetName, data]);

    useEffect(() => {
        const filteredData = data.filter(item => {
            // Parse the date string from the item, ignoring the time part
            const [day, month, year] = item.date.split(' ')[0].split('/');
            const itemDate = new Date(year, month - 1, day); // Note: months are 0-indexed in JS Date

            // Check if the item's date is within the selected date range
            const isDateInRange = itemDate >= startDate && itemDate <= endDate;

            // Check if other conditions for sheetName, sid, and ssid match
            const matchesSheetName = selectedSheetName === 'ALL' || item.sheetName === selectedSheetName;
            const matchesSid = selectedSid === 'ALL' || item.sid == selectedSid;
            // Return true if all conditions are met
            return matchesSheetName && matchesSid && isDateInRange;
        });

        const sortedSsids = [...new Set(filteredData.map(item => item.ssid))]
            .sort((a, b) => a - b); // Sort numerically
        setUniqueSsids(['ALL', ...sortedSsids]);
    }, [selectedSheetName, selectedSid, data]);

    useEffect(() => {
        const filteredData = data.filter(item => {
            // Parse the date string from the item, ignoring the time part
            const [day, month, year] = item.date.split(' ')[0].split('/');
            const itemDate = new Date(year, month - 1, day); // Note: months are 0-indexed in JS Date

            // Check if the item's date is within the selected date range
            const isDateInRange = itemDate >= startDate && itemDate <= endDate;

            // Check if other conditions for sheetName, sid, and ssid match
            const matchesSheetName = selectedSheetName === 'ALL' || item.sheetName === selectedSheetName;
            const matchesSid = selectedSid === 'ALL' || item.sid == selectedSid;
            const matchesSsid = selectedSsid === 'ALL' || item.ssid == selectedSsid;

            // Return true if all conditions are met
            return matchesSheetName && matchesSid && matchesSsid && isDateInRange;
        });

        const sums = filteredData.reduce((acc, row) => {
            Object.keys(row).forEach(key => {
                if (!['sid', 'ssid', 'sheetName'].includes(key)) {
                    acc[key] = (acc[key] || 0) + row[key];
                }
            });
            return acc;
        }, {});

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
                label: "Pas intéressé",
                value: summedData["Pas intéressé"] || 0
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
                label: "Déjà installé",
                value: summedData["Déjà installé"] || 0
            }
            ,
            {
                label: "Abandon de projet",
                value: summedData["Abandon de projet"] || 0
            }
            ,
            {
                label: "Faux numéro",
                value: summedData["Faux numéro"] || 0
            }
        ]
    };


    return (
        <Styles>
            <div>
                <div style={{ "display": "flex", "justifyContent": "center", "paddingBottom": "10px" }}>
                    <div style={{ marginLeft: 10 }}>
                        Start Date:
                        <StyledDatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            className="datepicker"
                        />
                    </div>
                    <div style={{ marginLeft: 10 }}>
                        End Date:
                        <StyledDatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            className="datepicker"
                        />
                    </div>
                </div>
            </div>
            <div className="filters">
                {/* Sheet Name Filter */}
                <select value={selectedSheetName} onChange={e => setSelectedSheetName(e.target.value)}>
                    {uniqueSheetNames.map(name => (
                        <option key={name} value={name}>{name === 'ALL' ? 'ALL Sheets' : name}</option>
                    ))}
                </select>

                {/* SID Filter */}
                <select value={selectedSid} onChange={e => setSelectedSid(e.target.value)}>
                    {uniqueSids.map(sid => (
                        <option key={sid} value={sid}>{sid === 'ALL' ? 'ALL SIDs' : sid}</option>
                    ))}
                </select>

                {/* SSID Filter */}
                <select value={selectedSsid} onChange={e => setSelectedSsid(e.target.value)}>
                    {uniqueSsids.map(ssid => (
                        <option key={ssid} value={ssid}>{ssid === 'ALL' ? 'ALL SSIDs' : ssid}</option>
                    ))}
                </select>
            </div>
            <div style={{ paddingBottom: "10px" }}>
                {/* Table to display the summed data */}
                <table>
                    <thead>
                        <tr>
                            <th>RDV</th>
                            <th>A Rappeler</th>
                            <th>NRP</th>
                            <th>Pas intéressé</th>
                            <th>Locataire</th>
                            <th>Pas la bonne personne</th>
                            <th>Demande pour autre produit</th>
                            <th>Déjà installé</th>
                            <th>Abandon de projet</th>
                            <th>Faux numéro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Display summed data if available */}
                        {Object.keys(summedData).length > 0 && (
                            <tr>
                                <td>{summedData["RDV"] || 0}</td>
                                <td>{summedData["A Rappeler"] || 0}</td>
                                <td>{summedData["NRP"] || 0}</td>
                                <td>{summedData["Pas intéressé"] || 0}</td>
                                <td>{summedData["Locataire"] || 0}</td>
                                <td>{summedData["Pas la bonne personne"] || 0}</td>
                                <td>{summedData["Demande pour autre produit"] || 0}</td>
                                <td>{summedData["Déjà installé"] || 0}</td>
                                <td>{summedData["Abandon de projet"] || 0}</td>
                                <td>{summedData["Faux numéro"] || 0}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ReactFusioncharts
                type="pie2d"
                width={"100%"}
                height={600}
                dataFormat="JSON"
                dataSource={dataSource}
            />
        </Styles>
    );
}
export default AnalyticsTable;