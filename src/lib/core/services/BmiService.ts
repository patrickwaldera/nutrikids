const bmiPercentileTable: Record<number, Record<number, number>> = {
    1: { 3: 14.0, 5: 14.2, 85: 18.0, 95: 18.8, 97: 19.4, 99: 20.1 },
    2: { 3: 14.1, 5: 14.3, 85: 18.2, 95: 19.0, 97: 19.6, 99: 20.3 },
    3: { 3: 14.2, 5: 14.4, 85: 18.3, 95: 19.1, 97: 19.7, 99: 20.4 },
    4: { 3: 14.3, 5: 14.5, 85: 18.4, 95: 19.2, 97: 19.8, 99: 20.5 },
    5: { 3: 13.1, 5: 13.3, 85: 17.5, 95: 18.3, 97: 18.9, 99: 19.6 },
    6: { 3: 13.4, 5: 13.6, 85: 18.1, 95: 19.0, 97: 19.6, 99: 20.3 },
    7: { 3: 13.7, 5: 13.9, 85: 18.6, 95: 19.5, 97: 20.1, 99: 20.8 },
    8: { 3: 14.0, 5: 14.2, 85: 19.1, 95: 20.0, 97: 20.6, 99: 21.3 },
    9: { 3: 14.3, 5: 14.5, 85: 19.6, 95: 20.5, 97: 21.1, 99: 21.8 },
    10: { 3: 14.6, 5: 14.8, 85: 20.1, 95: 21.0, 97: 21.6, 99: 22.3 }
};

export class BmiService {
	public static calculateBmi(weight: number, height: number): number | null {
		if (weight > 0 && height > 0) {
			return parseFloat((weight / ((height / 100) ** 2)).toFixed(2));
		} else {
			return null;
		}
	}

	public static getBmiStatus(age: number, bmi: number): string {
		const percentiles = bmiPercentileTable[age];
		if (!percentiles) return "";

        if (bmi < percentiles[3]) return "Muito abaixo do peso";
        if (bmi < percentiles[5]) return "Abaixo do peso";
        if (bmi < percentiles[85]) return "Peso normal";
        if (bmi < percentiles[95]) return "Acima do peso";
        if (bmi < percentiles[97]) return "Obesidade grau I";
        if (bmi < percentiles[99]) return "Obesidade grau II";
        return "Obesidade grau III";
	}
}