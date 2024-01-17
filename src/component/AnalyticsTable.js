import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Styled-components for the table and filters
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
margin-bottom: 1rem;

select {
margin-right: 0.5rem;
padding: 0.5rem;
border-radius: 0.25rem;
border: 1px solid #ccc;
}
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://95.164.44.248:3000/analytics-data');
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
        const filteredData = data.filter(item =>
            (selectedSheetName === 'ALL' || item.sheetName == selectedSheetName)
        );
        const sortedSids = [...new Set(filteredData.map(item => item.sid))]
            .sort((a, b) => a - b); // Sort numerically
        setUniqueSids(['ALL', ...sortedSids]);
    }, [selectedSheetName, data]);

    useEffect(() => {
        const filteredData = data.filter(item =>
            (selectedSheetName === 'ALL' || item.sheetName == selectedSheetName) &&
            (selectedSid === 'ALL' || item.sid == selectedSid)
        );
        const sortedSsids = [...new Set(filteredData.map(item => item.ssid))]
            .sort((a, b) => a - b); // Sort numerically
        setUniqueSsids(['ALL', ...sortedSsids]);
    }, [selectedSheetName, selectedSid, data]);

    useEffect(() => {
        const filteredData = data.filter(item =>
            (selectedSheetName === 'ALL' || item.sheetName == selectedSheetName) &&
            (selectedSid === 'ALL' || item.sid == selectedSid) &&
            (selectedSsid === 'ALL' || item.ssid == selectedSsid)
        );
        const sums = filteredData.reduce((acc, row) => {
            Object.keys(row).forEach(key => {
                if (!['sid', 'ssid', 'sheetName'].includes(key)) {
                    acc[key] = (acc[key] || 0) + row[key];
                }
            });
            return acc;
        }, {});

        setSummedData(sums);
    }, [selectedSheetName, selectedSid, selectedSsid, data]);
    return (
        <Styles>
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
                        </tr>
                    )}
                </tbody>
            </table>
        </Styles>
    );
}
export default AnalyticsTable;