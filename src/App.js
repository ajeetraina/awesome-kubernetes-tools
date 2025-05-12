import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { fetchTools } from './utils/dataUtils';

const App = () => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [votes, setVotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTools();
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(tool => tool.category))].sort();
        
        setTools(data);
        setCategories(['All', ...uniqueCategories]);
        
        // Load votes from localStorage if available
        const savedVotes = localStorage.getItem('kubetools-votes');
        if (savedVotes) {
          setVotes(JSON.parse(savedVotes));
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Handle voting for a tool
  const handleVote = (toolId) => {
    const newVotes = { ...votes };
    newVotes[toolId] = (newVotes[toolId] || 0) + 1;
    setVotes(newVotes);
    
    // Save to localStorage
    localStorage.setItem('kubetools-votes', JSON.stringify(newVotes));
  };

  // Filter tools based on selected category and search query
  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
        <div className="text-2xl font-bold mb-6 text-center">
          <span className="text-blue-400">Kube</span>
          <span className="text-white">Tools</span>
        </div>

        {/* Categories List */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-300">Categories</h2>
          <ul>
            {categories.map((category) => (
              <li 
                key={category}
                className={`py-2 px-3 cursor-pointer rounded ${
                  selectedCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-700'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-6 text-center text-gray-400 text-sm">
          <p>© 2025 Ajeet Raina</p>
          <p className="mt-1">
            <a href="https://github.com/ajeetraina/kubetools" className="text-blue-400 hover:text-blue-300">
              GitHub Repository
            </a>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-auto">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold mb-4 md:mb-0 text-gray-800">
            {selectedCategory === 'All' ? 'All Kubernetes Tools' : selectedCategory}
          </h1>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Tools Count */}
            <p className="text-gray-600 mb-4">
              Showing {filteredTools.length} tools
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>

            {/* Tools Table */}
            {filteredTools.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tool
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stars
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={tool.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {tool.name}
                          </a>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{tool.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {tool.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg className="h-4 w-4 text-yellow-400 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {tool.stars.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => handleVote(tool.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            {votes[tool.id] || 0}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No tools found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default App;
