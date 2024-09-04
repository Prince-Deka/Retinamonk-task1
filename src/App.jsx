import React, { useState } from 'react';
import './App.css';
import { Box, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function App() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [endDateError, setEndDateError] = useState('');

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    if (endDate && dayjs(newValue).isAfter(dayjs(endDate))) {
      setEndDate(null);
      setEndDateError('End date cannot be earlier than the start date.');
    } else {
      setEndDateError('');
    }
  };

  const handleEndDateChange = (newValue) => {
    if (startDate && dayjs(newValue).isBefore(dayjs(startDate))) {
      setEndDateError('End date cannot be earlier than the start date.');
    } else {
      setEndDate(newValue);
      setEndDateError('');
    }
  };

  const handleSubmit = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }

    const dates = {
      startDate: dayjs(startDate).format('YYYY-MM-DD'),
      endDate: dayjs(endDate).format('YYYY-MM-DD'),
    };

    try {
      const response = await fetch('http://localhost:3000/dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dates),
      });

      const result = await response.json();
      alert('Dates saved successfully!');
    } catch (error) {
      console.error('Error saving dates:', error);
      alert('Failed to save dates.');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="flex-start" gap={2}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          slotProps={{
            textField: {
              required: true,
              sx: { maxWidth: '300px' },
              helperText: " ", 
            },
          }}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          slotProps={{
            textField: {
              required: true,
              sx: { maxWidth: '300px' },
              error: !!endDateError,
              helperText: endDateError || " ", 
            },
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{
            height: '56px', 
            alignSelf: 'flex-start', 
            paddingY: 1.5,
          }}
        >
          Submit
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default App;
