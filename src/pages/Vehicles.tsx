import { useState, useEffect } from "react";
import { IoCar } from "react-icons/io5";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [vehicleToDelete, setVehicleToDelete] = useState<number | null>(null);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [year, setYear] = useState("");
  const [vin, setVin] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [mileage, setMileage] = useState("");
  const [color, setColor] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"error" | "success">(
    "success"
  );

  const token = localStorage.getItem("token");

  const fetchVehicles = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/vehicles", {
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
    setLicensePlate("");
    setYear("");
    setVin("");
    setFuelType("");
    setMileage("");
    setColor("");
    setSelectedVehicle(null);
  };

  const validateInputs = () => {
    const currentYear = new Date().getFullYear();

    if (!brand || !model || !fuelType) {
      setMessageType("error");
      setMessage("Značka, model a typ paliva sú povinné.");
      return false;
    }

    if (year) {
      const yearNum = Number(year);
      if (isNaN(yearNum)) {
        setMessageType("error");
        setMessage("Rok výroby musí byť číslo.");
        return false;
      }
      if (yearNum < 1900 || yearNum > currentYear) {
        setMessageType("error");
        setMessage(`Rok výroby musí byť medzi 1900 a ${currentYear}.`);
        return false;
      }
    }

    if (mileage) {
      const mileageNum = Number(mileage);
      if (isNaN(mileageNum)) {
        setMessageType("error");
        setMessage("Najazdené km musí byť číslo.");
        return false;
      }
      if (mileageNum < 0) {
        setMessageType("error");
        setMessage("Najazdené km nemôžu byť záporné.");
        return false;
      }
    }

    if (vin && vin.length !== 17) {
      setMessageType("error");
      setMessage("VIN musí mať presne 17 znakov.");
      return false;
    }

    if (licensePlate && licensePlate.length < 5) {
      setMessageType("error");
      setMessage("ŠPZ musí mať aspoň 5 znakov.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const url = selectedVehicle
      ? `http://localhost:5001/api/vehicles/${selectedVehicle.car_id}`
      : "http://localhost:5001/api/vehicles";

    const method = selectedVehicle ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          brand,
          model,
          license_plate: licensePlate || null,
          year: year || null,
          vin: vin || null,
          fuel_type: fuelType,
          mileage: mileage || null,
          color: color || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessageType("error");
        setMessage(data.message || "Chyba pri ukladaní vozidla.");
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

  const confirmDeleteVehicle = (car_id: number) => {
    setVehicleToDelete(car_id);
  };

  const handleDelete = async () => {
    if (!vehicleToDelete) return;

    try {
      await fetch(`http://localhost:5001/api/vehicles/${vehicleToDelete}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicleToDelete(null);
      fetchVehicles();
    } catch (err) {
      console.log(err);
    }
  };

  const cancelDelete = () => setVehicleToDelete(null);

  const startEdit = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setBrand(vehicle.brand);
    setModel(vehicle.model);
    setLicensePlate(vehicle.license_plate || "");
    setYear(vehicle.year || "");
    setVin(vehicle.vin || "");
    setFuelType(vehicle.fuel_type || "");
    setMileage(vehicle.mileage || "");
    setColor(vehicle.color || "");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#d8f5d8] via-[#b8f0b8] to-[#78e778] px-4 py-10">
      <div className="max-w-6xl mx-auto py-10">
        <div className="bg-white p-4 rounded-xl shadow-xl/25 mb-10 mt-5 max-w-2xl mx-auto ">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Správa vozidiel
          </h2>
        </div>
        <form
          className="bg-white p-6 rounded-xl shadow-xl/25 mb-10 max-w-2xl mx-auto"
          onSubmit={handleSubmit}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {selectedVehicle ? "Upraviť vozidlo" : "Pridať nové vozidlo"}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="Značka"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />
            <input
              type="text"
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black bg-white"
            >
              <option value="">Vyber typ paliva</option>
              <option value="Benzín">Benzín</option>
              <option value="Nafta">Nafta</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="ŠPZ"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />
            <input
              type="text"
              placeholder="Rok výroby"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />

            <input
              type="text"
              placeholder="Najazdené km"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              placeholder="VIN"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
            />
            <input
              type="text"
              placeholder="Farba"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#78e778] focus:outline-none text-black"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.length === 0 ? (
            <p className="text-gray-700 col-span-full text-center">
              Žiadne vozidlá zatiaľ.
            </p>
          ) : (
            vehicles.map((v: any) => (
              <div
                key={v.car_id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-200"
              >
                <div className="bg-[#78e778] h-12 flex items-center px-4">
                  <IoCar className="text-2xl text-white mr-3" />
                  <h4 className="text-white font-bold text-lg">
                    {v.brand} {v.model} ({v.year || "—"})
                  </h4>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-gray-600 font-medium">
                    ŠPZ: {v.license_plate || "—"}
                  </p>
                  <p className="text-gray-600 font-medium">
                    VIN: {v.vin || "—"}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Palivo: {v.fuel_type || "—"}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Farba: {v.color || "—"}
                  </p>
                  <p className="text-gray-600 font-medium">
                    Najazdené km: {v.mileage || "—"}
                  </p>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => startEdit(v)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 font-medium"
                    >
                      Upraviť
                    </button>

                    {vehicleToDelete === v.car_id ? (
                      <div className="flex gap-2 flex-1">
                        <button
                          onClick={handleDelete}
                          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                        >
                          Potvrdiť
                        </button>
                        <button
                          onClick={cancelDelete}
                          className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                        >
                          Zrušiť
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => confirmDeleteVehicle(v.car_id)}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-medium"
                      >
                        Odstrániť
                      </button>
                    )}
                  </div>
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
