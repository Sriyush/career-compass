// index.js

const express = require('express');
const { spawn } = require('child_process');
const app = express();
const port = 3001;
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.post('/predict', (req, res) => {
  const inputData = req.body.data;

  // Spawn the Python process
  const pythonProcess = spawn('python3', ['predict.py', JSON.stringify(inputData)]);

  pythonProcess.stdout.on('data', (data) => {
      try {
          const prediction = JSON.parse(data.toString().trim()); // Parse the prediction
          res.json({ prediction: prediction });
      } catch (error) {
          console.error('Error parsing prediction:', error);
          res.status(500).json({ error: 'Failed to parse prediction response' });
      }
  });

  pythonProcess.stderr.on('data', (data) => {
      const errorMessage = data.toString();
      console.error('Error from Python script:', errorMessage);

      if (!res.headersSent) {
          res.status(500).json({ error: 'Error from Python script', details: errorMessage });
      }
  });

  pythonProcess.on('close', (code) => {
      console.log(`Python script exited with code ${code}`);
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
