export class BmiService {
	public static calculateBmi(weight: number, height: number): number | null {
		if (weight > 0 && height > 0) {
			return parseFloat((weight / ((height / 100) ** 2)).toFixed(2));
		} else {
			return null;
		}
	}

	public static getBmiStatus(imc: number): string {
        if (imc <= 16.9) return "Muito abaixo do peso";
		if (imc >= 17 && imc <= 18.4) return "Abaixo do peso";
		if (imc >= 18.5 && imc <= 24.9) return "Peso normal";
		if (imc >= 25 && imc <= 29.9) return "Sobrepeso";
		if (imc >= 30 && imc <= 34.9) return "Obesidade grau I";
		if (imc >= 35 && imc <= 39.9) return "Obesidade grau II";
		if (imc >= 40) return "Obesidade grau III";
		return "";
	}
}