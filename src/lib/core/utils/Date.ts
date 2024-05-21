export function getMonthName(currentYear: number, month: number) {
	const date = new Date(currentYear, month - 1, 1);
	return date.toLocaleString('pt-BR', { month: 'long' });
}

export function formatDateToYYYYMMDD(date: Date) {
    return date.toISOString().split('T')[0];
}

export function validateDateFormat(date: string) {
	const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
	return regex.test(date);
}

export function convertDateToYYYYMMDD(date: string) {
	try {
		const parts = date.split("/");
		return `${parts[2]}-${parts[1]}-${parts[0]}`;
	} catch (error) {
		throw error;
	}
}

export function convertDateToDDMMYYYY(date: string) {
	try {
		const parts = date.split("-");
		return `${parts[2]}/${parts[1]}/${parts[0]}`;
	} catch (error) {
		throw error;
	}
}