import React, { useState } from 'react';
import styles from "../styles/Ques.module.css";

const DomainSpecificSection = ({ domain, onAnswerChange }) => {
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('javascript');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    onAnswerChange({
      description,
      file: selectedFile,
      language: domain === 'coding' ? language : undefined
    });
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    onAnswerChange({
      description: e.target.value,
      file,
      language: domain === 'coding' ? language : undefined
    });
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    onAnswerChange({
      description,
      file,
      language: e.target.value
    });
  };

  const renderDomainSpecificContent = () => {
    switch (domain) {
      case 'coding':
        return (
          <div className={styles.domainSpecific}>
            <h3>DSA Problem Solution</h3>
            <select 
              value={language}
              onChange={handleLanguageChange}
              className={styles.languageSelect}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
            <textarea
              className={styles.codeEditor}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Write your code here..."
              rows={10}
            />
          </div>
        );

      case 'design':
        return (
          <div className={styles.domainSpecific}>
            <h3>Design Submission</h3>
            <input
              type="file"
              accept=".psd,.ai,.fig,.sketch,.pdf"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <textarea
              className={styles.textArea}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your design approach and decisions..."
              rows={5}
            />
          </div>
        );

      case 'marketing':
        return (
          <div className={styles.domainSpecific}>
            <h3>Marketing Campaign Submission</h3>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <textarea
              className={styles.textArea}
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Describe your marketing strategy and campaign details..."
              rows={5}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.domainSpecificSection}>
      {renderDomainSpecificContent()}
    </div>
  );
};

export default DomainSpecificSection;