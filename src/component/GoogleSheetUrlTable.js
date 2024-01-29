import React, { useState, useEffect } from 'react';
import { fetchSheets, createSheet, updateSheet, deleteSheet } from '../api/api';

function GoogleSheetUrlTable() {
  const [sheets, setSheets] = useState([]);

  useEffect(() => {
    const loadSheets = async () => {
      try {
        const data = await fetchSheets();
        setSheets(data);
      } catch (error) {
        console.error('Failed to fetch sheets:', error);
      }
    };
    loadSheets();
  }, []);

  const handleCreate = async (newSheetData) => {
    try {
      const newSheet = await createSheet(newSheetData);
      setSheets([...sheets, newSheet]);
    } catch (error) {
      console.error('Failed to create sheet:', error);
    }
  };

  const handleUpdate = async (id, updatedSheetData) => {
    try {
      const updatedSheet = await updateSheet(id, updatedSheetData);
      setSheets(sheets.map(sheet => sheet.id === id ? updatedSheet : sheet));
    } catch (error) {
      console.error('Failed to update sheet:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSheet(id);
      setSheets(sheets.filter(sheet => sheet.id !== id));
    } catch (error) {
      console.error('Failed to delete sheet:', error);
    }
  };

  // Render your components and use the above handlers when needed
  return (
    <div>
      
    </div>
  );
}

export default GoogleSheetUrlTable;
