import { useEffect, useState } from "react";

function BookAppointment() {
  const [cars, setCars] = useState<
    { car_id: number; brand: string; model: string; license_plate: string }[]
  >([]);
  const [services, setServices] = useState<
    { service_id: number; service_name: string }[]
  >([]);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [appointmentToCancel, setAppointmentToCancel] = useState<number | null>(
    null
  );

  const [selectedCar, setSelectedCar] = useState<number | null>(null);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [appointmentTime, setAppointmentTime] = useState("");
  const [notes, setNotes] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success"
  );

  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");

  const filteredAppointments = appointments.filter((a) => {
    const term = searchTerm.toLowerCase();
    return (
      a.brand.toLowerCase().includes(term) ||
      a.model.toLowerCase().includes(term) ||
      a.license_plate.toLowerCase().includes(term) ||
      a.status.toLowerCase().includes(term)
    );
  });

  const fetchCars = async () => {
    const res = await fetch("http://localhost:5001/api/vehicles", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCars(data);
  };

  const fetchServices = async () => {
    const res = await fetch("http://localhost:5001/api/appointment/services", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setServices(data);
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/appointment", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAvailableTimes = async (date: string) => {
    if (!date) return setAvailableTimes([]);
    try {
      const res = await fetch(
        `http://localhost:5001/api/appointment/available-times?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAvailableTimes(data);
      setAppointmentTime("");
    } catch {
      setAvailableTimes([]);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchServices();
    fetchAppointments();
  }, []);

  useEffect(() => {
    fetchAvailableTimes(appointmentDate);
  }, [appointmentDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedCar ||
      selectedServices.length === 0 ||
      !appointmentDate ||
      !appointmentTime
    ) {
      setMessageType("error");
      setMessage("Vyplňte všetky údaje.");
      return;
    }

    const url = "http://localhost:5001/api/appointment";
    const method = "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car_id: selectedCar,
          services: selectedServices,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          notes,
        }),
      });

      if (!res.ok) throw new Error();

      setMessageType("success");
      setMessage("Objednávka bola vytvorená.");

      setSelectedCar(null);
      setSelectedServices([]);
      setAppointmentDate("");
      setAppointmentTime("");
      setNotes("");
      setAvailableTimes([]);

      fetchAppointments();
    } catch {
      setMessageType("error");
      setMessage("Nepodarilo sa uložiť objednávku.");
    }
  };

  const toggleService = (serviceId: number) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
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
        }
      );
      setAppointmentToCancel(null);
      fetchAppointments();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b mt-5 from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-xl/25 mt-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">
          Rezervácia termínu
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Vyberte auto
            </label>
            <select
              value={selectedCar || ""}
              onChange={(e) => setSelectedCar(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            >
              <option value="">-- Vyberte auto --</option>
              {cars.map((car) => (
                <option key={car.car_id} value={car.car_id}>
                  {car.brand} {car.model} ({car.license_plate})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Vyberte služby
            </label>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.service_id}>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.service_id)}
                      onChange={() => toggleService(service.service_id)}
                      className="mr-2"
                    />
                    {service.service_name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Dátum
            </label>
            <input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Čas</label>
            <select
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            >
              <option value="">-- Vyberte čas --</option>
              {availableTimes.length > 0 ? (
                availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))
              ) : (
                <option disabled>Žiadne voľné časy</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Poznámky
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />
          </div>

          <button className="w-full mt-4 px-4 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold hover:bg-[#78e778] hover:text-white transition">
            Vytvoriť objednávku
          </button>

          {message && (
            <p
              className={`text-center mt-4 ${
                messageType === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
      <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-6">
        <label className="block text-gray-800 font-semibold text-lg mb-2">
          Hľadať objednávky
        </label>
        <input
          type="text"
          placeholder="Vyhľadať podľa auta, SPZ, statusu alebo dátumu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#78e778] focus:outline-none shadow-sm placeholder-gray-400 transition-all duration-200 hover:shadow-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20 mt-5">
        {filteredAppointments.map((a: any) => {
          const canModify = a.status === "Vytvorená";
          return (
            <div
              key={a.appointment_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
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
                  {"Dátum: "}
                  {new Date(a.appointment_datetime).toLocaleDateString("sk-SK")}
                </p>

                <p className="text-gray-600 font-medium">
                  {"Čas: "}
                  {new Date(a.appointment_datetime).toLocaleTimeString(
                    "sk-SK",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>

                <p className="text-gray-600 font-medium">
                  Status: <span className="font-semibold">{a.status}</span>
                </p>

                <p className="text-gray-600 font-medium">
                  Poznámky: {a.notes || "—"}
                </p>
                {canModify && (
                  <div className="flex gap-2 mt-4">
                    {appointmentToCancel === a.appointment_id ? (
                      <div className="flex gap-2 flex-1">
                        <button
                          onClick={handleCancelAppointment}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                          Potvrdiť
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
                        Zrušiť
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BookAppointment;
