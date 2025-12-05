export const validateVehicleData = (data) => {
  const errors = [];

  const { brand, model, license_plate, year, vin, fuel_type, mileage, color } =
    data;

  if (!brand?.trim()) errors.push("Značka je povinná.");
  if (!model?.trim()) errors.push("Model je povinný.");
  if (!fuel_type?.trim()) errors.push("Typ paliva je povinný.");

  if (
    year !== undefined &&
    year !== null &&
    year !== "" &&
    !Number.isInteger(Number(year))
  ) {
    errors.push("Rok výroby musí byť celé číslo.");
  }

  if (
    mileage !== undefined &&
    mileage !== null &&
    mileage !== "" &&
    !Number.isInteger(Number(mileage))
  ) {
    errors.push("Najazdené km musí byť celé číslo.");
  }

  if (license_plate && license_plate.length < 5) {
    errors.push("ŠPZ musí mať min 5 znakov.");
  }

  if (year && year < 1900) {
    errors.push("Rok výroby musí byť vyšší ako 1900");
  }

  if (vin && vin.length !== 17) {
    errors.push("VIN musí mať presne 17 znakov.");
  }

  if (color && color.length > 20) {
    errors.push("Farba môže mať max 20 znakov.");
  }

  return errors;
};
