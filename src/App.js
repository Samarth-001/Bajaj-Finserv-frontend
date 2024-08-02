import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './App.css';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [error, setError] = useState(null);

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_alphabet', label: 'Highest Alphabet' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      const parsedJson = JSON.parse(jsonInput);
      const response = await axios.post('http://localhost:8000/bfhl', parsedJson);
      console.log(response);
      setResponseData(response.data);
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Error: ${error.response.data.error || 'Unknown error'} - Status: ${error.response.status}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Error: No response received from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message}`);
      }
      setResponseData(null);
    }
  };

  const renderResponse = () => {
    if (!responseData) return null;

    return (
      <div>
        {selectedOptions.includes('alphabets') && (
          <div>
            <h3>Alphabets:</h3>
            <p>{responseData.alphabets.join(', ')}</p>
          </div>
        )}
        {selectedOptions.includes('numbers') && (
          <div>
            <h3>Numbers:</h3>
            <p>{responseData.numbers.join(', ')}</p>
          </div>
        )}
        {selectedOptions.includes('highest_alphabet') && (
          <div>
            <h3>Highest Alphabet:</h3>
            <p>{responseData.highest_alphabet.join(', ')}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <h1>JSON Input Processor</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='Enter JSON here, e.g. {"data": ["A", "C", "z"]}'
        ></textarea>
        <button type="submit">Submit</button>
      </form>
      {error && <div className="error">{error}</div>}
      {responseData && (
        <div>
          <Select
            isMulti
            name="filters"
            options={options}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={(selected) => setSelectedOptions(selected.map(option => option.value))}
          />
          {renderResponse()}
        </div>
      )}
    </div>
  );
};

export default App;
