import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import Link from "next/link";

export default function AssessmentDashboard() {
  const [assessments, setAssessments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [sortOption, setSortOption] = useState("Date");

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await fetch('/api/assessment');
        if (res.ok) {
          const data = await res.json();
          setAssessments(data);
        } else {
          console.error('Failed to fetch assessments');
        }
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    }

    fetchAssessments();
  }, []);

  const filteredAssessments = assessments
    .filter((assessment) => {
      if (filterType === "All") return true;
      return assessment.type === filterType;
    })
    .filter(
      (assessment) =>
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.type.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "Date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOption === "Popularity") {
        return b.popularity - a.popularity;
      } else if (sortOption === "Completion Rate") {
        return b.completionRate - a.completionRate;
      }
      return 0;
    });

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Assessment Dashboard</h1>
        <Link href="/create" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Create New Assessment
        </Link>
      </header>
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AiOutlineSearch className="text-gray-500" size={20} />
        </span>
        <input
          type="text"
          placeholder="Search assessments by title or type..."
          className="input w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="mr-2 font-semibold">Filter by Type:</label>
          <select
            className="border rounded p-2"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
            <option value="Survey">Survey</option>
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold">Sort by:</label>
          <select
            className="border rounded p-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="Date">Date</option>
            <option value="Popularity">Popularity</option>
            <option value="Completion Rate">Completion Rate</option>
          </select>
        </div>
      </div>
      <section>
        <h2 className="text-xl font-semibold mb-4">My Assessments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.length > 0 ? (
            filteredAssessments.map((assessment) => (
              <div
                key={assessment.id}
                className="bg-white shadow-lg rounded-lg p-6 border border-gray-200"
              >
                <h3 className="text-lg font-bold mb-2">{assessment.title}</h3>
                <p className="text-gray-600 mb-2">Type: {assessment.type}</p>
                <p className="text-gray-500 mb-2">Date: {assessment.date}</p>
                <p className="text-gray-500 mb-2">Popularity: {assessment.popularity}%</p>
                <p className="text-gray-500 mb-4">Completion Rate: {assessment.completionRate}%</p>

                <div className="flex space-x-4">
                  <Link href={`/`} className="text-blue-500 hover:underline">
                    Edit
                  </Link>
                  <Link href={`/`} className="text-green-500 hover:underline">
                    Manage
                  </Link>
                  <Link href={`/`} className="text-purple-500 hover:underline">
                    View Analytics
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No assessments found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
