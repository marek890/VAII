import { useState, useEffect } from "react";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success"
  );

  const token = localStorage.getItem("token");

  const fetchVehicles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const resetForm = () => {
    setBrand("");
    setModel("");
    setYear("");
    setVin("");
    setSelectedVehicle(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!brand || !model || !year || !vin) {
      setMessageType("error");
      setMessage("Vyplň všetky údaje.");
      return;
    }

    const url = selectedVehicle
      ? `http://localhost:5000/api/vehicles/${selectedVehicle.id}`
      : "http://localhost:5000/api/vehicles";

    const method = selectedVehicle ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ brand, model, year, vin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.error || "Chyba pri ukladaní vozidla.");
        return;
      }

      setMessageType("success");
      setMessage(
        selectedVehicle ? "Vozidlo aktualizované!" : "Vozidlo pridané!"
      );

      resetForm();
      fetchVehicles();
    } catch (err) {
      setMessageType("error");
      setMessage("Nepodarilo sa spojiť so serverom.");
    }
  };

  const deleteVehicle = async (id: number) => {
    if (!confirm("Naozaj chceš odstrániť toto vozidlo?")) return;

    try {
      await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchVehicles();
    } catch (err) {
      console.log(err);
    }
  };

  const startEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setYear(vehicle.year);
    setVin(vehicle.vin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 py-10">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl/25 w-full max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-6">
          Správa vozidiel
        </h2>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Značka (Škoda)"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] text-black"
            />
            <input
              type="text"
              placeholder="Model (Octavia)"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] text-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Rok (napr. 2018)"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] text-black"
            />
            <input
              type="text"
              placeholder="VIN"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-500 font-semibold transition-all duration-200 hover:bg-[#78e778] hover:text-white hover:shadow-lg"
          >
            {selectedVehicle ? "Uložiť zmeny" : "Pridať vozidlo"}
          </button>

          {message && (
            <p
              className={`text-center mt-2 ${
                messageType === "error" ? "text-red-500" : "text-green-500"
              }`}
            >
              {message}
            </p>
          )}
        </form>

        <h3 className="text-xl font-bold text-gray-800 mt-8">Moje vozidlá</h3>

        <div className="mt-4 space-y-4">
          {vehicles.length === 0 ? (
            <p className="text-gray-500 text-center">Žiadne vozidlá zatiaľ.</p>
          ) : (
            vehicles.map((v: any) => (
              <div
                key={v.id}
                className="p-4 rounded-lg border shadow-sm flex items-center justify-between bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-700">
                    {v.brand} {v.model}
                  </p>
                  <p className="text-sm text-gray-500">
                    Rok: {v.year} | VIN: {v.vin}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(v)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                  >
                    Upraviť
                  </button>

                  <button
                    onClick={() => deleteVehicle(v.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  >
                    Odstrániť
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Vehicles;
