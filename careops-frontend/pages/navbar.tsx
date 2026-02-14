import { useRouter } from "next/router";

export default function NavBar() {
  const router = useRouter();

  return (
    <div style={{ background: "#343a40", padding: "15px 40px", color: "white" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ margin: 0, cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
          CareOps
        </h2>
        <div style={{ display: "flex", gap: 20 }}>
          <a onClick={() => router.push("/dashboard")} style={{ color: "white", cursor: "pointer" }}>
            Dashboard
          </a>
          <a onClick={() => router.push("/inbox")} style={{ color: "white", cursor: "pointer" }}>
            Inbox
          </a>
          <a onClick={() => router.push("/staff-bookings")} style={{ color: "white", cursor: "pointer" }}>
            Bookings
          </a>
          <a onClick={() => router.push("/inventory")} style={{ color: "white", cursor: "pointer" }}>
            Inventory
          </a>
        </div>
      </div>
    </div>
  );
}
