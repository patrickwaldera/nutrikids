export function getMonthName(currentYear: number, month: number) {
	const date = new Date(currentYear, month - 1, 1);
	return date.toLocaleString('pt-BR', { month: 'long' });
}

export function formatDateToYYYYMMDD(date: Date) {
    return date.toISOString().split('T')[0];
}

export function validateDateFormat(date: string) {
	const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

	if (!regex.test(date)) {
		return false;
	}

	const [day, month, year] = date.split('/').map(Number);

	const dateObj = new Date(year, month - 1, day);

	if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
    ) {
        return false;
    }

	return true;
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

export function formatDateInput(event: Event) {
    let value = (event.target as HTMLInputElement).value;
    value = value.replace(/\D/g, '');

    if (value.length > 8) {
        value = value.substring(0, 8);
    }

    if (value.length > 2 && value.length <= 4) {
        value = value.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (value.length > 4) {
        value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }

    (event.target as HTMLInputElement).value = value;
}