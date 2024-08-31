import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { InterpolationMap, TOptionsBase } from "i18next";
import { $Dictionary } from "i18next/typescript/helpers";

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
export function useI18MemoObject (
	terms: string[],
	ns: string | undefined = "common",
	options: OptionsType = undefined
): object[] {
	const { t } = useTranslation(ns);
	return useMemo(() => {
		const opts = options ? {...options} : {};
		return terms.map(term => t(term, {...opts, returnObjects: true}));
	}, [terms, options, t]);
};
