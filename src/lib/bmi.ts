export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return parseFloat(bmi.toFixed(2));
}

export function interpretBMI(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 23) return "Normal";
  if (bmi < 25) return "Overweight";
  if (bmi < 30) return "Obese Class 1";
  return "Obese Class 2";
}
