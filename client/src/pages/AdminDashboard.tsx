import { useEffect, useState } from "react";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
};

type Car = {
  car_id: number;
  brand: string;
  model: string;
  license_plate: string;
  owner_name: string;
};

type Appointment = {
  appointment_id: number;
  brand: string;
  model: string;
  license_plate: string;
  customer_name: string;
  appointment_datetime: string;
  status: string;
  notes: string;
  services: { service_name: string }[];
};

function AdminDashboard() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [activeTab, setActiveTab] = useState<"users" | "cars" | "appointments">(
    "users"
  );

  const statuses = ["Vytvorená", "Začatá", "Ukončená", "Zrušená"];
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5001/api/admin/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setUsers(data);
  };

  const fetchCars = async () => {
    const res = await fetch("http://localhost:5001/api/admin/vehicles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCars(data);
  };

  const fetchAppointments = async () => {
    const res = await fetch("http://localhost:5001/api/admin/appointments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setAppointments(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchCars();
    fetchAppointments();
  }, []);

  const updateUser = async (user_id: number, field: string, value: string) => {
    await fetch(`http://localhost:5001/api/admin/users/${user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [field]: value }),
    });
    fetchUsers();
  };

  const updateAppointmentStatus = async (id: number, status: string) => {
    await fetch(`http://localhost:5001/api/admin/appointments/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchAppointments();
  };

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(a.status);
    const appointmentDate = a.appointment_datetime.split("T")[0];
    const matchesDateFrom = !dateFrom || appointmentDate >= dateFrom;
    const matchesDateTo = !dateTo || appointmentDate <= dateTo;
    return matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="min-h-screen bg-linear-to-b mt-5 from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-3">
          <h1 className="text-4xl font-bold text-center">Admin panel</h1>
        </div>
        <div className="flex justify-center gap-4 mb-5 mt-5">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-xl font-semibold hover:bg-[#78e778] hover:text-white transition ${
              activeTab === "users"
                ? "bg-[#78e778] text-white"
                : "bg-white text-gray-700 shadow"
            }`}
          >
            Používatelia
          </button>
          <button
            onClick={() => setActiveTab("cars")}
            className={`px-4 py-2 rounded-xl font-semibold hover:bg-[#78e778] hover:text-white transition ${
              activeTab === "cars"
                ? "bg-[#78e778] text-white"
                : "bg-white text-gray-700 shadow"
            }`}
          >
            Vozidlá
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-2 rounded-xl font-semibold hover:bg-[#78e778] hover:text-white transition ${
              activeTab === "appointments"
                ? "bg-[#78e778] text-white"
                : "bg-white text-gray-700 shadow"
            }`}
          >
            Rezervácie
          </button>
        </div>

        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Meno</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Akcie</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b">
                    <td className="p-2">
                      <input
                        type="text"
                        value={u.name}
                        onChange={(e) =>
                          updateUser(u.user_id, "name", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="email"
                        value={u.email}
                        onChange={(e) =>
                          updateUser(u.user_id, "email", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateUser(u.user_id, "role", e.target.value)
                        }
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="customer">Customer</option>
                        <option value="mechanic">Mechanic</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() =>
                          updateUser(u.user_id, "deactivate", "true")
                        }
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Deaktivovať
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "cars" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Značka</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">ŠPZ</th>
                  <th className="p-3">Vlastník</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((c) => (
                  <tr key={c.car_id} className="border-b">
                    <td className="p-2">{c.brand}</td>
                    <td className="p-2">{c.model}</td>
                    <td className="p-2">{c.license_plate}</td>
                    <td className="p-2">{c.owner_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap gap-4 mb-4 items-center">
              <div>
                <label className="block font-semibold mb-1">Status</label>
                <div className="flex gap-2 flex-wrap">
                  {statuses.map((status) => (
                    <label key={status} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(status)}
                        onChange={() => toggleStatus(status)}
                        className="w-4 h-4"
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Dátum od</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Dátum do</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="border px-2 py-1 rounded"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-3">Auto</th>
                    <th className="p-3">ŠPZ</th>
                    <th className="p-3">Zákazník</th>
                    <th className="p-3">Dátum</th>
                    <th className="p-3">Čas</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Služby</th>
                    <th className="p-3">Poznámky</th>
                    <th className="p-3">Akcie</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((a) => (
                    <tr key={a.appointment_id} className="border-b">
                      <td className="p-2">
                        {a.brand} {a.model}
                      </td>
                      <td className="p-2">{a.license_plate}</td>
                      <td className="p-2">{a.customer_name}</td>
                      <td className="p-2">
                        {new Date(a.appointment_datetime).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        {new Date(a.appointment_datetime).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" }
                        )}
                      </td>
                      <td className="p-2">
                        <select
                          value={a.status}
                          onChange={(e) =>
                            updateAppointmentStatus(
                              a.appointment_id,
                              e.target.value
                            )
                          }
                          className="border px-2 py-1 rounded"
                        >
                          {statuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        {a.services?.map((s) => s.service_name).join(", ")}
                      </td>
                      <td className="p-2">{a.notes}</td>
                      <td className="p-2">
                        <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                          Zrušiť
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
