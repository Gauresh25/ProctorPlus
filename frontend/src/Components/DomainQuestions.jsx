import React, { useState } from "react";

// DSA Question Component
export const DSAQuestion = ({ onSubmit }) => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        DSA Problem: Implement a Binary Search Tree
      </h3>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-64 p-2 border rounded font-mono"
        placeholder="Write your code here..."
      />
      <button
        onClick={() => onSubmit({ code, language })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit Code
      </button>
    </div>
  );
};

// Design Upload Component
export const DesignUpload = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
    } else {
      alert("Please upload an image file");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Design Challenge: Create a Mobile App Homepage
      </h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-32 p-2 border rounded"
        placeholder="Describe your design choices..."
      />
      <button
        onClick={() => file && onSubmit({ file, description })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!file}
      >
        Submit Design
      </button>
    </div>
  );
};

// Marketing Video Upload Component
export const MarketingUpload = ({ onSubmit }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      setFile(file);
    } else {
      alert("Please upload a video file");
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Marketing Challenge: Create a Product Pitch
      </h3>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="w-full"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-32 p-2 border rounded"
        placeholder="Describe your marketing strategy..."
      />
      <button
        onClick={() => file && onSubmit({ file, description })}
        className="px-4 py-2 bg-blue-500 text-white rounded"
        disabled={!file}
      >
        Submit Video
      </button>
    </div>
  );
};
