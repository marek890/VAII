import { useEffect, useState } from "react";

type User = {
  user_id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
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
    "users",
  );

  const statuses = ["Vytvorená", "Začatá", "Ukončená", "Zrušená"];
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [carSearch, setCarSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");
  const [carToDelete, setCarToDelete] = useState<number | null>(null);
  const [userToToggle, setUserToToggle] = useState<number | null>(null);
  const roles = ["customer", "mechanic", "admin"];
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

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

  const updateCar = async (car_id: number, field: string, value: string) => {
    await fetch(`http://localhost:5001/api/admin/vehicles/${car_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ [field]: value }),
    });
    fetchCars();
  };

  const deleteCar = async (car_id: number) => {
    await fetch(`http://localhost:5001/api/admin/vehicles/${car_id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setCarToDelete(null);
    fetchCars();
  };

  const confirmDeleteCar = (car_id: number) => {
    setCarToDelete(car_id);
  };

  const cancelDeleteCar = () => {
    setCarToDelete(null);
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

  const toggleUserActive = async (user_id: number, active: boolean) => {
    await fetch(`http://localhost:5001/api/admin/users/${user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ active }),
    });
    setUserToToggle(null);
    fetchUsers();
  };

  const confirmToggleUser = (user_id: number) => {
    setUserToToggle(user_id);
  };

  const cancelToggleUser = () => {
    setUserToToggle(null);
  };

  const toggleRole = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
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
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());

    const matchesRole =
      selectedRoles.length === 0 || selectedRoles.includes(u.role);

    return matchesSearch && matchesRole;
  });

  const filteredCars = cars.filter(
    (c) =>
      c.brand.toLowerCase().includes(carSearch.toLowerCase()) ||
      c.model.toLowerCase().includes(carSearch.toLowerCase()) ||
      c.license_plate.toLowerCase().includes(carSearch.toLowerCase()) ||
      c.owner_name.toLowerCase().includes(carSearch.toLowerCase()),
  );

  const filteredAppointmentsWithSearch = filteredAppointments.filter(
    (a) =>
      a.brand.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.model.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.license_plate.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.customer_name.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.services.some((s) =>
        s.service_name.toLowerCase().includes(appointmentSearch.toLowerCase()),
      ) ||
      (a.notes?.toLowerCase().includes(appointmentSearch.toLowerCase()) ??
        false),
  );

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
            <div className="flex flex-wrap gap-4 mb-4 items-center">
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="Vyhľadať používateľa..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2">Rola</label>
                <div className="flex gap-4 flex-wrap">
                  {roles.map((role) => (
                    <label key={role} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={() => toggleRole(role)}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <table className="min-w-full table-fixed text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Meno</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Rola</th>
                  <th className="p-3">Akcie</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.user_id} className="border-y border-gray-300">
                    <td className={`p-2 ${!u.active ? "opacity-50" : ""}`}>
                      <input
                        type="text"
                        value={u.name}
                        onChange={(e) =>
                          updateUser(u.user_id, "name", e.target.value)
                        }
                        className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
                      />
                    </td>
                    <td className={`p-2 ${!u.active ? "opacity-50" : ""}`}>
                      <input
                        type="email"
                        value={u.email}
                        onChange={(e) =>
                          updateUser(u.user_id, "email", e.target.value)
                        }
                        className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
                      />
                    </td>
                    <td className={`p-2 ${!u.active ? "opacity-50" : ""}`}>
                      <select
                        value={u.role}
                        onChange={(e) =>
                          updateUser(u.user_id, "role", e.target.value)
                        }
                        className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
                      >
                        <option value="customer">Customer</option>
                        <option value="mechanic">Mechanic</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-2">
                      {userToToggle === u.user_id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() =>
                              toggleUserActive(u.user_id, !u.active)
                            }
                            className={`px-3 py-1 rounded-xl text-white transition ${
                              u.active
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-green-600 hover:bg-green-700"
                            }`}
                          >
                            Potvrdiť
                          </button>
                          <button
                            onClick={cancelToggleUser}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition"
                          >
                            Zrušiť
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => confirmToggleUser(u.user_id)}
                          className={`px-3 py-1 rounded-xl transition ${
                            u.active
                              ? "bg-red-100 text-red-600 hover:bg-red-200"
                              : "bg-green-100 text-green-600 hover:bg-green-200"
                          }`}
                        >
                          {u.active ? "Deaktivovať" : "Aktivovať"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "cars" && (
          <div className="bg-white rounded-2xl shadow-xl p-6 overflow-x-auto">
            <div className="mb-3">
              <input
                type="text"
                placeholder="Vyhľadať vozidlo..."
                value={carSearch}
                onChange={(e) => setCarSearch(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
              />
            </div>
            <table className="min-w-full table-fixed text-center">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3">Značka</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">ŠPZ</th>
                  <th className="p-3">Vlastník</th>
                  <th className="p-3">Akcie</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((c) => (
                  <tr key={c.car_id} className="border-y border-gray-300">
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.brand}
                        onChange={(e) =>
                          updateCar(c.car_id, "brand", e.target.value)
                        }
                        className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778]"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="text"
                        value={c.model}
                        onChange={(e) =>
                          updateCar(c.car_id, "model", e.target.value)
                        }
                        className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778]"
                      />
                    </td>

                    <td className="p-2">
                      <input
                        type="text"
                        value={c.license_plate}
                        onChange={(e) =>
                          updateCar(c.car_id, "license_plate", e.target.value)
                        }
                        className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778]"
                      />
                    </td>

                    <td className="p-2 font-semibold text-gray-700">
                      {c.owner_name}
                    </td>

                    <td className="p-2">
                      {carToDelete === c.car_id ? (
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => deleteCar(c.car_id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-xl hover:bg-red-700 transition"
                          >
                            Potvrdiť
                          </button>
                          <button
                            onClick={cancelDeleteCar}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition"
                          >
                            Zrušiť
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => confirmDeleteCar(c.car_id)}
                          className="px-3 py-1 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition"
                        >
                          Vymazať
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "appointments" && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex flex-wrap gap-4 mb-4 items-center">
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Vyhľadať rezerváciu..."
                  value={appointmentSearch}
                  onChange={(e) => setAppointmentSearch(e.target.value)}
                  className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
                />
              </div>
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
                  className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Dátum do</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
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
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointmentsWithSearch.map((a) => (
                    <tr
                      key={a.appointment_id}
                      className="border-y border-gray-300"
                    >
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
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </td>
                      <td className="p-2">
                        <select
                          value={a.status}
                          onChange={(e) =>
                            updateAppointmentStatus(
                              a.appointment_id,
                              e.target.value,
                            )
                          }
                          className="px-2 py-1 w-full border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md mr-13"
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
