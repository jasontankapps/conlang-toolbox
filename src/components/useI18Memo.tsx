import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InterpolationMap, TOptionsBase } from "i18next";

type $Dictionary = { [key: string]: unknown };

type OptionsType = (TOptionsBase & $Dictionary & InterpolationMap<string>) | undefined;

// useI18Memo(string[], ns = "common", options?)
//   Returns array of strings: memoized translations of the given strings in the given namespace
function useI18Memo (
	terms: string[],
	ns: string | undefined = "common",
	options: OptionsType = undefined
) {
	const { t } = useTranslation(ns);
	return useMemo(() => {
		return terms.map(term => t(term, options));
	}, [terms, options, t]);
};

export default useI18Memo;

// useI18Memo(string[], ns = "common", options?)
//   Returns array of objects: memoized translations of the given strings in the given namespace
export function useI18MemoObject<T extends object> (
	terms: string[],
	ns: string | undefined = "common",
	options: OptionsType = undefined
): T[] {
	const { t } = useTranslation(ns);
	return useMemo(() => {
		const opts = options ? {...options} : {};
		return terms.map(term => t(term, {...opts, returnObjects: true}) as T);
	}, [terms, options, t]);
};
