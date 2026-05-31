export const runBRE = (
  dob: string,
  salary: number,
  pan: string,
  employmentMode: string,
) => {
  const age = new Date().getFullYear() - new Date(dob).getFullYear();

  if (age < 23 || age > 50) {
    return {
      passed: false,
      message: "Age must be between 23 and 50[cite: 1]",
    };
  }

  if (salary < 25000) {
    return {
      passed: false,
      message: "Salary must be at least ₹25000[cite: 1]",
    };
  }

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;

  if (!panRegex.test(pan)) {
    return {
      passed: false,
      message: "Invalid PAN format[cite: 1]",
    };
  }

  if (!employmentMode || employmentMode.toUpperCase() === "UNEMPLOYED") {
    return {
      passed: false,
      message: "Employment status is not eligible for a loan[cite: 1]",
    };
  }

  return {
    passed: true,
  };
};
