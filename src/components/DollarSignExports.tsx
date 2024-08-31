import i18n from "../i18n";

export const $q =
	<T extends HTMLElement>(query: string, doc: Document | HTMLElement = window.document): T | null =>
		doc.querySelector(query) as T | null;
export const $a =
	<T extends HTMLElement>(query: string, doc: Document | HTMLElement = window.document): T[] =>
		Array.from(doc.querySelectorAll(query)) as T[];
export const $i =
	<T extends HTMLElement>(query: string, doc = window.document): T | null =>
		doc.getElementById(query) as T | null;
// Wrap setTimeout in a Promise
type WrappedPromise = (ms: number) => Promise<ReturnType<typeof setTimeout>>
export const $delay: WrappedPromise = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
// Oxford comma
export const $and = (array: string[], glue_: string = "", and_: string = ""): string => {
	const input = array.slice();
	if(input.length < 2) {
		return input.join(" ");
	} else if (input.length === 2) {
		return and_ ? input.join(and_) : i18n.t("joinTwo", { one: input[0], two: input[1] });
	}
	const last = input.pop()!;
	const glue = glue_ || i18n.t("andGlue");
	const and = and_ || i18n.t("andFinal");
	return input.join(glue) + `${and}${last}`;
};
