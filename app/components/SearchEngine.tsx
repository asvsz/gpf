import { IoSearch } from "react-icons/io5"

interface SearchEngineProps{
  onSearch: (term: string) => void
}

export default function SearchEngine({onSearch}: SearchEngineProps){

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value)
  }

  return (
    <div className="fixed top-20 items-center p-4">
      <div className="w-full max-w-lg relative">
        <div className="absolute left-0 flex items-center pl-3 pt-3 pointer-events-none">
          <IoSearch className="text-gray-500 text-2xl " />
        </div>
        <input
          type="text"
          placeholder="Busque pelo nome..."
          onChange={handleSearch}
          className="p-3 pl-10 mb-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-800"
        />
      </div>
    </div>

  )
}