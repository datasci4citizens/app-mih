import { toast } from '@/hooks/use-toast';

type ApiErrorLike = {
	response?: {
		data?: {
			detail?: string;
			message?: string;
			non_field_errors?: string[];
		};
	};
	message?: string;
};

export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro inesperado. Tente novamente mais tarde.'): string {
	const apiError = error as ApiErrorLike | undefined;
	const data = apiError?.response?.data;

	if (typeof data?.detail === 'string' && data.detail.trim()) {
		return data.detail;
	}

	if (typeof data?.message === 'string' && data.message.trim()) {
		return data.message;
	}

	if (Array.isArray(data?.non_field_errors) && data.non_field_errors.length > 0) {
		return data.non_field_errors[0] || fallback;
	}

	if (typeof apiError?.message === 'string' && apiError.message.trim()) {
		return apiError.message;
	}

	return fallback;
}

export function notifyApiError(error: unknown, fallback?: string): void {
	toast({
		variant: 'destructive',
		title: 'Erro',
		description: getApiErrorMessage(error, fallback),
	});
}