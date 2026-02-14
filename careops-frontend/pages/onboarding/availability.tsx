import { useState } from "react";
import { useRouter } from "next/router";
import api from "../../src/lib/api";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AvailabilityPage() {
  const router = useRouter();
  const [slots, setSlots] = useState<any[]>([]);
  const [day, setDay] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const addSlot = async () => {
    const serviceId = localStorage.getItem("serviceId");
    const res = await api.post(`/services/${serviceId}/availability`, {
      dayOfWeek: parseInt(day),
      startTime,
      endTime,
    });
    setSlots([...slots, { day: DAYS[parseInt(day)], startTime, endTime }]);
  };

  const next = () => {
    if (slots.length === 0) {
      alert("Add at least one availability slot");
      return;
    }
    router.push("/onboarding/complete");
  };

  return (
    <div style={{ padding: 40, maxWidth: 600, margin: "0 auto" }}>
      <h2>Step 4: Availability</h2>
      <p>Set your working hours</p>

      <select value={day} onChange={(e) => setDay(e.target.value)} style={{ width: "100%", padding: 8, marginBottom: 10 }}>
        {DAYS.map((d, i) => (
          <option key={i} value={i}>{d}</option>
        ))}
      </select>
      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        style={{ width: "48%", padding: 8, marginBottom: 10, marginRight: "4%" }}
      />
      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        style={{ width: "48%", padding: 8, marginBottom: 10 }}
      />
      <button onClick={addSlot} style={{ padding: "8px 16px", marginBottom: 20 }}>
        Add Slot
      </button>

      {slots.map((s, i) => (
        <div key={i} style={{ padding: 10, background: "#f0f0f0", marginBottom: 5, borderRadius: 4 }}>
          {s.day}: {s.startTime} - {s.endTime}
        </div>
      ))}

      <button onClick={next} style={{ padding: "10px 20px", marginTop: 20 }}>
        Complete Setup →
      </button>
    </div>
  );
}
