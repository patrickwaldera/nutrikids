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
		return "";
	}
}

export function convertDateToDDMMYYYY(date: string) {
	try {
		const parts = date.split("-");
		return `${parts[2]}/${parts[1]}/${parts[0]}`;
	} catch (error) {
		return "";
	}
}

export function calculateAge(dateOfBirth: string) {
    const [day, month, year] = dateOfBirth.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();

    const currentMonth = today.getMonth();
    const currentDay = today.getDate();
    if (currentMonth < month - 1 || (currentMonth === month - 1 && currentDay < day)) {
        age--;
    }

    return age;
}