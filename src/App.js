import React, { useState } from "react";

const App = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState("");

  const allSchemaOptions = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];

  const getAvailableOptions = (excludeIndex = null) => {
    const selectedValues = selectedSchemas
      .filter((_, index) => index !== excludeIndex)
      .map((schema) => schema.value);
    return allSchemaOptions.filter(
      (option) => !selectedValues.includes(option.value)
    );
  };

  const handleAddSchema = () => {
    if (currentSchema) {
      const selectedOption = allSchemaOptions.find(
        (opt) => opt.value === currentSchema
      );
      setSelectedSchemas([...selectedSchemas, selectedOption]);
      setCurrentSchema("");
    }
  };

  const handleSchemaChange = (index, newValue) => {
    const updatedSchemas = [...selectedSchemas];
    const selectedOption = allSchemaOptions.find(
      (opt) => opt.value === newValue
    );
    updatedSchemas[index] = selectedOption;
    setSelectedSchemas(updatedSchemas);
  };

  const handleRemoveSchema = (index) => {
    const updatedSchemas = selectedSchemas.filter((_, i) => i !== index);
    setSelectedSchemas(updatedSchemas);
  };

  const handleSaveSegment = async () => {
    let schemasToSave = [...selectedSchemas];
    if (
      currentSchema &&
      !selectedSchemas.find((s) => s.value === currentSchema)
    ) {
      const selectedOption = allSchemaOptions.find(
        (opt) => opt.value === currentSchema
      );
      schemasToSave.push(selectedOption);
    }

    const schemaArray = schemasToSave.map((schema) => ({
      [schema.value]: schema.label,
    }));

    const payload = {
      segment_name: segmentName,
      schema: schemaArray,
    };

    try {
      const webhookUrl =
        "https://webhook.site/e7243387-f87e-41b4-9257-8fb27237383d";

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      const response = await fetch(webhookUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Request sent successfully");
      alert("Segment saved successfully!");
      handleClosePopup();
    } catch (error) {
      console.error("Error saving segment:", error);
      alert("Error saving segment. Please try again.");
    }
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSegmentName("");
    setSelectedSchemas([]);
    setCurrentSchema("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setIsPopupOpen(true)}
          className="bg-white border-2 border-gray-600 text-gray-700 px-6 py-3 rounded hover:bg-gray-50 transition-colors font-medium"
        >
          Save segment
        </button>

        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
              <div className="bg-teal-600 text-white px-6 py-4 flex items-center">
                <button
                  onClick={handleClosePopup}
                  className="mr-3 text-white hover:text-gray-200"
                >
                  ←
                </button>
                <h2 className="text-lg font-semibold">Saving Segment</h2>
              </div>

              <div className="p-6 overflow-y-auto flex-1">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter the Name of the Segment
                  </label>
                  <input
                    type="text"
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    placeholder="Name of the segment"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  To save your segment, you need to add the schemas to build the
                  query
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    <span>- User Traits</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    <span>- Group Traits</span>
                  </div>
                </div>

                {selectedSchemas.length > 0 && (
                  <div className="border-2 border-blue-400 rounded p-4 mb-4 bg-blue-50">
                    {selectedSchemas.map((schema, index) => (
                      <div key={index} className="flex items-center gap-2 mb-3">
                        <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                        <select
                          value={schema.value}
                          onChange={(e) =>
                            handleSchemaChange(index, e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                          <option value={schema.value}>{schema.label}</option>
                          {getAvailableOptions(index).map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleRemoveSchema(index)}
                          className="text-gray-400 hover:text-gray-600 text-xl px-2"
                        >
                          −
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-4">
                  <select
                    value={currentSchema}
                    onChange={(e) => setCurrentSchema(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-600"
                  >
                    <option value="">Add schema to segment</option>
                    {getAvailableOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddSchema}
                  disabled={!currentSchema}
                  className="text-teal-600 hover:text-teal-700 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  + Add new schema
                </button>
              </div>

              <div className="px-6 py-4 bg-gray-50 border-t flex justify-start gap-3">
                <button
                  onClick={handleSaveSegment}
                  disabled={
                    !segmentName ||
                    (selectedSchemas.length === 0 && !currentSchema)
                  }
                  className="bg-teal-500 text-white px-6 py-2 rounded hover:bg-teal-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save the Segment
                </button>
                <button
                  onClick={handleClosePopup}
                  className="text-red-500 hover:text-red-600 px-6 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
