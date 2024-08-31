import { WGPresetArray, WGSettings } from './types';

const basicSettings: WGSettings = {
	monosyllablesRate: 20,
	maxSyllablesPerWord: 6,
	characterGroupDropoff: 25,
	syllableBoxDropoff: 20,
	capitalizeSentences: true,
	declarativeSentencePre: "",
	declarativeSentencePost: ".",
	interrogativeSentencePre: "",
	interrogativeSentencePost: "?",
	exclamatorySentencePre: "",
	exclamatorySentencePost: "!",
	customSort: "wg-preset-sort",
};

const simpleSyllables = {
	multipleSyllableTypes: false,
	wordInitial: "",
	wordMiddle: "",
	wordFinal: "",
	syllableDropoffOverrides: {
		singleWord: null,
		wordInitial: null,
		wordMiddle: null,
		wordFinal: null
	}
};

const WGPresets: WGPresetArray = [
	["Simple", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "ptkbdg"
			},
			{
				label: "V",
				title: "Vowels",
				run: "ieaou"
			},
			{
				label: "L",
				title: "Liquids",
				run: "rl"
			}
		],
		singleWord: "CV\nV\nCLV",
		...simpleSyllables,
		transforms: [
			{
				id: "0",
				seek: "ki",
				replace: "ci",
				description: ""

			},
			{
				id: "1",
				seek: "(.)\\1+",
				replace: "$1$1",
				description: ""
			}
		],
		...basicSettings
	}],
	["Medium", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "tpknlrsmʎbdgñfh"
			},
			{
				label: "V",
				title: "Vowels",
				run: "aieuoāīūēō"
			},
			{
				label: "N",
				title: "Nasals",
				run: "nŋ"
			}
		],
		singleWord: "CV\nV\nCVN",
		...simpleSyllables,
		transforms: [
			{
				id: "0",
				seek: "aa",
				replace: "ā",
				description: ""
			},
			{
				id: "1",
				seek: "ii",
				replace: "ī",
				description: ""
			},
			{
				id: "2",
				seek: "uu",
				replace: "ū",
				description: ""
			},
			{
				id: "3",
				seek: "ee",
				replace: "ē",
				description: ""
			},
			{
				id: "4",
				seek: "oo",
				replace: "ō",
				description: ""
			},
			{
				id: "5",
				seek: "nb",
				replace: "mb",
				description: ""
			},
			{
				id: "6",
				seek: "np",
				replace: "mp",
				description: ""
			}
		],
		...basicSettings
	}],
	["Complex", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "kstSplrLnstmTNfh"
			},
			{
				label: "S",
				title: "InitialConsonants",
				run: "tspkThfS"
			},
			{
				label: "V",
				title: "Vowels",
				run: "aoiueAOUE"
			},
			{
				label: "I",
				title: "MWVowels",
				run: "aoueAOUE"
			},
			{
				label: "E",
				title: "WordEndingConsonants",
				run: "sfSnmNktpTh"
			},
			{
				label: "J",
				title: "WFConjugation",
				run: "1234567890!@#-&=_;:~",
				dropoffOverride: 0
			}
		],
		multipleSyllableTypes: true,
		singleWord: "SV\nSVEJ\nSV\nSV",
		wordInitial: "SV\nV\nSVC",
		wordMiddle: "SV\nI\nCV\nSVC",
		wordFinal: "I\nVEJ\nV\nVEJ\nSVEJ\nV\nCV\nVEJ\nCVEJ",
		syllableDropoffOverrides: simpleSyllables.syllableDropoffOverrides,
		transforms: [
			{
				id: "50.1",
				seek: "1",
				replace: "e",
				description: "CONJ[type=g1s]"
			},
			{
				id: "50.2.1",
				seek: "([mfpkh])2|([hk])3",
				replace: "$1$2a",
				description: "CONJ[type=g2s3sAN]"
			},
			{
				id: "50.2.2",
				seek: "([nts])2|([mfp])3",
				replace: "$1$2i",
				description: "CONJ[type=g2s3sAN]"
			},
			{
				id: "50.2.3",
				seek: "([NTS])2",
				replace: "$1u",
				description: "CONJ[type=g2s]"
			},
			{
				id: "50.3",
				seek: "([nstNTS])3",
				replace: "$1o",
				description: "CONJ[type=g3sAN]"
			},
			{
				id: "50.4.1",
				seek: "([mfp])4",
				replace: "$1a$1e",
				description: "CONJ[type=g2sFORM]"
			},
			{
				id: "50.4.2",
				seek: "([nst])4",
				replace: "$1i$1eĭ",
				description: "CONJ[type=g2sFORM]"
			},
			{
				id: "50.4.3",
				seek: "([NTS])4",
				replace: "$1u$1eĭ",
				description: "CONJ[type=g2sFORM]"
			},
			{
				id: "50.4.4",
				seek: "([hk])4",
				replace: "$1ate",
				description: "CONJ[type=g2sFORM]"
			},
			{
				id: "50.5.1",
				seek: "([mfp])5",
				replace: "$1o$1o",
				description: "CONJ[type=g3sINAN]"
			},
			{
				id: "50.5.2",
				seek: "([nstNST])5",
				replace: "$1aa",
				description: "CONJ[type=g3sINAN]"
			},
			{
				id: "50.5.3",
				seek: "([hk])5",
				replace: "$1iki",
				description: "CONJ[type=g3sINAN]"
			},
			{
				id: "50.6.1",
				seek: "([mfp])6",
				replace: "$1eo",
				description: "CONJ[type=g1DUIN]"
			},
			{
				id: "50.6.2",
				seek: "([nst])6",
				replace: "$1io",
				description: "CONJ[type=g1DUIN]"
			},
			{
				id: "50.6.3",
				seek: "([NTS])6",
				replace: "$1ua",
				description: "CONJ[type=g1DUIN]"
			},
			{
				id: "50.6.4",
				seek: "([hk])6",
				replace: "$1ee",
				description: "CONJ[type=g1DUIN]"
			},
			{
				id: "50.7.1",
				seek: "([mfp])7",
				replace: "$1uo",
				description: "CONJ[type=g1DUEX]"
			},
			{
				id: "50.7.2",
				seek: "([nstNST])7",
				replace: "$1u",
				description: "CONJ[type=g1DUEX]"
			},
			{
				id: "50.7.3",
				seek: "([kh])7",
				replace: "$1eo",
				description: "CONJ[type=g1DUEX]"
			},
			{
				id: "50.8.1",
				seek: "([mfp])8|([NST])0",
				replace: "$1$2eĭ",
				description: "CONJ[type=g1PAUIN1pIN]"
			},
			{
				id: "50.8.2",
				seek: "([nst])8",
				replace: "$1u$1u",
				description: "CONJ[type=g1PAUIN]"
			},
			{
				id: "50.8.3",
				seek: "([NTS])8",
				replace: "$1a$1a",
				description: "CONJ[type=g1PAUIN]"
			},
			{
				id: "50.8.4",
				seek: "([hk])8|([nst])9|([mfp])0",
				replace: "$1$2$3aĭ",
				description: "CONJ[type=g1PAUIN1PAUEX1pIN]"
			},
			{
				id: "50.9.1",
				seek: "([mfp])9",
				replace: "$1ae",
				description: "CONJ[type=g1PAUEX]"
			},
			{
				id: "50.9.2",
				seek: "([NTS])9|([nst])0",
				replace: "$1$2oĭ",
				description: "CONJ[type=g1PAUEX1pIN]"
			},
			{
				id: "50.9.3",
				seek: "([hk])[9!]",
				replace: "$1oe",
				description: "CONJ[type=g1PAUEX1pEX]"
			},
			{
				id: "50.10",
				seek: "([hk])0",
				replace: "$1uu",
				description: "CONJ[type=g1pIN]"
			},
			{
				id: "50.11.1",
				seek: "([fmp])!",
				replace: "$1ou",
				description: "CONJ[type=g1pEX]"
			},
			{
				id: "50.11.2",
				seek: "([nst])!",
				replace: "$1uaĭ",
				description: "CONJ[type=g1pEX]"
			},
			{
				id: "50.11.3",
				seek: "([NST])!",
				replace: "$1uoĭ",
				description: "CONJ[type=g1pEX]"
			},
			{
				id: "50.12.1",
				seek: "([fmphk])@",
				replace: "$1ara",
				description: "CONJ[type=g2PAU]"
			},
			{
				id: "50.12.2",
				seek: "([nst])@",
				replace: "$1aro",
				description: "CONJ[type=g2PAU]"
			},
			{
				id: "50.12.3",
				seek: "([NST])@",
				replace: "$1uro",
				description: "CONJ[type=g2PAU]"
			},
			{
				id: "50.13.1",
				seek: "([fmpnsthk])#",
				replace: "$1areĭ",
				description: "CONJ[type=g2PAUFORM]"
			},
			{
				id: "50.13.2",
				seek: "([NST])#",
				replace: "$1ureĭ",
				description: "CONJ[type=g2PAUFORM]"
			},
			{
				id: "50.14.1",
				seek: "([fmphk])-",
				replace: "$1ala",
				description: "CONJ[type=g2p]"
			},
			{
				id: "50.14.2",
				seek: "([nst])-",
				replace: "$1alo",
				description: "CONJ[type=g2p]"
			},
			{
				id: "50.14.3",
				seek: "([NST])-",
				replace: "$1uLo",
				description: "CONJ[type=g2p]"
			},
			{
				id: "50.15.1",
				seek: "([fmpnsthk])&",
				replace: "$1aleĭ",
				description: "CONJ[type=g2pFORM]"
			},
			{
				id: "50.15.2",
				seek: "([NST])&",
				replace: "$1uleĭ",
				description: "CONJ[type=g2pFORM]"
			},
			{
				id: "50.16.1",
				seek: "([fmp])=",
				replace: "$1iro",
				description: "CONJ[type=g3PAUAN]"
			},
			{
				id: "50.16.2",
				seek: "([nstNST])=",
				replace: "$1ore",
				description: "CONJ[type=g3PAUAN]"
			},
			{
				id: "50.16.3",
				seek: "([hk])=",
				replace: "$1aro",
				description: "CONJ[type=g3PAUAN]"
			},
			{
				id: "50.17.1",
				seek: "([mfp])_",
				replace: "$1ilo",
				description: "CONJ[type=g3pAN]"
			},
			{
				id: "50.17.2",
				seek: "([nst])_",
				replace: "$1ole",
				description: "CONJ[type=g3pAN]"
			},
			{
				id: "50.17.3",
				seek: "([NTS])_",
				replace: "$1oLe",
				description: "CONJ[type=g3pAN]"
			},
			{
				id: "50.17.4",
				seek: "([hk])_",
				replace: "$1alo",
				description: "CONJ[type=g3pAN]"
			},
			{
				id: "50.18.1",
				seek: "([mfp]);",
				replace: "$1oro",
				description: "CONJ[type=g3PAUINAN]"
			},
			{
				id: "50.18.2",
				seek: "([nstNST]);",
				replace: "$1ara",
				description: "CONJ[type=g3PAUINAN]"
			},
			{
				id: "50.18.3",
				seek: "([kh]);",
				replace: "$1iri",
				description: "CONJ[type=g3PAUINAN]"
			},
			{
				id: "50.19.1",
				seek: "([mfp]):",
				replace: "$1olo",
				description: "CONJ[type=g3pINAN]"
			},
			{
				id: "50.19.2",
				seek: "([nst]):",
				replace: "$1ala",
				description: "CONJ[type=g3pINAN]"
			},
			{
				id: "50.19.3",
				seek: "([NTS]):",
				replace: "$1aLa",
				description: "CONJ[type=g3pINAN]"
			},
			{
				id: "50.19.4",
				seek: "([hk]):",
				replace: "$1ili",
				description: "CONJ[type=g3pINAN]"
			},
			{
				id: "50.20.1",
				seek: "([mfphk])~",
				replace: "$1aĭa",
				description: "CONJ[type=gGER]"
			},
			{
				id: "50.20.2",
				seek: "([nstNST])~",
				replace: "$1oĭa",
				description: "CONJ[type=gGER]"
			},
			{
				id: "0",
				seek: "([aeiou])\\1{2,}",
				replace: "$1$1",
				description: "changeTo[from=tripleVowels][to=doubleVowels]"
			},
			{
				id: "1",
				seek: "([AEOU])\\1+",
				replace: "$1",
				description: "changeTo[from=doubleDipthongs][to=singleDipthongs]"
			},
			{
				id: "2",
				seek: "(%V{2})%V+",
				replace: "$1",
				description: "nix[what=thirdVowel]"
			},
			{
				id: "3",
				seek: "h+",
				replace: "h",
				description: "reduceMultiHsToH"
			},
			{
				id: "4",
				seek: "h(?=%V(%E|%C{0,2}%V)\\b)",
				replace: "H",
				description: "saveHBeforeStress"
			},
			{
				id: "5",
				seek: "(%V)h(?=%V\\b)",
				replace: "$1H",
				description: "saveHBeforeStress"
			},
			{
				id: "6",
				seek: "\\bh",
				replace: "H",
				description: "saveWIH"
			},
			{
				id: "7",
				seek: "h\\b",
				replace: "H",
				description: "saveWFH"
			},
			{
				id: "8",
				seek: "h",
				replace: "",
				description: "nix[what=otherHs]"
			},
			{
				id: "9",
				seek: "H",
				replace: "h",
				description: "restoreSavedH"
			},
			{
				id: "9.1",
				seek: "kh",
				replace: "k",
				description: "reduceKhToK"
			},
			{
				id: "10",
				seek: "A",
				replace: "aĭ",
				description: "dipthong"
			},
			{
				id: "11",
				seek: "O",
				replace: "oĭ",
				description: "dipthong"
			},
			{
				id: "12",
				seek: "U",
				replace: "uĭ",
				description: "dipthong"
			},
			{
				id: "13",
				seek: "E",
				replace: "eĭ",
				description: "dipthong"
			},
			{
				id: "14",
				seek: "ĭi",
				replace: "i",
				description: "nix[what=dipthongI]"
			},
			{
				id: "15",
				seek: "ĭT",
				replace: "ĭt",
				description: "deRetro[char=t][what=aDipthong]"
			},
			{
				id: "16",
				seek: "ĭS",
				replace: "ĭs",
				description: "deRetro[char=s][what=aDipthong]"
			},
			{
				id: "17",
				seek: "ĭL",
				replace: "ĭl",
				description: "deRetro[char=l][what=aDipthong]"
			},
			{
				id: "18",
				seek: "ĭN",
				replace: "ĭn",
				description: "deRetro[char=n][what=aDipthong]"
			},
			{
				id: "19",
				seek: "(.\\B[aeou])i",
				replace: "$1ĭ",
				description: "changeTo[from=nonWIVowelIPairs][to=dipthongs]"
			},
			{
				id: "20",
				seek: "(%C)\\1",
				replace: "$1",
				description: "reduceDoubleConsToCon"
			},
			{
				id: "21",
				seek: "[tkpT]r",
				replace: "r",
				description: "nix[what=plosiveR]"
			},
			{
				id: "22",
				seek: "n[pTk]",
				replace: "nt",
				description: "changeTo[from=nPlosive][to=nt]"
			},
			{
				id: "23",
				seek: "m[tTk]",
				replace: "mp",
				description: "changeTo[from=mPlosive][to=mp]"
			},
			{
				id: "24",
				seek: "N[ptk]",
				replace: "NT",
				description: "changeTo[from=retroNPlosive][to=retroNRetroPlosive]"
			},
			{
				id: "25",
				seek: "k[nmN]",
				replace: "k",
				description: "nix[what=kNasal]"
			},
			{
				id: "26",
				seek: "p[nN]",
				replace: "pm",
				description: "changeTo[from=pNasal][to=pm]"
			},
			{
				id: "27",
				seek: "t[mN]",
				replace: "tn",
				description: "changeTo[from=tNasal][to=tn]"
			},
			{
				id: "28",
				seek: "T[nm]",
				replace: "TN",
				description: "changeTo[from=nasalPostRetroT][to=retroN]"
			},
			{
				id: "29",
				seek: "p[sSh]",
				replace: "pf",
				description: "changeTo[from=pFricative][to=pf]"
			},
			{
				id: "30",
				seek: "t[fSh]",
				replace: "ts",
				description: "changeTo[from=tFricative][to=ts]"
			},
			{
				id: "31",
				seek: "T[fsh]",
				replace: "TS",
				description: "changeTo[from=postRetroTFric][to=retroS]"
			},
			{
				id: "32",
				seek: "k[fsS]",
				replace: "kh",
				description: "changeTo[from=kFricative][to=kh]"
			},
			{
				id: "33",
				seek: "f[sSh]",
				replace: "fp",
				description: "changeTo[from=fFricative][to=fp]"
			},
			{
				id: "34",
				seek: "s[fSh]",
				replace: "st",
				description: "changeTo[from=sFricative][to=st]"
			},
			{
				id: "35",
				seek: "S[fsh]",
				replace: "ST",
				description: "changeTo[from=postRetroSFric][to=retroT]"
			},
			{
				id: "36",
				seek: "h[fsS]",
				replace: "hk",
				description: "changeTo[from=hFricative][to=hk]"
			},
			{
				id: "37",
				seek: "ft",
				replace: "fp",
				description: "changeTo[from=ft][to=fp]"
			},
			{
				id: "38",
				seek: "sT",
				replace: "st",
				description: "deRetro[char=t][what=s]"
			},
			{
				id: "39",
				seek: "St",
				replace: "ST",
				description: "changeTo[from=retroST][to=retroSRetroT]"
			},
			{
				id: "40",
				seek: "([TSLN])[tsln]",
				replace: "$1",
				description: "nix[what=retroConsNonRetroCons]"
			},
			{
				id: "41",
				seek: "([tsln])[TSLN]",
				replace: "$1",
				description: "nix[what=nonRetroConsRetroCons]"
			},
			{
				id: "42",
				seek: "NT",
				replace: "nT",
				description: "deRetroBefore[one=n][two=t]"
			},
			{
				id: "43",
				seek: "TN",
				replace: "tN",
				description: "deRetroBefore[one=t][two=n]"
			},
			{
				id: "44",
				seek: "ST",
				replace: "sT",
				description: "deRetroBefore[one=s][two=t]"
			},
			{
				id: "45",
				seek: "TS",
				replace: "tS",
				description: "deRetroBefore[one=t][two=s]"
			},
			{
				id: "46",
				seek: "T",
				replace: "ʈ",
				description: "markRetro[char=t]"
			},
			{
				id: "47",
				seek: "L",
				replace: "ɭ",
				description: "markRetro[char=l]"
			},
			{
				id: "48",
				seek: "S",
				replace: "ʂ",
				description: "markRetro[char=s]"
			},
			{
				id: "49",
				seek: "N",
				replace: "ɳ",
				description: "markRetro[char=n]"
			}
		],
		...basicSettings,
		monosyllablesRate: 12,
		maxSyllablesPerWord: 8,
		capitalizeSentences: false,
		declarativeSentencePre: ".",
		interrogativeSentencePre: "<",
		interrogativeSentencePost: ">",
		exclamatorySentencePre: "[",
		exclamatorySentencePost: "]"
	}],
	["PseudoLatin", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "tkpnslrmfbdghvyh"
			},
			{
				label: "V",
				title: "Vowels1",
				run: "aiueo"
			},
			{
				label: "U",
				title: "Vowels2",
				run: "aiuàê"
			},
			{
				label: "P",
				title: "PreLiquidConsonants",
				run: "ptkbdg"
			},
			{
				label: "L",
				title: "Liquids",
				run: "rl"
			},
			{
				label: "F",
				title: "SyllableFinalConsonants",
				run: "nsrmltc"
			}
		],
		singleWord: "CV\nCUF\nV\nUF\nPLV\nPLUF",
		...simpleSyllables,
		transforms: [
			{
				id: "0",
				seek: "ka",
				replace: "ca",
				description: ""
			},
			{
				id: "1",
				seek: "nko",
				replace: "co",
				description: ""
			},
			{
				id: "2",
				seek: "nku",
				replace: "cu",
				description: ""
			},
			{
				id: "3",
				seek: "nkr",
				replace: "cr",
				description: ""
			}
		],
		...basicSettings
	}],
	["PseudoChinese", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "ptknlsmšywčhfŋ"
			},
			{
				label: "V",
				title: "Vowels",
				run: "auieo"
			},
			{
				label: "F",
				title: "SyllableFinalConsonants",
				run: "nnŋmktp"
			},
			{
				label: "D",
				title: "Dipthongs",
				run: "io"
			},
			{
				label: "A",
				title: "AspiratedConsonants",
				run: "ptkč"
			}
		],
		singleWord: "CV\nAʰV\nCVD\nCVF\nVF\nV\nAʰVF",
		...simpleSyllables,
		transforms: [
			{
				id: "0",
				seek: "uu",
				replace: "wo",
				description: ""
			},
			{
				id: "1",
				seek: "oo",
				replace: "ou",
				description: ""
			},
			{
				id: "2",
				seek: "ii",
				replace: "iu",
				description: ""
			},
			{
				id: "3",
				seek: "aa",
				replace: "ia",
				description: ""
			},
			{
				id: "4",
				seek: "ee",
				replace: "ie",
				description: ""
			}
		],
		...basicSettings
	}],
	["PseudoGreek", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "ptknslrmbdgfvwyhšzñxčžŊ"
			},
			{
				label: "V",
				title: "Vowels",
				run: "aiuoeɛɔâôüö"
			},
			{
				label: "L",
				title: "Liquids",
				run: "rly"
			}
		],
		singleWord: "CV\nV\nCVC\nCLV",
		...simpleSyllables,
		transforms: [
			{
				id: "0",
				seek: "â",
				replace: "ai",
				description: ""
			},
			{
				id: "1",
				seek: "ô",
				replace: "au",
				description: ""
			}
		],
		...basicSettings
	}],
	["PseudoEnglish", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "tnsrdlSmTqwfgWypbCcvhPBkjxqz"
			},
			{
				label: "V",
				title: "Vowels",
				run: "eaoeaoiuOIiEAUuy"
			},
			{
				label: "P",
				title: "Plosives",
				run: "tpkc"
			},
			{
				label: "L",
				title: "Liquids",
				run: "rl"
			},
			{
				label: "N",
				title: "Nasals",
				run: "nmN"
			},
			{
				label: "F",
				title: "PNoLFConsonants",
				run: "TS"
			}
		],
		multipleSyllableTypes: true,
		singleWord: "CV\nCVC\nVC\nV\nPLVC\nPLV",
		wordInitial: "CVC\nCV\nVC\nPLV\nsPLV\nV",
		wordMiddle: "CV\nCV\nCV\nVC\nV",
		wordFinal: "CV\nCVC\nCVLF\nCVNF\nCVgh\nVC\nV\nVgh",
		syllableDropoffOverrides: simpleSyllables.syllableDropoffOverrides,
		transforms: [
			{
				id: "15",
				seek: "([^g])h",
				replace: "$1k",
				description: "changeTo[from=nonInitHNotPreG][to=k]"
			},
			{
				id: "0",
				seek: "s*T+s*",
				replace: "th",
				description: ""
			},
			{
				id: "1",
				seek: "s*S+s*",
				replace: "sh",
				description: ""
			},
			{
				id: "2",
				seek: "C+",
				replace: "ch",
				description: ""
			},
			{
				id: "5",
				seek: "[nm]*N+[nm]*",
				replace: "ng",
				description: ""
			},
			{
				id: "6",
				seek: "w*W+(%V)",
				replace: "wh$1",
				description: "changeTo[from=WVowel][to=whVowel]"
			},
			{
				id: "6.1",
				seek: "[wW]+",
				replace: "w",
				description: "changeTo[from=remWs][to=w]"
			},
			{
				id: "7",
				seek: "(%V)ch",
				replace: "$1tch",
				description: "changeTo[from=vowelCh][to=vowelTch]"
			},
			{
				id: "8",
				seek: "P+",
				replace: "ph",
				description: ""
			},
			{
				id: "9",
				seek: "(%V)B(\\b|!%V)",
				replace: "$1ble$2",
				description: "changeTo[from=bWithConditions][to=vowelBle]"
			},
			{
				id: "9.1",
				seek: "(%V)B",
				replace: "$1bl",
				description: "changeTo[from=vowelB][to=vowelBl]"
			},
			{
				id: "9.2",
				seek: "B",
				replace: "",
				description: "nix[what=otherBs]"
			},
			{
				id: "10",
				seek: "%V*O+%V*",
				replace: "oo",
				description: ""
			},
			{
				id: "11",
				seek: "%V*U+%V*",
				replace: "ou",
				description: ""
			},
			{
				id: "12",
				seek: "%V*I+%V*",
				replace: "oi",
				description: ""
			},
			{
				id: "13",
				seek: "%V*A+%V*",
				replace: "au",
				description: ""
			},
			{
				id: "13.1",
				seek: "%V*E+%V*",
				replace: "ei",
				description: ""
			},
			{
				id: "13.2",
				seek: "([^c])ei",
				replace: "$1ie",
				description: "iBeforeE"
			},
			{
				id: "14",
				seek: "([^aeiou])(o|au)\\b",
				replace: "$1ow",
				description: "changeTo[from=wordFinalOOrAu][to=ow]"
			},
			{
				id: "14.1",
				seek: "([^aeiou])(ou|ei)\\b",
				replace: "$1$2gh",
				description: "changeTo[from=wordFinalOuOrEi][to=oughEigh]"
			},
			{
				id: "16",
				seek: "y+",
				replace: "y",
				description: "nix[what=dupeYs]"
			},
			{
				id: "17",
				seek: "(\\b|[^aeiou])tl",
				replace: "$1t",
				description: "reduceTlClusterAfterCon"
			},
			{
				id: "17.1",
				seek: "tl(\\b|%C)",
				replace: "t$1",
				description: "reduceTlClusterBeforeConOrEnd"
			},
			{
				id: "18",
				seek: "(.)\\1{2,}",
				replace: "$1$1",
				description: "reduceTripleToTwo"
			},
			{
				id: "18.1",
				seek: "[aeiou]*([aeiou])[aeiou]*\\1[aeiou]*",
				replace: "$1$1",
				description: "reduceMultiVowelsToMatching"
			},
			{
				id: "3",
				seek: "q+",
				replace: "qu",
				description: "qFollowedByU"
			},
			{
				id: "4",
				seek: "qu\\b",
				replace: "que",
				description: "changeTo[from=wordFinalQu][to=que]"
			},
			{
				id: "4.1",
				seek: "qu([aeiou])[aeiou]+",
				replace: "qu$1",
				description: "nix[what=qTripVowels]"
			},
			{
				id: "19",
				seek: "c\\b",
				replace: "ck",
				description: "changeTo[from=wordFinalC][to=ck]"
			},
			{
				id: "20",
				seek: "([aiu])\\1",
				replace: "$1",
				description: "changeTo[from=doubleAIU][to=singleAIU]"
			},
			{
				id: "21",
				seek: "m[kt]\\b",
				replace: "mp",
				description: "changeTo[from=wordFinalMkOrMt][to=mp]"
			},
			{
				id: "21.1",
				seek: "n[kp]\\b",
				replace: "nt",
				description: "changeTo[from=wordFinalNkOrNp][to=nt]"
			},
			{
				id: "21.2",
				seek: "ng[kt]",
				replace: "nk",
				description: "changeTo[from=ngkNgt][to=nk]"
			}
		],
		...basicSettings,
		maxSyllablesPerWord: 5
	}],
	["PseudoJapanese", {
		characterGroups: [
			{
				label: "C",
				title: "Consonants",
				run: "kgsztdnhbpmyr"
			},
			{
				label: "V",
				title: "Vowels",
				run: "aiueo"
			}
		],
		singleWord: "CV\nV\nCV\nV\nCVn\nVn",
		...simpleSyllables,
		transforms: [
			{
				id: "1",
				seek: "y([ie])",
				replace: "r$1",
				description: "replaceForbiddenSyll"
			},
			{
				id: "2",
				seek: "w([ieu])",
				replace: "b$1",
				description: "replaceForbiddenSyll"
			},
			{
				id: "3",
				seek: "(.)\\1+",
				replace: "$1",
				description: "removeDupeChars"
			},
			{
				id: "4",
				seek: "(%V%V)%V+",
				replace: "$1",
				description: "reduceTripPlusVowelsToTwo"
			}
		],
		...basicSettings,
		monosyllablesRate: 5,
		maxSyllablesPerWord: 8,
		characterGroupDropoff: 10,
		syllableBoxDropoff: 40
	}]
];

export default WGPresets;
