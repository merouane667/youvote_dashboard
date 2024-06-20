import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Container, Typography, Box, CircularProgress, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { getElections, getCandidatesByElection, addCandidateToElection, updateCandidateInElection, deleteCandidateFromElection } from '../services/api';

const Candidates = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [currentCandidate, setCurrentCandidate] = useState({ name: '', party: '' });
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  useEffect(() => {
    const fetchElections = async () => {
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
    fetchElections();
  }, []);

  useEffect(() => {
    if (selectedElection) {
      fetchCandidatesByElection(selectedElection);
    }
  }, [selectedElection]);

  const fetchCandidatesByElection = async (electionId) => {
    setLoading(true);
    try {
      const result = await getCandidatesByElection(electionId);
      setCandidates(result.data);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to fetch candidates.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDialogOpen = (mode, candidate = {}) => {
    setDialogMode(mode);
    setCurrentCandidate(candidate);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentCandidate({ name: '', party: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCandidate({ ...currentCandidate, [name]: value });
  };

  const handleCreateOrUpdate = async () => {
    setLoading(true);
    try {
      if (dialogMode === 'create') {
        await addCandidateToElection(selectedElection, currentCandidate);
        setNotification({ open: true, message: 'Candidate added successfully.', severity: 'success' });
      } else {
        await updateCandidateInElection(selectedElection, currentCandidate._id, currentCandidate);
        setNotification({ open: true, message: 'Candidate updated successfully.', severity: 'success' });
      }
      fetchCandidatesByElection(selectedElection);
      handleDialogClose();
    } catch (error) {
      setNotification({ open: true, message: `Failed to ${dialogMode === 'create' ? 'add' : 'update'} candidate.`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setCandidateToDelete(id);
    setConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      await deleteCandidateFromElection(selectedElection, candidateToDelete);
      setNotification({ open: true, message: 'Candidate deleted successfully.', severity: 'success' });
      fetchCandidatesByElection(selectedElection);
    } catch (error) {
      setNotification({ open: true, message: 'Failed to delete candidate.', severity: 'error' });
    } finally {
      setLoading(false);
      setConfirmDeleteDialogOpen(false);
      setCandidateToDelete(null);
    }
  };

  const handleElectionChange = (event) => {
    setSelectedElection(event.target.value);
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'party', headerName: 'Party', width: 200 },
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
        Candidates
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="election-select-label">Select Election</InputLabel>
        <Select
          labelId="election-select-label"
          value={selectedElection}
          label="Select Election"
          onChange={handleElectionChange}
        >
          {elections.map((election) => (
            <MenuItem key={election._id} value={election._id}>
              {election.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {selectedElection && (
        <>
          <Button variant="contained" color="primary" onClick={() => handleDialogOpen('create')} sx={{ mb: 2 }}>
            Add Candidate
          </Button>
          <div style={{ height: 600, width: '100%' }}>
            <DataGrid
              rows={candidates.map((candidate) => ({ ...candidate, id: candidate._id }))}
              columns={columns}
              pageSize={10}
              loading={loading}
            />
          </div>
        </>
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>{dialogMode === 'create' ? 'Add Candidate' : 'Update Candidate'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            value={currentCandidate.name}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Party"
            name="party"
            value={currentCandidate.party}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateOrUpdate} color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : dialogMode === 'create' ? 'Add' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDeleteDialogOpen} onClose={() => setConfirmDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this candidate?</Typography>
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

export default Candidates;
