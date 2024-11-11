import React, { useState } from 'react';
import '../Styling/Popup.css';

const Popup = ({ isOpen, onClose, selectedOptions, onSelectOption, onSliderChange }) => {
  const [sliderValue, setSliderValue] = useState(10);

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setSliderValue(value);
    onSliderChange(value);
  };

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

export default Popup;
