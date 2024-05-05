"use client"

import axios from "axios";
import { useParams } from "next/navigation"
import { useState } from "react";

export default function Page() {

    const { id } = useParams();

    if (id != 'secret') {
        return (
            <div>You are not authorized to upload in backend !</div>
        )
    }

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subjectName: '',
        type: '',
        file: null
    });

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            file: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
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
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className=" text-black"/>
                </div>
                <div>
                    <label>Description:</label>
                    <input type="text" name="description" value={formData.description} onChange={handleInputChange} className=" text-black"/>
                </div>
                <div>
                    <label>Subject Name:</label>
                    <input type="text" name="subjectName" value={formData.subjectName} onChange={handleInputChange} className=" text-black"/>
                </div>
                <div>
                    <label>Type:</label>
                    <input type="text" name="type" value={formData.type} onChange={handleInputChange} className=" text-black"/>
                </div>
                <div>
                    <label>Upload PDF:</label>
                    <input type="file" accept="application/pdf" onChange={handleFileChange} className=" text-black"/>
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}