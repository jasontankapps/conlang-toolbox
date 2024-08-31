import i18n from "../i18n";
import { SortObject } from "../store/types";

interface Perms {
	sort: {
		permanentCustomSorts: { [key: string]: string },
		permanentCustomSortObjs: SortObject[]
	}
}

const PermanentInfo: Perms = {
	sort: {
		permanentCustomSorts: {
			"wg-preset-sort": i18n.t("cannotDeleteSorter", { ns: 'common' })
		},
		permanentCustomSortObjs: [
			{
				id: "wg-preset-sort",
				title: i18n.t("WGPresetsSorter", { ns: 'common' }),
				customAlphabet: [
					"a",
					"ā",
					"aĭ",
					"b",
					"c",
					"č",
					"čʰ",
					"d",
					"e",
					"ē",
					"ɛ",
					"eĭ",
					"f",
					"g",
					"h",
					"i",
					"ī",
					"j",
					"k",
					"kʰ",
					"l",
					"ʎ",
					"ɭ",
					"m",
					"n",
					"ñ",
					"ŋ",
					"Ŋ",
					"ɳ",
					"o",
					"ö",
					"ō",
					"ɔ",
					"oĭ",
					"p",
					"pʰ",
					"q",
					"r",
					"s",
					"š",
					"ʂ",
					"t",
					"tʰ",
					"ʈ",
					"u",
					"ü",
					"ū",
					"uĭ",
					"v",
					"w",
					"x",
					"y",
					"z",
					"ž"
				],
				separator: ",",
				customizations: [
					{
						id: "wg-preset-eq-1",
						base: "a",
						equals: [ "à" ],
						separator: ""
					},
					{
						id: "wg-preset-eq-2",
						base: "e",
						equals: [ "ê" ],
						separator: ""
					}
				],
				multiples: [
					"aĭ",
					"čʰ",
					"eĭ",
					"kʰ",
					"oĭ",
					"pʰ",
					"tʰ",
					"uĭ"
				]
			}
		]
	}
};

export default PermanentInfo;
