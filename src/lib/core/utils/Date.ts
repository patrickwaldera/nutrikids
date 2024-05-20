export function getMonthName(currentYear: number, month: number) {
	const date = new Date(currentYear, month - 1, 1);
	return date.toLocaleString('pt-BR', { month: 'long' });
}

export function formatDateToYYYYMMDD(date: Date) {
    return date.toISOString().split('T')[0];
}