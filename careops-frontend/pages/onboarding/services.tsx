import { useState } from "react";
import { useRouter } from "next/router";
import api from "../../src/lib/api";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("30");
  const [location, setLocation] = useState("");

  const addService = async () => {
    const workspaceId = localStorage.getItem("workspaceId");
    const res = await api.post(`/workspace/${workspaceId}/services`, {
      name,
      duration: parseInt(duration),
      location,
    });
    setServices([...services, res.data]);
    setName("");
    setDuration("30");
    setLocation("");
  };

  const next = () => {
    if (services.length === 0) {
      alert("Add at least one service");
      return;
    }
    localStorage.setItem("serviceId", services[0].id);
    router.push("/onboarding/availability");
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h2>Step 3: Services</h2>
      <p>Define what services you offer</p>

      <input
        placeholder="Service Name (e.g., Consultation)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <input
        placeholder="Duration (minutes)"
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <input
        placeholder="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ width: "100%", padding: 8, marginBottom: 10 }}
      />
      <button onClick={addService} style={{ padding: "8px 16px", marginBottom: 20 }}>
        Add Service
      </button>

      {services.map((s, i) => (
        <div key={i} style={{ padding: 10, background: "#f0f0f0", marginBottom: 5, borderRadius: 4 }}>
          {s.name} - {s.duration} min
        </div>
      ))}

      <button onClick={next} style={{ padding: "10px 20px", marginTop: 20 }}>
        Next: Availability →
      </button>
    </div>
  );
}
