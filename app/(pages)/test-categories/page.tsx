"use client";

import { useTestCategories } from "@/libs/supabase";

export default function TestCategoriesPage() {
  const data = useTestCategories();

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Test Categories</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
