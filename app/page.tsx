"use client"

import axios from "axios";
import { useParams } from "next/navigation"
import { useState } from "react";

export default function Page() {

  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');


  const [formData, setFormData] = useState<any>({
    name: '',
    description: '',
    subjectName: '',
    type: '',
    file: null
  });

  const subjects = [
    'complex-variables-and-partial-differential-equations-civil',
    'fluid-mechanics-and-hydraulics',
    'control-sysytem-theory',
    'electrical-circuit-analysis',
    'applied-mathematics-for-electrical-engineering',
    'analog-and-digital-electronics',
    'design-engineering-1-b',
    'analog-circuit-design',
    'signal-systems',
    'professional-ethics',
    'microprocessor-microcontroller',
    'electromagnetic-theory',
    'electronic-measurement-laboratory',
    'mechanical-measurement-and-metrology',
    'fluid-mechanics-and-hydraulics-machines',
    'fundamentals-of-machine-design',
    'manufacturing-processes',
    'organisational-behaviour',
    'object-oriented-programming-i',
    'computer-organization-architecture',
    'discrete-mathematics',
    'principles-of-economics-and-management',
    'operating-system-and-virtualization',
    'operating-system',
    'surveying',
    'structural-analysis-i',
    'civil-engineering-societal-global-impact',
    'economics-for-engineers',
    'electrical-machine-i',
    'electromagnetic-fields',
    'power-system-i',
    'power-electronics',
    'analog-signal-processing',
    'control-theory',
    'principle-of-measurement-science',
    'microprocessor-and-interfacing',
    'heat-transfer',
    'chemical-engineering-thermodynamics-ii',
    'unit-processes-chemical-technology',
    'pollution-control-safety-management',
    'numerical-methods-in-chemical-engineering',
    'environmental-resource-management',
    'fundamentals-of-wastewater-quality',
    'occupational-health-safety',
    'municipal-industrial-solid-waste-management',
    'municipal-engineering',
    'yarn-manufacture-ii',
    'fibre-physics',
    'fabric-formation-ii',
    'textile-processing',
    'sustainable-textile-production',
    'basics-of-automobile-systems',
    'automotive-manufacturing-processes-and-technology',
    'rubber-compounding-materials',
    'natural-rubber-science-technology',
    'rubber-engineering-its-economics',
    'rubber-rheology',
    'textile-metal-reinforcement-of-elastomers',
    'industrial-management-in-plastic-industries',
    'fundamentals-of-mold-design',
    'thermoplastic-materials',
    'injection-molding-technology',
    'plastics-testing-1',
    'psychological-processes',
    'human-anatomy-physiology-ii',
    'fundamentals-of-biopotentials',
    'biomedical-sensors-transducers',
    'control-system-and-analysis',
    'design-engineering-1-a',
    'probability-and-statistics',
    'effective-technical-communication',
    'indian-constitution',
    'control-systems',
    'digital-system-design',
    'network-theory',
    'complex-variables-and-partial-differential-equations',
    'material-science-and-metallurgy',
    'engineering-thermodynamics',
    'kinematics-and-theory-of-machines',
    'data-structures',
    'database-management-systems',
    'digital-fundamentals',
    'geotechnical-engineering',
    'building-construction-technology',
    'mechanics-of-solids',
    'building-and-town-planning',
    'heat-transfer',
    'chemical-engineering-thermodynamics-ii',
    'unit-processes-chemical-technology',
    'pollution-control-safety-management',
    'numerical-methods-in-chemical-engineering',
    'environmental-microbiology-bioremediation',
    'environmental-chemistry-i',
    'unit-operations-processes-in-chemical-industries',
    'basics-of-environmental-hydraulics',
    'yarn-manufacture-i',
    'textile-materials',
    'fabric-formation-i',
    'statistics-for-textile-engineering',
    'digital-electronics',
    'dynamics-of-linear-systems',
    'measurement-and-instruments',
    'rubber-technology',
    'rubber-physics-its-thermodynamics',
    'latex-technology',
    'numerical-methods-viscoelastic-models-of-elastomers',
    'plastics-material-science',
    'thermoset-plastics-materials-and-processing-techniques',
    'hydraulics-pneumatics-in-plastic-industry',
    'applied-mathematics-in-plastic-industry',
    'human-anatomy-physiology-i',
    'advanced-electronics',
    'fundamentals-of-digital-electronics',
    'english',
    'pps',
    'bee',
    'bme',
    'es',
    'egd',
    'maths-1',
    'maths-2',
    'physics',
    'physics-2',
    'chemistry',
    'be',
    'bce',
  ]; // Add your subject names here
  const types = ['notes', 'assignments', 'manuals', 'papers', 'cheatSheets', 'pyq', 'syllabus']; // Add your types here

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

  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const handleSubmit = async (e: any) => {
    setLoading(true);
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('subjectName', formData.subjectName);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('file', formData.file);

    try {
      const res = await axios.post(`${domain}/api/addMaterial`, formDataToSend);
      setSuccessMessage('File uploaded successfully');
      setErrorMessage('');
      console.log('File uploaded successfully:', res.data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Error uploading file';
      setErrorMessage(message);
      setSuccessMessage('');
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Form</h1>
      {loading && <div className="text-center mb-4">Loading...</div>}
      {successMessage && <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">{successMessage}</div>}
      {errorMessage && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Subject Name:</label>
          <select
            name="subjectName"
            value={formData.subjectName}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            disabled={loading}
          >
            <option value="">Select Subject</option>
            {subjects.map((subject, index) => (
              <option key={index} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            disabled={loading}
          >
            <option value="">Select Type</option>
            {types.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload PDF:</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-black"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}