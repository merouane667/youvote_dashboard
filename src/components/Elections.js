// src/components/Elections.js
import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Typography, Box, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { getElections, createElection, updateElection, deleteElection } from '../services/api';

const Elections = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [currentElection, setCurrentElection] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [electionToDelete, setElectionToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getElections();
        setElections(result.data);
      } catch (error) {
        setNotification({ open: true, message: 'Failed to fetch elections.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDialogOpen = (mode, election = {}) => {
    setDialogMode(mode);
    setCurrentElection(election);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentElection({ title: '', description: '', startDate: '', endDate: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentElection({ ...currentElection, [name]: value });
  };

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    try {
      if (dialogMode === 'create') {
        await createElection(currentElection);
        setNotification({ open: true, message: 'Election created successfully.', severity: 'success' });
      } else {
        await updateElection(currentElection._id, currentElection);
        setNotification({ open: true, message: 'Election updated successfully.', severity: 'success' });
      }
      const result = await getElections();
      setElections(result.data);
      handleDialogClose();
    } catch (error) {
      setNotification({ open: true, message: `Failed to ${dialogMode === 'create' ? 'create' : 'update'} election.`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setElectionToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteElection(electionToDelete);
      setNotification({ open: true, message: 'Election deleted successfully.', severity: 'success' });
      const result = await getElections();
      setElections(result.data);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to delete election.', severity: 'error' });
    } finally {
      setLoading(false);
      setConfirmDeleteDialogOpen(false);
      setElectionToDelete(null);
    }
  };

  const columns = [
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'startDate', headerName: 'Start Date', width: 180 },
    { field: 'endDate', headerName: 'End Date', width: 180 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button variant="contained" color="primary" onClick={() => handleDialogOpen('update', params.row)} sx={{ mr: 1 }}>
            Update
          </Button>
          <Button variant="contained" color="secondary" onClick={() => handleDeleteClick(params.id)}>
            Delete
          </Button>
        </Box>
      )
    }
  ];

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Elections
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleDialogOpen('create')} sx={{ mb: 2 }}>
        Create Election
      </Button>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={elections.map((election) => ({ ...election, id: election._id }))}
          columns={columns}
          pageSize={10}
          loading={loading}
        />
      </div>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === 'create' ? 'Create Election' : 'Update Election'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            value={currentElection.title}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            value={currentElection.description}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Start Date"
            name="startDate"
            type="datetime-local"
            value={currentElection.startDate}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="End Date"
            name="endDate"
            type="datetime-local"
            value={currentElection.endDate}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdate} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : dialogMode === 'create' ? 'Create' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this election?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification({ ...notification, open: false })}>
        <Alert onClose={() => setNotification({ ...notification, open: false })} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Elections;
