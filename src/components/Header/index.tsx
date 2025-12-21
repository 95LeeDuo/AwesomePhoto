import { ImageIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-6 px-4 backdrop-blur-sm border-b border-black/10 relative z-10">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Awesome Photo
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
