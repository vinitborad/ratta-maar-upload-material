"use client"

import axios from "axios";
import { useParams } from "next/navigation"
import { useState } from "react";

export default function Page() {

  const { id } = useParams();

  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    subjectName: '',
    type: '',
    file: null
  });

  const subjects = [
    'english',
    'pps',
    'bee',
    'bme',
    'es',
    'egd',
    'maths-1',
    'maths-2',
    'physics',
    'chemistry',
    'be',
  ]; // Add your subject names here
  const types = ['notes', 'assignments', 'manuals', 'papers', 'cheatSheets', 'pyq']; // Add your types here

  const handleInputChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e: any) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('subjectName', formData.subjectName);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('file', formData.file);

    try {
      const res = await axios.post('http://localhost:3000/api/addMaterial', formDataToSend);
      console.log('File uploaded successfully:', res.data);
      // You can handle the response here, such as displaying a success message.
    } catch (error) {
      console.error('Error uploading file:', error);
      // Handle error, display error message, etc.
    }
  };



  return (
    <div>
      <h1>Upload Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} className=" text-black" />
        </div>
        <div>
          <label>Description:</label>
          <input type="text" name="description" value={formData.description} onChange={handleInputChange} className=" text-black" />
        </div>
        <div>
          <label>Subject Name:</label>
          <select name="subjectName" value={formData.subjectName} onChange={handleInputChange} className="text-black">
            <option value="">Select Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Type:</label>
          <select name="type" value={formData.type} onChange={handleInputChange} className="text-black">
            <option value="">Select Type</option>
            {types.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Upload PDF:</label>
          <input type="file" accept="application/pdf" onChange={handleFileChange} className=" text-black" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}