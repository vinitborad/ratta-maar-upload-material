import axios from "axios";


export async function fetchSubjectData(subjectName: string) {
    try {
      const response = await axios.get('http://localhost:3000/api/getSubjectDetails', {
        params: {
          subjectName: subjectName
        }
      });
  
      if (response.status === 200) {
        const subjectData = response.data;
        // You can store the data in a variable here or perform any other operations
        return subjectData;
      } else {
        console.error('Failed to fetch data:', response.data.message);
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching data:', error.message);
      return null;
    }
  }