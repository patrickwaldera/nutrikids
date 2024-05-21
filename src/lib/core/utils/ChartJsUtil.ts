import type { Class } from "../entities/Class";
import type { Record } from "../entities/Record";
import { BmiService } from "../services/BmiService";

export function initializePieChartData(classes: Class[], records: Record[]) {

	const backgroundColors = [
		"#f87171",
		"#fcd34d",
		"#65a30d",
		"#eab308",
		"#ef4444",
		"#dc2626",
		"#b91c1c",
	];

	const hoverColors = [
		"#f05252",
		"#fbbf24",
		"#4d7c0f",
		"#d97706",
		"#dc2f26",
		"#b91f1c",
		"#991b1b",
	];

	let pieChartData: any = [];
	classes.forEach(classe => pieChartData.push({
		id: classe.id,
		className: classe.name,
		counts: {
			"Muito abaixo do peso": 0,
			"Abaixo do peso": 0,
			"Peso normal": 0,
			"Acima do peso": 0,
			"Obesidade grau I": 0,
			"Obesidade grau II": 0,
			"Obesidade grau III": 0
		}
	}))

	records.forEach(record => {
		const status = BmiService.getBmiStatus(record.bmi);
		pieChartData.find((bmiRecord: any) => bmiRecord.id === record.classId)!.counts[status]++;
		
	});

	pieChartData = pieChartData.map((bmiRecord: any) => {
		return {
			classId: bmiRecord.id,
			className: bmiRecord.className,
			data: {
				labels: Object.keys(bmiRecord.counts),
				datasets: [
					{
						data: Object.values(bmiRecord.counts),
						backgroundColor: backgroundColors.slice(0, Object.keys(bmiRecord.counts).length),
						hoverBackgroundColor: hoverColors.slice(0, Object.keys(bmiRecord.counts).length),
					}
				]
			}
		}
	})

	return pieChartData.sort((a: any, b: any) => a.className.localeCompare(b.className));
}