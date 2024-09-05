import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import axios from 'axios';
import logo from './assets/quiz_me_logo.png';
import feather from 'feather-icons';

const Popup = ({ isOpen, onClose, selectedOptions, onSelectOption, onSliderChange }) => {
  const [sliderValue, setSliderValue] = useState(10);

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSliderValue(value);
    onSliderChange(value);
  };

  // Check if at least one checkbox is selected
  const canClose = Object.values(selectedOptions).some(isChecked => isChecked);

  return isOpen ? (
    <div className="PopupOverlay">
      <div className="PopupContent">
        <h2>Select Options</h2>
        {Object.keys(selectedOptions).map(option => (
          <div key={option}>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions[option]}
                onChange={(e) => onSelectOption(option, e.target.checked)}
              />
              {option}
            </label>
          </div>
        ))}
        <div className="question-amount-container">
          <h2>Number of Notecards:</h2>
          <input
            type="range"
            min="1"
            max="50"
            value={sliderValue}
            onChange={handleSliderChange}
            className="slider"
          />
          <div className="slider-value">{sliderValue}</div>
        </div>
        <button 
          onClick={onClose} 
          disabled={!canClose}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};

function App() {
  const [result, setResult] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    'Multiple Choice': false,
    'True/False': false,
    'Short Answer': false,
    'Fill-in-the-blank': false,
  });
  const [isNotecardVisible, setIsNotecardVisible] = useState(false);
  const [notecardCount, setNotecardCount] = useState(10); // Default notecard count set to 10
  const [currentNotecardIndex, setCurrentNotecardIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const textareaRef = useRef(null); // Ref for textarea

  // Generate notecard data dynamically based on the notecard count
  const generateNotecardData = (count) => {
    return Array.from({ length: count }, (_, index) => ({
      question: `Question #${index + 1}`,
      content: `Backend will generate a question here`,
    }));
  };

  // Get the current notecard data based on slider value
  const notecardData = generateNotecardData(notecardCount);

  const handleSubmit = async () => {
    const userInput = textareaRef.current.value;
  
    if (!userInput.trim()) {
        alert('Please enter some text.');
        return;
    }
  
    try {
        const response = await axios.post('/ask', {
            question: userInput,
            context: 'Generate questions to quiz the user on the content they gave you',
        });
  
        setResult(response.data.answer);
        setIsPopupOpen(true);
        setIsSubmitted(true);
    } catch (error) {
        console.error('Error submitting question:', error);
        alert(`There was an error submitting your question: ${error.response?.data?.error || error.message}`);
    }
};

  const handleSelectOption = (option, isChecked) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [option]: isChecked,
    }));
  };

  const handlePopupClose = () => {
    // Ensure at least one checkbox is selected before closing
    if (Object.values(selectedOptions).some(isChecked => isChecked)) {
      setIsPopupOpen(false);
      setIsNotecardVisible(true);
    } else {
      alert("Please select at least one option before closing.");
    }
  };

  const handleSliderChange = (newCount) => {
    setNotecardCount(newCount);
    setCurrentNotecardIndex(0);
  };

  const handleNextNotecard = () => {
    if (currentNotecardIndex < notecardCount - 1) {
      setCurrentNotecardIndex(currentNotecardIndex + 1);
    }
  };

  const handlePrevNotecard = () => {
    if (currentNotecardIndex > 0) {
      setCurrentNotecardIndex(currentNotecardIndex - 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      feather.replace({ class: 'feather-icon' });
    }, 100); // Add a short delay for icon replacement

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [isPopupOpen, isNotecardVisible]); // Re-run when these states change

  return (
    <div className={`AppContainer ${isSubmitted ? 'submitted' : ''}`}>
      <img src={logo} alt="App Logo" className={`AppLogo ${isSubmitted ? 'smallLogo' : 'largeLogo'}`} />
      {!isSubmitted && (
        <div className="InitialScreen">
          <div className="InputTextWrapper">
            <textarea ref={textareaRef} className="TextInput" placeholder="Paste or type text here . . ."></textarea>
            <button onClick={handleSubmit} className="SubmitButton">
              <i data-feather="arrow-up-circle" className="feather-icon"></i>
            </button>
          </div>
        </div>
      )}
      {isSubmitted && (
        <>
          {result && (
            <div className="ResultContainer">
              {result}
            </div>
          )}
          <Popup
            isOpen={isPopupOpen}
            onClose={handlePopupClose}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOption}
            onSliderChange={handleSliderChange}
          />
          {isNotecardVisible && (
            <div className="NotecardContainer">
              <div className="Notecard">
                <button
                  onClick={handlePrevNotecard}
                  disabled={currentNotecardIndex === 0}
                  className="NavButton prev"
                >
                  <i data-feather="arrow-left" className="feather-icon"></i>
                </button>
                <h2>{notecardData[currentNotecardIndex]?.question}</h2>
                <p>{notecardData[currentNotecardIndex]?.content}</p>
                <button
                  onClick={handleNextNotecard}
                  disabled={currentNotecardIndex === notecardCount - 1}
                  className="NavButton next"
                >
                  <i data-feather="arrow-right" className="feather-icon"></i>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
