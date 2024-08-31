import React from 'react';
import { useTranslation } from 'react-i18next';
import Markdown from 'react-markdown';

export const RegularExpressions: React.FC = () => {
	const { t } = useTranslation();
	return (
		<>
			<hr />
			<Markdown>{t("regexpInfo", { joinArrays: "\n" })}</Markdown>
		</>
	);
};
