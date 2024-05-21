export class BmiService {
	public static calculateBmi(weight: number, height: number): number | null {
		if (weight > 0 && height > 0) {
			return parseFloat((weight / ((height / 100) ** 2)).toFixed(2));
		} else {
			return null;
		}
	}

	public static getBmiStatus(bmi: number): string {
        if (bmi <= 16.9) return "Muito abaixo do peso";
		if (bmi >= 17 && bmi <= 18.4) return "Abaixo do peso";
		if (bmi >= 18.5 && bmi <= 24.9) return "Peso normal";
		if (bmi >= 25 && bmi <= 29.9) return "Acima do peso";
		if (bmi >= 30 && bmi <= 34.9) return "Obesidade grau I";
		if (bmi >= 35 && bmi <= 39.9) return "Obesidade grau II";
		if (bmi >= 40) return "Obesidade grau III";
		return "";
	}
}