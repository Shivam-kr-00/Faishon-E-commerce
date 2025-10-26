import React from "react";
import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const SearchBar = ({ categories }) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const found = categories.find((cat) =>
      cat.name.toLowerCase().includes(query.toLowerCase())
    );

    if (found) {
      navigate(`/category${found.href}`);
    } else {
      toast.error("No matching category found");
    }
  };

  return (
    <div className="bg-gray-900 py-4 shadow-md">
      <form
        onSubmit={handleSearch}
        className="max-w-4xl mx-auto items-center flex justify-between bg-gray-800 rounded-full overflow-hidden px-4 py-2"
      >
        <input
          type="text"
          value={query}
          placeholder="Search for different catrgories..."
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow bg-transparent text-white outline-none placeholder-gray-300  px-3"
        />
        <button
          type="submit"
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-2 rounded-full transition"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
