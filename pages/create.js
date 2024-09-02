import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateAssessment() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Quiz");
  const [popularity, setPopularity] = useState(0);
  const [completionRate, setCompletionRate] = useState(0);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

    if (res.ok) {
      router.push('/'); 
    } else {
      console.error('Failed to add assessment');
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
            onChange={(e) => setPopularity(Number(e.target.value))}
            onFocus={() => setCompletionRate(Number(""))}
            className="input w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Completion Rate</label>
          <input
            type="number"
            value={completionRate}
            onFocus={() => setCompletionRate(Number(""))}
            onChange={(e) => setCompletionRate(Number(e.target.value))}
            className="input w-full p-3 border rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Assessment
        </button>
      </form>
    </div>
  );
}
