import { useEffect, useState } from "react";

function MechanicDashboard() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(
    null,
  );
  const token = localStorage.getItem("token");

  const statuses = ["Vytvorená", "Začatá", "Ukončená", "Zrušená"];

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/appointment/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((a) => {
    const term = searchTerm.toLowerCase();
    const appointmentDate = new Date(a.appointment_datetime)
      .toISOString()
      .slice(0, 10);

    const matchesSearch =
      a.brand.toLowerCase().includes(term) ||
      a.model.toLowerCase().includes(term) ||
      a.license_plate.toLowerCase().includes(term) ||
      a.status.toLowerCase().includes(term);

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(a.status);

    const matchesDateFrom = dateFrom ? appointmentDate >= dateFrom : true;
    const matchesDateTo = dateTo ? appointmentDate <= dateTo : true;

    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:5001/api/appointment/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmCancelAppointment = (id: number) => setAppointmentToCancel(id);
  const cancelCancel = () => setAppointmentToCancel(null);

  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;
    try {
      await fetch(
        `http://localhost:5001/api/appointment/${appointmentToCancel}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setAppointmentToCancel(null);
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  const toggleStatus = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b mt-5 from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <label className="block text-gray-800 font-semibold text-lg">
            Hľadať objednávky
          </label>
          <input
            type="text"
            placeholder="Vyhľadať podľa auta, ŠPZ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
          />

          <label className="block text-gray-800 font-semibold text-lg">
            Status
          </label>
          <div className="flex flex-wrap gap-3">
            {statuses.map((status) => (
              <label key={status} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => toggleStatus(status)}
                  className="w-4 h-4"
                />
                <span className="text-gray-700">{status}</span>
              </label>
            ))}
          </div>

          <label className="block text-gray-800 font-semibold text-lg">
            Dátum
          </label>
          <div className="flex gap-3">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none"
            />
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-50 gap-y-10 mt-5 justify-items-center">
          {filteredAppointments.map((a) => {
            const canModify = a.status === "Vytvorená";
            return (
              <div
                key={a.appointment_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200 min-w-[400px]"
              >
                <div className="bg-[#78e778] h-12 flex items-center px-4">
                  <span className="text-white font-bold text-lg">
                    {a.brand} {a.model}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-gray-600 font-medium">
                    ŠPZ: {a.license_plate}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Dátum:{" "}
                    {new Date(a.appointment_datetime).toLocaleDateString(
                      "sk-SK",
                    )}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Čas:{" "}
                    {new Date(a.appointment_datetime).toLocaleTimeString(
                      "sk-SK",
                      { hour: "2-digit", minute: "2-digit" },
                    )}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Status: <span className="font-semibold">{a.status}</span>
                  </p>
                  <p className="text-gray-600 font-medium">
                    Služby:{" "}
                    {a.services?.map((s: any) => s.service_name).join(", ")}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Poznámky: {a.notes || "—"}
                  </p>

                  <div className="gap-2 mt-4 grid sm:grid-cols-2">
                    {a.status !== "Začatá" &&
                      a.status !== "Zrušená" &&
                      a.status !== "Ukončená" && (
                        <button
                          onClick={() =>
                            updateStatus(a.appointment_id, "Začatá")
                          }
                          className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium"
                        >
                          Začať opravu
                        </button>
                      )}
                    {a.status !== "Ukončená" && a.status !== "Zrušená" && (
                      <button
                        onClick={() =>
                          updateStatus(a.appointment_id, "Ukončená")
                        }
                        className="flex-1 px-3 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 font-medium"
                      >
                        Dokončiť
                      </button>
                    )}
                    {canModify &&
                      (appointmentToCancel === a.appointment_id ? (
                        <div className="flex gap-2 flex-1">
                          <button
                            onClick={handleCancelAppointment}
                            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                          >
                            Potvrdiť zrušenie
                          </button>
                          <button
                            onClick={cancelCancel}
                            className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                          >
                            Zrušiť
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            confirmCancelAppointment(a.appointment_id)
                          }
                          className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium"
                        >
                          Zrušiť objednávku
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MechanicDashboard;
