import { Concept, ConceptDisplay } from "../store/types";

export const ConceptsSources: [string, ConceptDisplay][] = [
	// This is in the format [ i18nKey, conceptDisplayProp ]
	["Swadesh100", "s100"],
	["Swadesh207", "s207"],
	["SwadeshYakhontov", "sy"],
	["SwadeshWoodward", "ssl"],
	["Dolgopolsky", "d"],
	["LeipzigJakarta", "lj"],
	["ASJP", "asjp"],
	["Landau200", "l200"]
];

export const Concepts: Concept[] = [
	{
		id: "mbmdddsqqqfhzdlhzbncnwh",
		word: "1st-person plural pronoun (we)",
		s100: true,
		s207: true,
		asjp: true
	},
	{
		id: "vnvmjndjcdjlmgstvcpc",
		word: "1st-person singular pronoun (I)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		id: "jtgdtvgsxcvrjgtvbkqn",
		word: "2nd-person plural pronoun (you)",
		s207: true
	},
	{
		id: "lnflhgnxwnbqgrnmbd",
		word: "2nd-person singular pronoun (you)",
		sy: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		id: "dpsbdzgkcvvwglc",
		word: "3rd-person plural pronoun (they)",
		s207: true
	},
	{
		id: "rbvkpqrnplgbsftq",
		word: "3rd-person singular pronoun (he/she/it/him/her)",
		s207: true,
		lj: true
	},
	{
		id: "jsnjsjpchstxqlhnh",
		word: "afraid",
		l200: true
	},
	{
		id: "rrmqqfvvphdwbxzlwlpmg",
		word: "air",
		l200: true
	},
	{
		id: "swcwgnfvzjnbxggmpdlrdh",
		word: "all (of a number)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		id: "rnbvxgsffbqspznqpmp",
		word: "and",
		s207: true
	},
	{
		id: "sgbtbrqnqvsxcdtjks",
		word: "angry",
		l200: true
	},
	{
		id: "cwjbhthgnhctqwbvg",
		word: "animal",
		s207: true,
		ssl: true
	},
	{
		id: "cgrkjldnthnhgscdpxs",
		word: "ant",
		lj: true
	},
	{
		id: "cgkswdnbkmmlfhqc",
		word: "arm",
		lj: true,
		l200: true
	},
	{
		id: "qvdrxppmmddxkpxsbndjbv",
		word: "ash(es)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		id: "bhstbkbqkpkrcplwpjgfdh",
		word: "ask (a question)",
		l200: true
	},
	{
		id: "lslldhwkvmvctcxpkdbjhc",
		word: "at",
		s207: true
	},
	{
		id: "ltrtkggdtpnkckbtmn",
		word: "baby",
		l200: true
	},
	{
		id: "pbrwvrlltchfwgfmp",
		word: "back (of object/building)",
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "lppvfqzbtfwcvzldwp",
		word: "bad",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "jwgbqjfrgsjmmqv",
		word: "bark (of a tree)",
		s100: true,
		s207: true
	},
	{
		id: "dvgdrqcscjpwqddpgpw",
		word: "because",
		s207: true,
		ssl: true
	},
	{
		id: "sdgmprcbtvqssthx",
		word: "belly (lower part of body, abdomen)",
		s100: true,
		s207: true
	},
	{
		id: "hxvlcgmvpkkbxmrq",
		word: "big",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "mrtstqpvvcrkjtpbjvl",
		word: "bird",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		id: "ffxgwwbwbtkgdcr",
		word: "bite (verb)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "wcxxclqztvwkcmlqbnlc",
		word: "bitter",
		lj: true
	},
	{
		id: "hfkhnbjlrqdjqfrrxlhvd",
		word: "black (color)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "kbkgvldxwpmwltvpfzbj",
		word: "blood",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "sqxwgnthtrcctfrvkqtv",
		word: "blow (breathe out)",
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "rkwzpjkkrzsmhhgxrdz",
		word: "body",
		l200: true
	},
	{
		id: "nxzpbqdvvgfvpzdw",
		word: "bone",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		id: "rsmbxfcjjssjcsnrxbcskzn",
		word: "bottom (of object/mountain)",
		l200: true
	},
	{
		id: "mxdsmsrmgrvqnvtnbqxdqwqx",
		word: "boy (male child)",
		l200: true
	},
	{
		id: "dqglxvgwrprxpbkgknsjwcv",
		word: "boy (young man)",
		l200: true
	},
	{
		id: "hnfcdcmdgmgxvbt",
		word: "break/shatter (verb)",
		l200: true
	},
	{
		id: "nfvrqwrzrkgrntdtrgn",
		word: "breast (woman's)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		id: "pjrtvntnszxrxbdh",
		word: "breathe (verb)",
		s207: true,
		l200: true
	},
	{
		id: "plcmvhtbwbgnbzgmwjrsnrp",
		word: "brother",
		ssl: true
	},
	{
		id: "pmbzhrdfrmpdkgt",
		word: "build (construct)",
		l200: true
	},
	{
		id: "rvfczfbwztgpgtjfkgzqdxc",
		word: "burn (something)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "ldmpcbkmmwmfxvfv",
		word: "carry (verb)",
		lj: true
	},
	{
		id: "zxqfxbqxfxbngsvnxkkxklz",
		word: "cat",
		ssl: true
	},
	{
		id: "wdvprglszldzpsfgww",
		word: "child (reciprocal of parent)",
		lj: true,
		l200: true
	},
	{
		id: "qdkcptfvxjbrvlqqtzxs",
		word: "child (young human)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "fqrwxmxlxkgnbffmtsxpm",
		word: "claw (noun)",
		s100: true
	},
	{
		id: "kpssxvsshrmjvnvhhqml",
		word: "climb (a mountain, hill)",
		l200: true
	},
	{
		id: "bznkdhzsspxvqvqvgltmsc",
		word: "climb (a tree)",
		l200: true
	},
	{
		id: "cvtgdmnwtnmnqkltl",
		word: "close (one's eyes)",
		l200: true
	},
	{
		id: "fwvlqfksgkxbnnpztxspxk",
		word: "clothes",
		l200: true
	},
	{
		id: "xltkdpkpnfkljjrjq",
		word: "cloud (not fog)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "xzvlrxszzgfflhqjrmmwcc",
		word: "cold",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "wfptkrtcslxcgtgncrszspmq",
		word: "come (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "fwzhdgmxrkcsdlm",
		word: "cook (verb)",
		l200: true
	},
	{
		id: "wrjjbxbtnzxctqcgcpxshm",
		word: "correct",
		s207: true,
		ssl: true
	},
	{
		id: "ftsvnntzmhqxhxjxtht",
		word: "count (verb)",
		s207: true,
		ssl: true
	},
	{
		id: "rbktkpqhplmtcfdggxzrqnp",
		word: "crush/grind (verb)",
		lj: true
	},
	{
		id: "mmcwcrsmnhdspmhnwzm",
		word: "cry/weep (verb)",
		lj: true,
		l200: true
	},
	{
		id: "zjpgwqkbjdthfbxmt",
		word: "cut (verb)",
		s207: true,
		l200: true
	},
	{
		id: "wmfjcvrblrldlmpgbkzccwn",
		word: "dance (verb)",
		ssl: true,
		l200: true
	},
	{
		id: "fclznkplfdbhchdtwrlkhcx",
		word: "daughter (of a father)",
		l200: true
	},
	{
		id: "bxsgvmsnrvsdxpvjhthpt",
		word: "daughter (of a mother)",
		l200: true
	},
	{
		id: "pxmndbqfqmwxgjw",
		word: "day/daytime",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "pphcxxfqzgpdjlqbbhfw",
		word: "dead (adjective)",
		d: true
	},
	{
		id: "drfgkjmxxfnbfcfggpqzdf",
		word: "deep (vertically)",
		l200: true
	},
	{
		id: "nnkjcmbjhfcxdjfzbdqwrvm",
		word: "die (verb)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		asjp: true,
		l200: true
	},
	{
		id: "blqtsvjsqqzfrvdcdxjcfln",
		word: "dig (verb)",
		s207: true,
		l200: true
	},
	{
		id: "vvknrdtgttmtllrbjdk",
		word: "dirty",
		s207: true,
		ssl: true
	},
	{
		id: "tvmnjvxbwzpddbrxzwwnch",
		word: "do/make (verb)",
		lj: true
	},
	{
		id: "lpjxdwnbhbvkmkmxrdkgn",
		word: "dog",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		id: "zvcbcgrsnvkhdktlpmfkpw",
		word: "drink (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "mzrrllthxbnvpqhkvjhgrgtn",
		word: "dry (substance)",
		s100: true,
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "mmxblghcqgvdkfx",
		word: "dull (as a knife)",
		s207: true,
		ssl: true
	},
	{
		id: "lzqjghnntqkpjpgtsxth",
		word: "dust",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "hwbrwpspksxbmvbvmlrjkl",
		word: "ear",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "sbgvsthwjjrzqqtzvsd",
		word: "earth (ground, dirt)",
		s100: true,
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "jvwxqhqvxtvmdzxmtvrggf",
		word: "eat (verb)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "mmrwqcfpbcsmnszscshf",
		word: "egg",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "hcxbpqxcxjfkdqj",
		word: "evening",
		l200: true
	},
	{
		id: "bdbjcptjjtckmdsmkwf",
		word: "eye (noun)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true,
		l200: true
	},
	{
		id: "qqglzwfmjvbgcwvwfqpd",
		word: "face (noun)",
		l200: true
	},
	{
		id: "vhxlbqdntfxghbrljvbbp",
		word: "fall (verb)",
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "tfsvfsgpwhjlmlxcbqhjqq",
		word: "far",
		s207: true,
		lj: true
	},
	{
		id: "ffgppmvdzrskwdtchqf",
		word: "fast (adjective)",
		l200: true
	},
	{
		id: "fxkkxmdnkqgvpsprbmv",
		word: "father (noun)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "crxzrchkqksfqgsf",
		word: "fear (verb)",
		s207: true
	},
	{
		id: "mxbrrwpmwntxhblk",
		word: "feather (large, not down)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		id: "cknmxbgcjdrqnprfdnpzddz",
		word: "feel (through touch)",
		l200: true
	},
	{
		id: "fxwmvrcgnqhgxxrpmxwsqht",
		word: "few",
		s207: true
	},
	{
		id: "pqmfgwlrgczqrsdckrsdb",
		word: "fight (verb)",
		s207: true,
		l200: true
	},
	{
		id: "lsxdvwhwghzcxwzntnsvmkbt",
		word: "finger (noun)",
		l200: true
	},
	{
		id: "hfrkgkbgbpcxzchsbgg",
		word: "fingernail",
		s207: true,
		d: true,
		l200: true
	},
	{
		id: "bgpwfxvwqkhfjqzn",
		word: "fire (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "qddcswtwbmbssxrcdslptzc",
		word: "fish (animal)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true
	},
	{
		id: "pvkwvtdkghlfnfjzgw",
		word: "five",
		s207: true
	},
	{
		id: "vgtrzqzctcvltwtx",
		word: "flesh (meat)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		id: "pxjqnststfzjhdwsgcdn",
		word: "float (verb)",
		s207: true
	},
	{
		id: "tqgkwnvwmzbkjxl",
		word: "flow (verb)",
		s207: true,
		l200: true
	},
	{
		id: "grqxqfzkcsfsgqrrnhsxz",
		word: "flower",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "qdzkcfmfmlfqvffvmdqmrhzc",
		word: "fly (verb)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "xsfdbsggrkbwqjqwhpxwrws",
		word: "fog",
		s207: true
	},
	{
		id: "fbbkxtdvbgsgrllmbmlh",
		word: "food",
		l200: true
	},
	{
		id: "clmwqfdzswvfwpsvjqnlgq",
		word: "foot (part of body; not leg)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "dsxpbvdtwcbbhfsn",
		word: "forest",
		s207: true
	},
	{
		id: "vgxbwtdjwjjbkqpdhcwwwvd",
		word: "four",
		s207: true
	},
	{
		id: "stlmtgdcvhkfzhxt",
		word: "freeze (something)",
		s207: true,
		l200: true
	},
	{
		id: "flvcfzhcwtpmnrqhrzzx",
		word: "friend",
		l200: true
	},
	{
		id: "mthblxwxvlwnxwchdlpbcbld",
		word: "front (of object/building)",
		l200: true
	},
	{
		id: "hlczflvltjvjdmrncjrbfjjr",
		word: "fruit",
		s207: true,
		l200: true
	},
	{
		id: "mmgkphbrmdxmgjqmcp",
		word: "full",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		asjp: true
	},
	{
		id: "hdzsvzptlmrdmlsphhf",
		word: "girl (female child)",
		l200: true
	},
	{
		id: "fnqzttxmmgkffqpdrkdr",
		word: "girl (young woman)",
		l200: true
	},
	{
		id: "hzrkrmhhfsppzlbbcnkvr",
		word: "give (verb)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "cpwksctpxrvvdhrnscwbhs",
		word: "go (on foot)",
		lj: true,
		l200: true
	},
	{
		id: "zjtjpnrdllgsrszvnkm",
		word: "good",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "cwksjlmhtcshrwqr",
		word: "grass",
		s207: true,
		ssl: true
	},
	{
		id: "vcdfzvrqbmtlxpfjn",
		word: "grease/fat",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		id: "rvqgfkwhvpldqbcsrdk",
		word: "green (color)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		id: "srhsrzvjpndnbfcxbgzlzzf",
		word: "grow (intransitive verb)",
		l200: true
	},
	{
		id: "nwkbkhctcqtggxmpw",
		word: "guts (body part)",
		s207: true
	},
	{
		id: "clfqszzqvhhtczdpzcxgxjb",
		word: "hair (mass on head of humans)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "gjsjjdnxglkxqzmxlrhrjpm",
		word: "hand (noun)",
		sy: true,
		s100: true,
		s207: true,
		asjp: true,
		l200: true
	},
	{
		id: "ltwwskrbpqwtsts",
		word: "happy",
		l200: true
	},
	{
		id: "vfvfssvvnfhzzxnvqbv",
		word: "hard (not soft)",
		lj: true,
		l200: true
	},
	{
		id: "qvsxnqtkzppdfgr",
		word: "head (anatomic)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "xswnswmjkkwjswwqjwqzk",
		word: "hear (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "hckgbzwbbzjzlxnfns",
		word: "heart (body part)",
		s100: true,
		s207: true,
		d: true,
		l200: true
	},
	{
		id: "qcktlfjjxbhdpnxsdkwwp",
		word: "heavy",
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "zrhvvncpwctxfklqzbcszfdh",
		word: "here",
		s207: true
	},
	{
		id: "dgstvntvbfhnmnkv",
		word: "hide (verb)",
		lj: true
	},
	{
		id: "wgpkhvfmdsndwrn",
		word: "high (in altitude)",
		l200: true
	},
	{
		id: "gcbshvtpqwqzshq",
		word: "hit/beat (verb)",
		s207: true,
		lj: true
	},
	{
		id: "ktkfxgzqbpstmdk",
		word: "hold (verb)",
		s207: true
	},
	{
		id: "bjmqqtfgwsjsdkwchwvb",
		word: "horn (animal part)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		id: "wgfqqqtgcblnwpplpqw",
		word: "hot",
		s100: true,
		l200: true
	},
	{
		id: "frfgwlkprstxpbhxvr",
		word: "house (noun)",
		lj: true,
		l200: true
	},
	{
		id: "hlbxqslqtgcgmknlf",
		word: "how",
		s207: true,
		ssl: true
	},
	{
		id: "sgdbvsqljzvwdsqjhxpzcdp",
		word: "hunt (verb)",
		s207: true,
		ssl: true
	},
	{
		id: "nlrndgqfsnrskqknj",
		word: "hurt/injure (verb)",
		l200: true
	},
	{
		id: "rzkzwtzwrmtbdndppxbsg",
		word: "husband",
		s207: true,
		ssl: true
	},
	{
		id: "vnhjmsmcwmgxljpn",
		word: "ice",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "khrfxbpkshcpkvxq",
		word: "if",
		s207: true,
		ssl: true
	},
	{
		id: "kgktskwmrjcrbdbgmbpc",
		word: "in",
		s207: true,
		lj: true
	},
	{
		id: "tftzzgbpphpdgzbdfflhwqb",
		word: "kick (verb)",
		l200: true
	},
	{
		id: "dtkxrbqsgdqccbrfbkz",
		word: "kill (verb)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		id: "gvwbcfhpvfbtznkfkkrp",
		word: "kill/murder",
		l200: true
	},
	{
		id: "jplcnzpdpxhqxjjpvrbkn",
		word: "knee",
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "kjtvsltcjpmsqnmcrwjlrkhh",
		word: "know (a person)",
		l200: true
	},
	{
		id: "dhqlwfqdzwmwtzvvhvkkt",
		word: "know (information)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "ngndjjzxtqnwqtkmq",
		word: "lake",
		s207: true,
		l200: true
	},
	{
		id: "kqpqlpgsdcgwzljdlfqr",
		word: "laugh (verb)",
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "mpgqjgxrtfjgfljcgpzphs",
		word: "leaf (fallen off)",
		l200: true
	},
	{
		id: "kprnpqvdddzfvwbqfsstxs",
		word: "leaf (on plant)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "lxljvddndnrsddtwrhxxnzgh",
		word: "left (not right)",
		s207: true,
		l200: true
	},
	{
		id: "fdbbsjvhcdztldb",
		word: "leg",
		s207: true,
		lj: true
	},
	{
		id: "xgjhdvwqjjdwwvrkpnvdptq",
		word: "lie (on back)",
		l200: true
	},
	{
		id: "xwxnjrkzjhcznbs",
		word: "lie (on side, recline, as in a bed)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		id: "jfxqtphrlwqtcvvpwqnlkpf",
		word: "life (experience of living)",
		l200: true
	},
	{
		id: "nbzgcmtsdcqffqglkfm",
		word: "light (natural)",
		l200: true
	},
	{
		id: "fjdtcprgcdhnwkxmqvkqhp",
		word: "live (verb)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "hwtfzqcxspvwmqcjrhf",
		word: "liver",
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		id: "qnvxtvxdtpntbfcvklzlkrm",
		word: "long (not wide)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "zhqbchknmkzllqwrmzrsthqv",
		word: "louse/nit",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		id: "txzjqqxwsfnczkj",
		word: "love (as a friend)",
		l200: true
	},
	{
		id: "mjpjtqmjtvsvxtlzgpgtjmp",
		word: "love (romantically)",
		l200: true
	},
	{
		id: "vfvjgvpmmcpmblwrwjr",
		word: "low (in altitude)",
		l200: true
	},
	{
		id: "jcbkbmchqrdrksbvjjj",
		word: "man (adult male)",
		s100: true,
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "fcdkfdcjrcrhmcrwjmscxzll",
		word: "many",
		s100: true,
		s207: true
	},
	{
		id: "sqcqvnbvjpwrtwhcqbp",
		word: "meat",
		l200: true
	},
	{
		id: "dgbwcqblwtcwpslfzfqnh",
		word: "meet (for the first time)",
		l200: true
	},
	{
		id: "cjjfwxrptlvtlxslgnnjcdtj",
		word: "mind (center of thoughts and emotions)",
		l200: true
	},
	{
		id: "gdkqxzclpnwqgltndttx",
		word: "moon",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "xpmnkdzdgsqvwktvxh",
		word: "morning (early morning)",
		l200: true
	},
	{
		id: "tqtnqbvdqxxpthgpzjc",
		word: "morning (late morning)",
		l200: true
	},
	{
		id: "fdkwttrlmrckbhntqmqhrzp",
		word: "mother (noun)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "rdtkgsmlfcjcbpwcmncwq",
		word: "mountain (not hill)",
		s100: true,
		s207: true,
		ssl: true,
		asjp: true,
		l200: true
	},
	{
		id: "qtxhlbsncrdxnqgxnsh",
		word: "mouth (body part)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "gdmwjvvrqtqnhcbjk",
		word: "music",
		l200: true
	},
	{
		id: "tphsrhjbctwpwbzzmwswk",
		word: "name (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		id: "pgsnjpzgqcjxhtf",
		word: "narrow (adjective)",
		s207: true,
		ssl: true
	},
	{
		id: "mnvvsdvsshkxhpshbj",
		word: "navel",
		lj: true
	},
	{
		id: "qvphtqsvwrqppwv",
		word: "near",
		s207: true
	},
	{
		id: "fsspztrnhdrhgxltntdfbjws",
		word: "neck (not nape)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "cvwxxhrkrnbjdmhts",
		word: "new",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "cqrlgzgrtmgltbtswjmqz",
		word: "night/nighttime",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "hhxwpjtvbcqksbmxblf",
		word: "no/not",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true
	},
	{
		id: "rptqtbxnxkvzbghwrhb",
		word: "nose",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "jndpxqbmjgtgrmhz",
		word: "old (not new)",
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "rbsbjfsqpvldjmc",
		word: "older brother (of a brother)",
		l200: true
	},
	{
		id: "pmnskndmqnzzkxxphw",
		word: "older brother (of a sister)",
		l200: true
	},
	{
		id: "xqcwbgtjtcxdsgfmg",
		word: "older sister (of a brother)",
		l200: true
	},
	{
		id: "nxtpwhbztxzcsfjggng",
		word: "older sister (of a sister)",
		l200: true
	},
	{
		id: "hpbgmkmchnllqwzkg",
		word: "one",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		asjp: true
	},
	{
		id: "tkssspcrknctrbk",
		word: "open (one's eyes)",
		l200: true
	},
	{
		id: "vjdwmmxpxssjznhtprm",
		word: "other",
		s207: true,
		ssl: true
	},
	{
		id: "xfpqtmjvccxzkcw",
		word: "path/road/trail (not street)",
		s100: true,
		s207: true,
		asjp: true
	},
	{
		id: "gntxtjjcnfqprhgjnhsdpmb",
		word: "person (individual human)",
		s100: true,
		s207: true,
		ssl: true,
		asjp: true,
		l200: true
	},
	{
		id: "pmpwmqpkcvgnsck",
		word: "pig",
		ssl: true
	},
	{
		id: "qgzlxzsbfdvfkrdbfhwgfgq",
		word: "plant (botanical noun)",
		l200: true
	},
	{
		id: "mxwxnfpzmdgfclvgvbpwpl",
		word: "play (a game)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "kfknpgmpwrdtnkjwszdbf",
		word: "pull (verb)",
		s207: true,
		l200: true
	},
	{
		id: "spqszlpmkltzgsdkpfshsnh",
		word: "push (verb)",
		s207: true,
		l200: true
	},
	{
		id: "ppnfsrtpvwhgthhvmwnfk",
		word: "rain (noun)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "zznbxghblsgzblfnnqnxbgn",
		word: "red (color)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		id: "dcrxjzzcgxqwqxdjrt",
		word: "right (not left)",
		s207: true,
		l200: true
	},
	{
		id: "nxgcqpjdsqhkccmkv",
		word: "river",
		s207: true,
		ssl: true
	},
	{
		id: "qkgbttzwrxjnwpkkgcxfpt",
		word: "river (flowing into another river)",
		l200: true
	},
	{
		id: "nzfkdvbtbftsrxlvcxrfv",
		word: "river (flowing into the sea)",
		l200: true
	},
	{
		id: "zcgzwdlfqtwjhbtlxq",
		word: "root (botanics)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		id: "qqxvrscnvxjqxlbkwxj",
		word: "rope",
		s207: true,
		ssl: true,
		lj: true
	},
	{
		id: "vvzbblhtdxdgcrw",
		word: "rotten",
		s207: true
	},
	{
		id: "clnqpgtgjvxlhpcwj",
		word: "rough (of surface)",
		l200: true
	},
	{
		id: "ppjczzpvfmqhrtcnjj",
		word: "round (spherical)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "dzxtkldhvwrrdtdfkgj",
		word: "rub (verb)",
		s207: true
	},
	{
		id: "xjfxvmmwhhkwkwtl",
		word: "run (verb)",
		lj: true,
		l200: true
	},
	{
		id: "lpjbrrkhxbsgwpqbbcdkwzjj",
		word: "sad",
		l200: true
	},
	{
		id: "sqlnnrvcxszmlcmsvrbjmq",
		word: "salt",
		sy: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		id: "xstsvtbshjhrxnbrqb",
		word: "salt (in sea)",
		l200: true
	},
	{
		id: "tbtpjgbwrbcxfzgqn",
		word: "sand",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "smbpbppcfnxpspfsxntztb",
		word: "say (verb)",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "nwznchbjbcknzdxmgjzdntdq",
		word: "scratch (verb)",
		s207: true
	},
	{
		id: "mftsxfcrwdrpjmwcd",
		word: "sea/ocean",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "lsthrdhfknfcgzrstnk",
		word: "see (verb)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "rdwnrrwkrchcnlxsdktd",
		word: "seed (in fruit)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "wxxxwmtznxkggxwtrwk",
		word: "seed (to be planted)",
		l200: true
	},
	{
		id: "ltbhzkfnfpljkqlwq",
		word: "sew (verb)",
		s207: true
	},
	{
		id: "mgzldtxnpbbzkqhdnx",
		word: "shade/shadow",
		lj: true
	},
	{
		id: "pqksmxptlgcdstrmljlhjhnw",
		word: "sharp (as a knife)",
		s207: true,
		ssl: true
	},
	{
		id: "llsqsvzwqhccqsvwnhgvn",
		word: "short (height)",
		s207: true,
		ssl: true
	},
	{
		id: "kcpwggblkqqzcpnlztggk",
		word: "short (length)",
		l200: true
	},
	{
		id: "szmzrxmqkkvgpmzn",
		word: "sing (verb)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "smtdbnmrwqslbnxsch",
		word: "sister",
		ssl: true
	},
	{
		id: "wkdfwhvwbqfhfxntp",
		word: "sit (verb)",
		s100: true,
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "lpknjhdtcvbfgpqdrpr",
		word: "skin/hide (body part)",
		s100: true,
		s207: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "qkpfzrszbjhmjdhkd",
		word: "sky",
		s207: true,
		l200: true
	},
	{
		id: "jrxhvdpwpsbgqrgdkcmjvfd",
		word: "sleep (verb)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "llndnmfvtrvzsbmk",
		word: "slow (adjective)",
		l200: true
	},
	{
		id: "shvkjdsmnlxpgdpfwjv",
		word: "small",
		s100: true,
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "phqpwjptkmpqrrvcsf",
		word: "smell (verb)",
		s207: true
	},
	{
		id: "vqzgrgsnchzsgdln",
		word: "smoke (noun, of fire)",
		s100: true,
		s207: true,
		lj: true
	},
	{
		id: "qjlzhpdzrcqdxfdjgfmnhwm",
		word: "smooth (adjective)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "pdfqxmdpdxrvzjmdbnq",
		word: "snake (animal)",
		s207: true,
		ssl: true
	},
	{
		id: "rktbvklqxzdmmsxg",
		word: "snow",
		s207: true,
		ssl: true
	},
	{
		id: "fplvmphtldqbgbssq",
		word: "soft",
		l200: true
	},
	{
		id: "cxldshsszhpxfkq",
		word: "soil",
		lj: true,
		l200: true
	},
	{
		id: "vgqrqhqsvhdmqctzbwm",
		word: "some",
		s207: true
	},
	{
		id: "cggrlvlxbmfpxbjwp",
		word: "son (of a father)",
		l200: true
	},
	{
		id: "cbnwbwltkxbtqbzlxfc",
		word: "son (of a mother)",
		l200: true
	},
	{
		id: "cpctlnzvcmfvbjcgb",
		word: "speak/talk (verb)",
		l200: true
	},
	{
		id: "wvjxzzkzvpjqgldtmnkrt",
		word: "spit (verb)",
		s207: true
	},
	{
		id: "qvlvfhztwrtmglpfxlp",
		word: "split (verb)",
		s207: true
	},
	{
		id: "vjqfxdpxwrqwcptvckbt",
		word: "squeeze (verb)",
		s207: true
	},
	{
		id: "ktvtjngzfqkbxvjwgt",
		word: "stab (verb)",
		s207: true
	},
	{
		id: "tkdbnnxbpnmzscnf",
		word: "stand (verb)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "wbfrwqjbcdqbrnvsvlfhz",
		word: "star (astronomical)",
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "knftphjmjfgwxgljs",
		word: "stick (noun)",
		s207: true,
		l200: true
	},
	{
		id: "xtdsjwjddrnztnpdfkcbw",
		word: "stone/rock (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		asjp: true,
		l200: true
	},
	{
		id: "jdrkctxgtsvhndxd",
		word: "straight",
		s207: true,
		l200: true
	},
	{
		id: "fttqvwtxcgwhghtr",
		word: "suck (verb)",
		s207: true,
		lj: true
	},
	{
		id: "tddglgxlwbgxnxchlnvmljm",
		word: "sun",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		asjp: true,
		l200: true
	},
	{
		id: "vlnrsrqzxdnbgmdtdtzzpl",
		word: "sweet",
		lj: true
	},
	{
		id: "bjhkqrgmndsmbxlgmdtw",
		word: "swell (verb)",
		s207: true
	},
	{
		id: "xcgqrndfggdgqldjpnxbcxsw",
		word: "swim (verb)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "fqbjrdgdjkjpjzgbjncjjs",
		word: "tail (body part)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true
	},
	{
		id: "tltwzhhfnbsncqnfwbnk",
		word: "take (pick up and carry)",
		lj: true,
		l200: true
	},
	{
		id: "lmgdnmxnxnnskqckltnwwm",
		word: "tear/teardrop",
		d: true,
		l200: true
	},
	{
		id: "zqhkbgslvrmfwtv",
		word: "thank",
		l200: true
	},
	{
		id: "zkbsvgwflgcqslcgr",
		word: "that",
		s100: true,
		s207: true
	},
	{
		id: "xnqhffkpjqqmknsxkqd",
		word: "there",
		s207: true
	},
	{
		id: "nmbzwfbwqkspdtnfn",
		word: "thick",
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "qqnpkgncccrzwmzth",
		word: "thigh",
		lj: true
	},
	{
		id: "wkpqbqwhkrtjqpkqrcv",
		word: "thin",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "ncshpkcppdcpjhkxzpn",
		word: "think (verb)",
		s207: true,
		l200: true
	},
	{
		id: "glsxnsnnrnndxfc",
		word: "this",
		sy: true,
		s100: true,
		s207: true,
		lj: true
	},
	{
		id: "kmddcwxgtthpgnmdpfn",
		word: "three",
		s207: true
	},
	{
		id: "thgffdvkwhdmqgvqjhttrmr",
		word: "throw (verb)",
		s207: true,
		l200: true
	},
	{
		id: "jsqgnlvrwzqtzwngslpcc",
		word: "tie (verb)",
		s207: true,
		lj: true
	},
	{
		id: "njkqgnpczrdjxbsrcd",
		word: "tongue (part of body)",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true,
		l200: true
	},
	{
		id: "pzvxgjjscscnsrwgmt",
		word: "tooth",
		sy: true,
		s100: true,
		s207: true,
		lj: true,
		d: true,
		asjp: true,
		l200: true
	},
	{
		id: "hbpkxjstqxtmxdxpgxvzgbbl",
		word: "top (of object/mountain)",
		l200: true
	},
	{
		id: "lwqtbkvmnwmqjzvhvqnlcd",
		word: "touch (verb)",
		l200: true
	},
	{
		id: "phblcwkclxzhmdsngmbdg",
		word: "tree (not log)",
		s100: true,
		s207: true,
		ssl: true,
		asjp: true,
		l200: true
	},
	{
		id: "wtkrllhnsdkkctjrkhsgtg",
		word: "turn (intransitive verb)",
		s207: true,
		l200: true
	},
	{
		id: "hmtfnmvmwhzgfzrchddvpvrt",
		word: "two/pair",
		sy: true,
		s100: true,
		s207: true,
		d: true,
		asjp: true
	},
	{
		id: "sqpzgcwmchchbfxlnfhdw",
		word: "vomit (verb)",
		s207: true,
		ssl: true
	},
	{
		id: "fbdlxqtcspwpsblpnkft",
		word: "walk (verb)",
		s100: true,
		s207: true,
		l200: true
	},
	{
		id: "xnqfxzbpvrtfjmmmkxtvbgq",
		word: "warm (adjective)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "njprzssrcrkbgjtczgbckvvg",
		word: "wash (body parts)",
		s207: true,
		l200: true
	},
	{
		id: "khkgjckrzhvmsgnsz",
		word: "water (as drink or for cooking, cold)",
		l200: true
	},
	{
		id: "qhdgpsgljfzcczlndnxh",
		word: "water (as drink or for cooking, hot)",
		l200: true
	},
	{
		id: "gcrgztxfrqqlcxbgwdfd",
		word: "water (cold, moving)",
		l200: true
	},
	{
		id: "rwbtkcpmbsgvfdktbxzbvx",
		word: "water (cold, not moving)",
		l200: true
	},
	{
		id: "tvbvjzjvmgkrhmvlxk",
		word: "water (hot, moving)",
		l200: true
	},
	{
		id: "zpngslmfgqnwcrbszwn",
		word: "water (hot, not moving)",
		l200: true
	},
	{
		id: "gfmstxpmfwqtwhgxpkbwgfqq",
		word: "water (noun)",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true,
		asjp: true
	},
	{
		id: "mgbrndcclxhtsftlbd",
		word: "wet (adjective)",
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "hwmwdqjtjgrqrcst",
		word: "what?",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true
	},
	{
		id: "hmxkbvkwwbjhwllqhkxntfp",
		word: "when?",
		s207: true,
		ssl: true
	},
	{
		id: "jlhbdcsmtbwjtfvwbsvn",
		word: "where?",
		s207: true,
		ssl: true
	},
	{
		id: "kjddmmcvwxvkkxwxcvh",
		word: "white (color)",
		s100: true,
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "cwcmkvsgqlrqrtq",
		word: "who?",
		sy: true,
		s100: true,
		s207: true,
		ssl: true,
		lj: true,
		d: true
	},
	{
		id: "qvfwrnfcscfwgkfwgrxb",
		word: "wide",
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "rxbmbswxvsrrtrjkth",
		word: "wife",
		s207: true,
		ssl: true
	},
	{
		id: "wcfxldblpfdxfvp",
		word: "wind (noun)",
		sy: true,
		s207: true,
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "rldjhdwrjlmtcgsstblkdfv",
		word: "wing (anatomic)",
		s207: true,
		lj: true,
		l200: true
	},
	{
		id: "gzhjqvxjdlnscjz",
		word: "wipe (verb)",
		s207: true
	},
	{
		id: "crsxnrmftnprwxbmbsscgq",
		word: "with",
		s207: true,
		ssl: true
	},
	{
		id: "zwhgvdsztwlwwwr",
		word: "woman",
		s100: true,
		s207: true,
		ssl: true,
		l200: true
	},
	{
		id: "kjfcskwpzqxhbcwq",
		word: "wood",
		ssl: true,
		lj: true,
		l200: true
	},
	{
		id: "kpscwpvlkhmqznj",
		word: "work",
		ssl: true
	},
	{
		id: "gvflnzgbzppwgblsntztd",
		word: "world",
		l200: true
	},
	{
		id: "vznlqtkcnmqqwbzxss",
		word: "worm (animal)",
		s207: true,
		ssl: true
	},
	{
		id: "jplwmtgvnfxfzzllsw",
		word: "year",
		sy: true,
		s207: true,
		ssl: true
	},
	{
		id: "qnwdtgtjbfgqtnvb",
		word: "yellow (color)",
		s100: true,
		s207: true,
		ssl: true
	},
	{
		id: "mvdtpmgkszxkfrxvvhrfm",
		word: "yesterday",
		lj: true
	},
	{
		id: "ndpdzqvrnrqlbzzgjndj",
		word: "younger brother (of a brother)",
		l200: true
	},
	{
		id: "ckrltfcbtgmvwzkcprwwdq",
		word: "younger brother (of a sister)",
		l200: true
	},
	{
		id: "cgrlqgnnvkfwvfpvkj",
		word: "younger sister (of a brother)",
		l200: true
	},
	{
		id: "rmfchhzgkxwjsrxwzghwfzk",
		word: "younger sister (of a sister)",
		l200: true
	}
];

/*
const x = {};
const out = [];
function garble () {
	const e = Math.floor(Math.random() * 10) + 15;
	let output = "";
	for (let x = 0; x < e; x++) {
		output += "qwrtpsdfghjklzxcvbnm!"[Math.floor(Math.random() * 20)];
	}
	return output;
};
Concepts.forEach(word => {
	let id;
	do {
		id = garble();
	} while(x[id]);
	out.push({id, ...word});
});
console.log(out);
*/