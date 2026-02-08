interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
  return (
    <div className="relative w-full max-w-md mx-auto mb-6">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search books..."
        className="w-full px-5 py-3 rounded-full border shadow-sm focus:ring-2 focus:ring-amber-400 outline-none transition"
      />
      <span className="absolute right-5 top-3 text-gray-400">🔍</span>
    </div>
  );
};

export default SearchBar;