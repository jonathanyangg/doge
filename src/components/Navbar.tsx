import Link from 'next/link';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">eCFR Analyzer</span>
          </div>
          <div className="flex items-center">
            <ul className="flex space-x-8">
              <li>
                <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">
                  Agencies
                </Link>
              </li>
              <li>
                <Link href="/titles" className="text-gray-600 hover:text-blue-600 font-medium">
                  Titles
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;