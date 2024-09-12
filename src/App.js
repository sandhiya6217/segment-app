import React, { useState } from "react";
import { Segment } from './ApiService'; // Import the Segment function from ApiService.js

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: "First Name", value: "first_name", type: "user" }, // user trait
    { label: "Last Name", value: "last_name", type: "user" },
    { label: "Gender", value: "gender", type: "group" }, // group trait
    { label: "Age", value: "age", type: "user" },
    { label: "Account Name", value: "account_name", type: "group" },
    { label: "City", value: "city", type: "user" },
    { label: "State", value: "state", type: "user" },
  ]);
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // State to track error message
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  // Toggle popup
  const togglePopup = () => {
    setIsOpen(!isOpen);
    setErrorMessage(""); // Reset error message on opening/closing
  };

  // Add schema to blue box
  const addSchema = () => {
    if (currentSchema) {
      const selectedSchemaObject = availableSchemas.find(
        (schema) => schema.value === currentSchema
      );
      setSelectedSchemas([...selectedSchemas, selectedSchemaObject]);

      // Remove the selected schema from available schemas
      setAvailableSchemas(
        availableSchemas.filter((schema) => schema.value !== currentSchema)
      );

      // Reset current schema dropdown
      setCurrentSchema("");
    }
  };

  // Remove schema from selected list
  const removeSchema = (schemaValue) => {
    const removedSchema = selectedSchemas.find(
      (schema) => schema.value === schemaValue
    );

    setSelectedSchemas(selectedSchemas.filter((schema) => schema.value !== schemaValue));

    setAvailableSchemas([...availableSchemas, removedSchema]);
  };

  // Save segment and send to server
  const saveSegment = async () => {
    setIsLoading(true); // Show loading indicator
    setErrorMessage(""); // Clear any previous error message

    // Construct the payload for the Segment API
    const schemaData = selectedSchemas.map((schema) => ({
      [schema.value]: schema.label,
    }));

    const segmentData = {
      segment_name: segmentName,
      schema: schemaData,
    };

    try {
      // Send the data to the Segment API
      await Segment(segmentData);
      console.log("Segment saved successfully.");

      // Close the popup after successful save
      togglePopup();
    } catch (error) {
      // Show error message on failure
      setErrorMessage("Failed to save the segment. Please try again.");
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="relative p-6">
      {/* Save Segment Button */}
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all"
        onClick={togglePopup}
      >
        Save Segment
      </button>

      {/* Popup Window */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 w-1/2 bg-white flex flex-col p-6 shadow-lg z-50 h-full">
          {/* Title */}
          <h2 className="text-2xl font-semibold mb-4">Saving Segment</h2>

          {/* Segment Name Input */}
          <div className="mb-4">
            <label
              htmlFor="segmentName"
              className="block text-sm font-medium text-gray-700"
            >
              Enter the Name of the Segment
            </label>
            <input
              id="segmentName"
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Name of the segment"
            />
          </div>

          {/* Instruction */}
          <p className="text-sm text-gray-500 mb-4">
            To save your segment, you need to add the schemas to build the query
          </p>

          {/* User and Group Traits Indicator */}
          <div className="flex items-center mb-4">
            {/* Green dot for User Traits */}
            <span className="flex items-center mr-4">
              <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              <span>User Traits</span>
            </span>

            {/* Red dot for Group Traits */}
            <span className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
              <span>Group Traits</span>
            </span>
          </div>

          {/* Schema List with Indicators */}
          <div className="mb-4">
            {selectedSchemas.map((schema) => (
              <div
                key={schema.value}
                className="flex items-center justify-between mb-2 p-2 border border-blue-300 rounded-md"
              >
                <div className="flex items-center">
                  {/* Type indicator */}
                  <span
                    className={`h-3 w-3 rounded-full mr-2 ${
                      schema.type === "user" ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span>{schema.label}</span>
                </div>

                <div className="flex items-center">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeSchema(schema.value)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    &#x2212;
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Schema */}
          <div className="mb-4">
            <label
              htmlFor="schema"
              className="block text-sm font-medium text-gray-700"
            >
              Add schema to segment
            </label>
            <select
              id="schema"
              value={currentSchema}
              onChange={(e) => setCurrentSchema(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select schema</option>
              {availableSchemas.map((schema) => (
                <option key={schema.value} value={schema.value}>
                  {schema.label}
                </option>
              ))}
            </select>

            {/* Add New Schema Button */}
            <button
              className="text-blue-500 mt-2 hover:underline"
              onClick={addSchema}
            >
              + Add new schema
            </button>
          </div>

          {/* Display Error Message if Save Fails */}
          {errorMessage && (
            <div className="text-red-500 text-sm mb-4">
              {errorMessage}
            </div>
          )}

          {/* Display Loading Indicator */}
          {isLoading && (
            <div className="text-blue-500 text-sm mb-4">
              Saving data, please wait...
            </div>
          )}

          {/* Save and Cancel Buttons */}
          <div className="flex justify-between mt-auto">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
              onClick={saveSegment}
              disabled={isLoading} // Disable button while saving
            >
              Save the Segment
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all"
              onClick={togglePopup}
              disabled={isLoading} // Disable button while saving
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
