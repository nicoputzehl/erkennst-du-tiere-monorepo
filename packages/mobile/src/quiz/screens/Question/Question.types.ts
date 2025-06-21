export interface QuestionInputActions {
	onChangeText: (text: string) => void;
	onSubmit: () => void;
	onClear: () => void;
	onFocus?: () => void;
	onBlur?: () => void;
}

export interface QuestionInputProps extends QuestionInputActions {
	value: string;
	isSubmitting?: boolean;
	hasError?: boolean;
	placeholder?: string;
	maxLength?: number;
	autoFocus?: boolean;
}

export type WrongAnswerHint = {
	title: string;
	content: string;
};
