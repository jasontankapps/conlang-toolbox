import { TOptionsBase, InterpolationMap } from 'i18next';
import { $Dictionary } from 'i18next/typescript/helpers';

import i18n from "../i18n"

// Sadly, will only return 'string' results, according to Typescript...

// tc('word') - translates 'word' from the `common` namespace
export const tc =
	(
		input: string | string[],
		options: (TOptionsBase & $Dictionary & InterpolationMap<string>) | undefined = undefined
	) => i18n.t(input, options);

// tMaker(namespace) => t('word') - translates 'word' from the given namespace
export const tMaker = (baseOptions: { ns?: string } = {}) => {
	return (
		(
			input: string,
			options: (TOptionsBase & $Dictionary & InterpolationMap<string>) | undefined = undefined
		) => i18n.t(input, {...baseOptions, ...(options || {})})
	);
};
