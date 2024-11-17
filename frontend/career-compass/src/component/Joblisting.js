import React, { useState } from 'react';
import axios from 'axios';

function ResumeUploader() {
  const [jobData, setJobData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [result, setResult] = useState(null); // Store the extracted job roles
  const [jobload, setJobLoad] = useState(false); // For fetching job roles
  const [loadstate, setLoadState] = useState(false); // For fetching jobs

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
    setResult(null); // Clear previous results when a new file is selected
  };

  const handleUpload = async () => {
    if (!resumeFile) return;

    const formData = new FormData();
    formData.append('resume', resumeFile);

    setIsLoading(true);
    setJobLoad(true); // Show loading for job roles
    try {
      const response = await fetch('https://fac7-34-125-195-23.ngrok-free.app/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', errorText);
        throw new Error(`Upload failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('Received data:', data);
      setResult(data.result); // Assuming the API returns a JSON with a `result` field
      setJobLoad(false); // Job roles received, stop loading
      fetchIndeedJobs(data.result); // Pass the received job roles to fetchIndeedJobs
    } catch (error) {
      console.error('Error uploading file:', error);
      setResult('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIndeedJobs = async (roles) => {
    setLoadState(true); // Start loading for job fetching
    const apiKey = 'putyourkey; // Your ScrapingDog API key
    const location = 'India'; // You can make this dynamic based on user input if needed
    const experienceLevel = 'entry level'; // Modify as needed

    try {
      const jobs = await Promise.all(
        roles.split(',').map(async (role) => {
          const url = 'https://api.scrapingdog.com/indeed/';
          const params = {
            api_key: apiKey,
            url: `https://www.indeed.com/jobs?q=${role.trim()}&l=${location}&explvl=${experienceLevel}`,
          };

          const response = await axios.get(url, { params });
          const data = response.data;

          console.log('Raw response:', data);
          return { role, jobs: Array.isArray(data) ? data : [] }; // Adjust based on your response data
        })
      );

      setJobData(jobs);
    } catch (error) {
      console.error('Error fetching Indeed jobs:', error);
    } finally {
      setLoadState(false); // Stop loading for job fetching
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
      <h2>Job Listing</h2>

      {/* Upload input field */}
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        style={{ marginBottom: '10px', display: 'block' }}
      />

      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? 'Uploading and Extracting...' : 'Upload Resume'}
      </button>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>{jobload ? 'Fetching job roles...' : 'Extracted Job Roles:'}</h3>
          <p>{result}</p>
        </div>
      )}

      {jobData.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>{loadstate ? 'Fetching job listings...' : 'Indeed Job Results:'}</h3>
          {jobData.map(({ role, jobs }) => (
            <div key={role}>
              <h4>Role: {role}</h4>
              <ul>
                {jobs.map((job, index) => (
                  <li key={job.jobID || index}>
                    <strong>{job.jobTitle}</strong> - {job.companyName} ({job.companyLocation})
                    <br />
                    <a href={job.jobLink} target="_blank" rel="noopener noreferrer">
                      View Job
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {jobload && <p style={{ color: 'blue', marginTop: '10px' }}>Loading job roles...</p>}
      {loadstate && <p style={{ color: 'blue', marginTop: '10px' }}>Loading job listings...</p>}
    </div>
  );
}

export default ResumeUploader;
