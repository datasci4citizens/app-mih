/**
 * Date utility functions
 */

/**
 * Calculate age from birthday
 * @param birthday - Date string in ISO format or Date object
 * @returns Age in years
 */
export function calculateAge(birthday: string | Date): number {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

/**
 * Format date to Brazilian format (DD/MM/YYYY)
 * @param date - Date string or Date object
 * @returns Formatted date string
 */
export function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString('pt-BR');
}

/**
 * Format date and time to Brazilian format
 * @param date - Date string or Date object
 * @returns Formatted date and time string
 */
export function formatDateTime(date: string | Date): string {
    return new Date(date).toLocaleString('pt-BR');
}
