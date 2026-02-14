"use client";

import { useState } from "react";
import api from "@/lib/api";

export default function OnboardingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");

  const submit = async () => {
    const res = await api.post("/workspace", {
      name,
      email,
      timezone,
    });

    alert("Workspace created: " + res.data.id);
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Create Workspace</h2>

      <input
        placeholder="Business Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <button onClick={submit}>Create</button>
    </div>
  );
}
