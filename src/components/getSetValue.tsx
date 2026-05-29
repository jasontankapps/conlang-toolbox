function getSetValue (input: HTMLIonInputElement | HTMLIonTextareaElement | null, toSet: string): void;
function getSetValue (input: HTMLIonInputElement | HTMLIonTextareaElement | null): string;
function getSetValue (input: HTMLIonInputElement | HTMLIonTextareaElement | null, toSet?: string): string | void {
	if(toSet !== undefined) {
		if(!input) {
			return;
		}
		input.value = toSet;
		input.getInputElement().then(el => el.value = toSet);
		return;
	} else if (!input) {
		return "";
	}
	const v = input.value;
	if(v === null || v === undefined) {
		return "";
	}
	return String(v);
};

export default getSetValue;

