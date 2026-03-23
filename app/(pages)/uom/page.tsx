"use client";

import { useUOM } from "@/libs/supabase";

export default function UOMPage() {
  const data = useUOM();

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Units of Measure</h1>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((uom) => (
            <tr key={uom.id}>
              <td>{uom.id}</td>
              <td>{uom.name}</td>
              <td>{uom.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
