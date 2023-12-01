import React, { useState } from 'react';
import { Container, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Snackbar, IconButton, Button, Select, MenuItem, CircularProgress } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { EncryptUtil } from "./Utils/Encryption";

const ScmFormApp = () => {
  const [scmUrl, setScmUrl] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [scmToken, setScmToken] = useState("");
  const [scmType, setScmType] = useState("Github");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("info");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSnackbar = (message, color) => {
    setSnackbarMessage(message);
    setSnackbarColor(color);
    setSnackbarOpen(true);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Perform input validation
    if (!scmUrl || !scmType || (isPrivate && !scmToken)) {
      handleSnackbar("Please fill in all required fields.", "error");
      return;
    }

    // Perform URL validation (simple check for demonstration)
    if (!/^https?:\/\//.test(scmUrl)) {
      handleSnackbar("Invalid URL. Please enter a valid URL.", "error");
      return;
    }

    const encryptToken = EncryptUtil.encrypt(scmToken);

    // Prepare the data for the API call
    const requestData = {
      url: scmUrl,
      type: scmType,
      isPrivate,
      encryptedToken: isPrivate ? encryptToken : "",
    };

    // Make API call using Axios
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/scan",
        requestData
      );
      console.log("API response:", response.data);
      if (response.data.status === "queued") {
        handleSnackbar("Scan successfully queued!", "success");
      } else {
        handleSnackbar("Unexpected response from the server.", "error");
      }
      // Handle success, reset form, or redirect as needed
    } catch (error) {
      console.error("API error:", error);
      handleSnackbar("Failed to make API call.", "error");
      // Handle error, show error message, etc.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      style={{
        width: 500,
        height: 750,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
      <form onSubmit={handleSubmit}>
        <TextField
          label="SCM URL"
          variant="outlined"
          fullWidth
          value={scmUrl}
          onChange={e => setScmUrl(e.target.value)}
          required
        />

        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend">SCM Type</FormLabel>
          <RadioGroup
            row
            value={isPrivate ? "private" : "public"}
            onChange={e => setIsPrivate(e.target.value === "private")}>
            <FormControlLabel
              value="public"
              control={<Radio />}
              label="Public"
            />
            <FormControlLabel
              value="private"
              control={<Radio />}
              label="Private"
            />
          </RadioGroup>
        </FormControl>

        {isPrivate && (
          <TextField
            label="SCM Token"
            variant="outlined"
            fullWidth
            type="password"
            value={scmToken}
            onChange={e => setScmToken(e.target.value)}
            required
          />
        )}

        <FormControl fullWidth>
          <FormLabel component="legend">SCM Type</FormLabel>
          <Select
            value={scmType}
            onChange={e => setScmType(e.target.value)}
            variant="outlined"
            required>
            <MenuItem value="Github">Github</MenuItem>
            <MenuItem value="Gitlab">Gitlab</MenuItem>
            <MenuItem value="Gitea">Gitea</MenuItem>
            <MenuItem value="Bitbucket">Bitbucket</MenuItem>
            {/* Add more SCM types as needed */}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: 20 }}
          disabled={loading}
          fullWidth
          startIcon={loading && <CircularProgress size={20} />}>
          {loading ? "Loading" : "Submit"}
        </Button>
      </form>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        color={snackbarColor}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Container>
  );
};

export default ScmFormApp;
