import { TFunction, i18n } from "i18next";
import { useTranslation } from "react-i18next";

const useTranslator = (...namespace: string[]): [ TFunction<string[], undefined>, i18n ] => {
	namespace.indexOf("common") < 0 && namespace.push("common");
	const object = useTranslation(namespace);
	return [
		object.t,
		object.i18n
	];
};

export default useTranslator;
