"use client";

import { useMedicalTests } from "@/libs/supabase";

export default function MedicalTestsPage() {
  const data = useMedicalTests();

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Medical Tests</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Normal Min</th>
            <th>Normal Max</th>
            <th>UOM</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {data.map((test) => (
            <tr key={test.id}>
              <td>{test.id}</td>
              <td>{test.name}</td>
              <td>{test.normalmin}</td>
              <td>{test.normalmax}</td>
              <td>{test.uom ? test.uom.name : ""}</td>
              <td>{test.category ? test.category.name : ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
