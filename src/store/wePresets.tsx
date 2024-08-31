import { WEPresets as WEPresetsMap } from './types';

const WEPresets: WEPresetsMap = [
	["GrassmannLaw", {
		characterGroups: [],
		soundChanges: [
			{
				id: "1",
				seek: "([ptk])ʰ",
				replace: "$1",
				context: "_[aeiou]+[ptk]ʰ",
				anticontext: "",
				description: ""
			},
		],
		transforms: []
	}],
	["RukiRule", {
		characterGroups: [],
		soundChanges: [
			{
				id: "1",
				seek: "s+",
				replace: "š",
				context: "(?:gʰ|i̯|u̯|[rkgwyiu])_",
				anticontext: "",
				description: ""
			},
		],
		transforms: []
	}],
	["DahlLaw", {
		characterGroups: [
			{
				label: "U",
				title: "UnvoicedConsonants",
				run: "ptk"
			},
			{
				label: "C",
				title: "VoicedConsonants",
				run: "bdg"
			},
			{
				label: "V",
				title: "Vowels",
				run: "aeiou"
			}
		],
		soundChanges: [
			{
				id: "1",
				seek: "%U",
				replace: "%C",
				context: "_%V+%U",
				anticontext: "%C%V+_",
				description: ""
			},
		],
		transforms: []
	}],
	["IngvaeonicNasalSpirantLaw", {
		characterGroups: [
			{
				label: "V",
				title: "Vowels",
				run: "aeiou"
			},
			{
				label: "N",
				title: "NewVowels",
				run: "oeiou"
			}
		],
		soundChanges: [
			{
				id: "1",
				seek: "%Vn",
				replace: "%N",
				context: "_(th|s)",
				anticontext: "",
				description: ""
			},
			{
				id: "1.1",
				seek: "%Vmf",
				replace: "%Nf",
				context: "_",
				anticontext: "",
				description: ""
			}
		],
		transforms: []
	}],
	["GrimLaw", {
		characterGroups: [],
		soundChanges: [
			{
				id: "1",
				seek: "b",
				replace: "f",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "2",
				seek: "d",
				replace: "th",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "3",
				seek: "g",
				replace: "h",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "4",
				seek: "gw",
				replace: "wh",
				context: "_",
				anticontext: "",
				description: ""
			}
		],
		transforms: []
	}],
	["GreatEnglishVowelShift", {
		characterGroups: [
			{
				label: "V",
				title: "Vowels",
				run: "aeɛiouɔ"
			},
			{
				label: "N",
				title: "NewVowels",
				run: "EiiAuUO"
			}
		],
		soundChanges: [
			{
				id: "1",
				seek: "%V",
				replace: "%N",
				context: "_",
				anticontext: "",
				description: ""
			}
		],
		transforms: [
			{
				id: "1",
				seek: "E",
				replace: "eɪ",
				direction: "out",
				description: ""
			},
			{
				id: "2",
				seek: "A",
				replace: "aɪ",
				direction: "out",
				description: ""
			},
			{
				id: "3",
				seek: "U",
				replace: "aʊ",
				direction: "out",
				description: ""
			},
			{
				id: "4",
				seek: "O",
				replace: "oʊ",
				direction: "out",
				description: ""
			}
		]
	}],
	["HighGermanConsonantShift", {
		characterGroups: [
			{
				label: "V",
				title: "Vowels",
				run: "aeiouäöü"
			}
		],
		soundChanges: [
			{
				id: "1",
				seek: "p",
				replace: "f",
				context: "_#",
				anticontext: "",
				description: ""
			},
			{
				id: "1.1",
				seek: "p",
				replace: "ff",
				context: "%V_%V",
				anticontext: "",
				description: ""
			},
			{
				id: "1.2",
				seek: "pp",
				replace: "pf",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "1.3",
				seek: "p",
				replace: "pf",
				context: "[lrnm]_",
				anticontext: "",
				description: ""
			},
			{
				id: "1.4",
				seek: "p",
				replace: "pf",
				context: "#_",
				anticontext: "_f",
				description: ""
			},
			{
				id: "2",
				seek: "t",
				replace: "z",
				context: "_#",
				anticontext: "",
				description: ""
			},
			{
				id: "2.1",
				seek: "t",
				replace: "zz",
				context: "%V_%V",
				anticontext: "",
				description: ""
			},
			{
				id: "2.2",
				seek: "tt",
				replace: "ts",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "2.3",
				seek: "t",
				replace: "ts",
				context: "[lrnm]_",
				anticontext: "",
				description: ""
			},
			{
				id: "2.4",
				seek: "t",
				replace: "ts",
				context: "#_",
				anticontext: "_s",
				description: ""
			},
			{
				id: "3",
				seek: "k",
				replace: "x",
				context: "_#",
				anticontext: "",
				description: ""
			},
			{
				id: "3.1",
				seek: "k",
				replace: "xx",
				context: "%V_%V",
				anticontext: "",
				description: ""
			},
			{
				id: "3.2",
				seek: "kk",
				replace: "kx",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "3.3",
				seek: "k",
				replace: "kx",
				context: "[lrnm]_",
				anticontext: "",
				description: ""
			},
			{
				id: "3.4",
				seek: "k",
				replace: "kx",
				context: "#_",
				anticontext: "_x",
				description: ""
			},
			{
				id: "4",
				seek: "d",
				replace: "t",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "5",
				seek: "th",
				replace: "t",
				context: "_#",
				anticontext: "",
				description: ""
			},
			{
				id: "5.1",
				seek: "th",
				replace: "d",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "6",
				seek: "sk",
				replace: "sh",
				context: "_",
				anticontext: "",
				description: ""
			},
			{
				id: "6.1",
				seek: "s",
				replace: "sh",
				context: "#_",
				anticontext: "_%V",
				description: ""
			}
		],
		transforms: []
	}]
];

export default WEPresets;
