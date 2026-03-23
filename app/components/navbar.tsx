import Link from "next/link";

export default function Nav() {
  return (
    <nav className="bg-blue-500 text-white p-4 mb-6">
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:underline">
            Home
          </Link>
        </li>
        <li>
          <Link href="/medical-tests" className="hover:underline">
            Medical Tests
          </Link>
        </li>
        <li>
          <Link href="/uom" className="hover:underline">
            Units of Measure
          </Link>
        </li>
        <li>
          <Link href="/test-categories" className="hover:underline">
            Test Categories
          </Link>
        </li>
      </ul>
    </nav>
  );
}
