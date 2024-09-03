import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateAssessment() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Quiz");
  const [popularity, setPopularity] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowNotification(false); 
  
    try {
      const newAssessment = {
        id: Date.now(),
        title,
        type,
        date: new Date().toISOString().split('T')[0],
        popularity,
        completionRate,
      };
  
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAssessment),
      });
  
      const responseBody = await res.json();
      console.log('Response Status:', res.status);
      console.log('Response Body:', responseBody);
  
      if (res.ok) {
        console.log('Assessment added successfully:', responseBody);
        setShowNotification(true);
        router.push('/');
      } else {
        console.error('Failed to add assessment:', responseBody.message);
        throw new Error(responseBody.message || 'Failed to add assessment');
      }
    } catch (error) {
      console.error('Error during handleSubmit:', error);
      alert('Failed to add assessment. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Assessment</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Assessment Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input w-full p-3 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Assessment Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded p-3 w-full"
          >
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
            <option value="Survey">Survey</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Popularity</label>
          <input
            type="number"
            value={popularity}
            onFocus={() => setPopularity("")}
            onChange={(e) => setPopularity(e.target.value)}
            className="input w-full p-3 border rounded-lg"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Completion Rate</label>
          <input
            type="number"
            value={completionRate}
            onFocus={() => setCompletionRate("")}
            onChange={(e) => setCompletionRate(e.target.value)}
            className="input w-full p-3 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex justify-center items-center"
          disabled={loading}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4" 
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {loading ? "Adding..." : "Add Assessment"}
        </button>
      </form>
    </div>
  );
}
