import {
	ModalPropsMaker,
	SetBooleanState,
	Zero_OneHundred,
	Two_Fifteen,
	Zero_Fifty,
	Five_OneHundred,
	Fifty_OneThousand
} from "../store/types";

// helper functions and such
export type WGPresetArray = Map<string, WGPreset>;

export type WGPreset = {
	wordgenCharGroups: WGCharGroupStateObject
	wordgenSyllables: WGSyllableStateObject
	wordgenTransforms: WGTransformStateObject
	wordgenSettings: WGSettingsObject
};

// WORDGEN
export interface WGCharGroupObject {
	title: string
	label?: string
	run: string
	dropoffOverride?: Zero_Fifty
}

export type WGCharGroupMap = [string, WGCharGroupObject];

export interface WGCharGroupStateObject {
	map: WGCharGroupMap[]
	editing: null | string
}

export interface WGSyllableObject {
	components: string[]
	dropoffOverride?: Zero_Fifty
}

export interface AllWGSyllableObjects {
	singleWord: WGSyllableObject
	wordInitial: WGSyllableObject
	wordMiddle: WGSyllableObject
	wordFinal: WGSyllableObject
}

export interface WGSyllableStateObject {
	toggle: boolean
	objects: AllWGSyllableObjects
	editing?: keyof AllWGSyllableObjects
}

export interface WGTransformObject {
	key: string
	seek: string
	replace: string
	description: string
}

export interface WGTransformStateObject {
	list: WGTransformObject[]
	editing: null | string
}

export type WGOutputTypes = "text" | "wordlist" | "syllables";

export interface WGSettingsObject {
	monosyllablesRate: Zero_OneHundred
	maxSyllablesPerWord: Two_Fifteen
	charGroupRunDropoff: Zero_Fifty
	syllableBoxDropoff: Zero_Fifty
	output?: WGOutputTypes
	showSyllableBreaks?: boolean
	sentencesPerText?: Five_OneHundred
	capitalizeSentences: boolean
	declarativeSentencePre: string
	declarativeSentencePost: string
	interrogativeSentencePre: string
	interrogativeSentencePost: string
	exclamatorySentencePre: string
	exclamatorySentencePost: string
	capitalizeWords?: boolean
	sortWordlist?: boolean
	wordlistMultiColumn?: boolean
	wordsPerWordlist?: Fifty_OneThousand
}

export type WGCustomInfo = [WGCharGroupStateObject, WGSyllableStateObject, WGTransformStateObject, WGSettingsObject];

// WORDEVOLVE
export interface WECharGroupObject {
	title: string
	label?: string
	run: string
}

export type WECharGroupMap = [string, WECharGroupObject];

export interface WECharGroupStateObject {
	map: WECharGroupMap[]
	editing: null | string
}

export interface WETransformObject {
	key: string
	seek: string
	replace: string
	direction: "both" | "in" | "out" | "double"
	description: string
}

export interface WETransformStateObject {
	list: WETransformObject[]
	editing: null | string
}

export interface WESoundChangeObject {
	key: string
	seek: string
	replace: string
	context: string
	anticontext: string
	description: string
}

export interface WESoundchangeStateObject {
	list: WESoundChangeObject[]
	editing: null | string
}

export type WEInputObject = string[]

export type WEOutputTypes = "outputOnly" | "rulesApplied" | "inputFirst" | "outputFirst";

export type WECustomInfo = [WECharGroupStateObject, WETransformStateObject, WESoundchangeStateObject];

export interface WESettingsObject {
	output: WEOutputTypes
}

export interface WEPresetObject {
	charGroups: WECharGroupMap[],
	soundchanges: WESoundChangeObject[],
	transforms: WETransformObject[]
}


type SyntaxBool = "prefixMost" | "prefixLess" | "suffixMost" | "suffixLess" | "circumfixMost" | "circumfixLess"
				| "infixMost" | "infixLess" | "actions" | "actionProcesses" | "weather" | "states"
				| "involuntaryProcesses" | "bodyFunctions" | "motion" | "position" | "factive" | "cognition"
				| "sensation" | "emotion" | "utterance" | "manipulation" | "otherVerbClass" | "lexVerb"
				| "lexNoun" | "lexVN" | "lexVorN" | "adjectives" | "baseFive" | "baseTen" | "baseTwenty"
				| "baseOther" | "numGL" | "numLG" | "numNone" | "multiNumSets" | "inflectNum" | "APV" | "AVP"
				| "PAV" | "PVA" | "VAP" | "VPA" | "preP" | "postP" | "circumP" | "numSing" | "numDual"
				| "numTrial" | "numPaucal" | "numPlural" | "classGen" | "classAnim" | "classShape"
				| "classFunction" | "classOther" | "dimAugYes" | "dimAugObligatory" | "dimAugProductive"
				| "nomAcc" | "ergAcc" | "markInv" | "markDirInv" | "verbAgreeInv" | "wordOrderChange"
				| "tenseMorph" | "aspectMorph" | "modeMorph" | "otherMorph" | "chainFirst" | "chianLast"
				| "chainN" | "chainV" | "chainCj" | "chainT" | "chainA" | "chainPer" | "chainNum" | "chainOther"
				|"relPre" | "relPost" | "relInternal" | "relHeadless" | "coordMid" | "coordTwo" | "coordLast";
export type MorphoSyntaxBoolObject = {
	[key in SyntaxBool]?: boolean
}

type SyntaxNum = "synthesis" | "fusion" | "stemMod" | "suppletion" | "redupe" | "supraMod" | "headDepMarked";
export type MorphoSyntaxNumberObject = {
	[key in SyntaxNum]?: number
}

type SyntaxText = "tradTypol" | "morphProcess" | "headDepMark" | "propNames" | "possessable" | "countMass"
				| "pronounAnaphClitic" | "semanticRole" | "verbClass" | "verbStructure" | "propClass" | "quantifier"
				| "numeral" | "adverb" | "mainClause" | "verbPhrase" | "nounPhrase" | "adPhrase" | "compare"
				| "questions" | "COType" | "compounding" | "denoms" | "nNumberOpt" | "nNumberObl" | "case"
				| "articles" | "demonstratives" | "possessors" | "classGender" | "dimAug" | "predNom" | "predLoc"
				| "predEx" | "predPoss" | "ergative" | "causation" | "applicatives" | "dativeShifts" | "datOfInt"
				| "possessRaising" | "refls" | "recips" | "passives" | "inverses" | "middleCon" | "antiP"
				| "objDemOmInc" | "verbNoms" | "verbComp" | "tense" | "aspect" | "mode" | "locDirect" | "evidence"
				| "miscVerbFunc" | "pragFocusEtc" | "negation" | "declaratives" | "YNQs" | "QWQs" | "imperatives"
				| "serialVerbs" | "complClauses" | "advClauses" | "clauseChainEtc" | "relClauses" | "coords";
export type MorphoSyntaxTextObject = {
	[key in SyntaxText]?: string
}

export interface MorphoSyntaxObject {
	key: string
	lastSave: number
	title: string
	description: string
	bool: MorphoSyntaxBoolObject
	num: MorphoSyntaxNumberObject
	text: MorphoSyntaxTextObject
}


export interface PhonoGraphObject {}

/*
export interface Lexicon {
	key: string
	columns: string[]
}
export interface colEdit {
	columns: number
	columnOrder: number[]
	columnTitles: string[]
	columnSizes: ("s" | "m" | "l")[],
	sort: number[],
	reordering?: boolean
}
export interface LexiconObject {
	key: string
	lastSave: number
	title: string
	description: string
	columns: number
	columnOrder: number[]
	columnTitles: string[]
	columnSizes: ("s" | "m" | "l")[]
	sort: number[]
	sorted: boolean
	lexicon: Lexicon[]
	waitingToAdd: Lexicon[]
	editing: number | undefined
	colEdit: colEdit | undefined
	lexiconWrap: boolean
}
*/
export interface Lexicon {
	id: string
	columns: string[]
}
export interface LexiconColumn {
	id: string
	size: "s" | "m" | "l"
	label: string
}
export type LexiconBlankSorts = "alphaFirst" | "alphaLast" | "first" | "last";
export interface LexiconObject {
	id: string
	lastSave: number
	title: string
	description: string
	columns: LexiconColumn[]
	truncateColumns: boolean
	lexicon: Lexicon[]
	sortDir: boolean
	sortPattern: number[]
	blankSort: LexiconBlankSorts // 0.9.5+
	fontType?: string
}


export interface ViewStateObject {
	wg: string
	we: string
	wl: string
	ms: string
	ph: string
	lastSection: "wg" | "we" | "wl" | "ms" | "ph" | ""
}

export interface ExtraCharactersInfo {
	[key: string]: string
}

export type ExtraCharactersList = string[];

export type ExtraCharactersGroup = {
	[key: string]: ExtraCharactersList
}

export type ExtraCharactersDisplayName = keyof ExtraCharactersGroup | "Favorites";

export interface ExtraCharactersObject {
	objects: ExtraCharactersGroup
	contents: (ExtraCharactersDisplayName)[]
	charactersInfo: ExtraCharactersInfo
}

export interface ExtraCharactersState {
	display: string
	saved: string[]
	copyImmediately: boolean
	copyLater: string
	adding: boolean
	deleting: boolean
	showNames: boolean
	showHelp: boolean
}


export interface Concept {
	id: string,
	word: string
	asjp?: boolean
	lj?: boolean
	d?: boolean
	sy?: boolean
	s100?: boolean
	s207?: boolean
	ssl?: boolean
	l200?: boolean
}
export interface ConceptCombo {
	id: string
	parts: Concept[]
}
type ConceptDisplay = keyof Omit<Concept, "id" | "word">;
export interface ConceptsState {
	display: ConceptDisplay[]
	textCenter: boolean
	showingCombos: boolean
	combinations: ConceptCombo[]
}

export type SearchSensitivity = "base" | "accent" | "case" | "variant" | undefined;

export interface AppSettings {
	theme: string
	disableConfirms: boolean
	// to be used later
	sensitivity: SearchSensitivity
	// set automatically, not by user:
	sortLanguage: string
}

export interface StateObject {
	currentVersion: string
	appSettings: AppSettings
	wordgenCharGroups: WGCharGroupStateObject
	wordgenSyllables: WGSyllableStateObject
	wordgenTransforms: WGTransformStateObject
	wordgenSettings: WGSettingsObject
	wordevolveCharGroups: WECharGroupStateObject
	wordevolveTransforms: WETransformStateObject
	wordevolveSoundChanges: WESoundchangeStateObject
	wordevolveInput: WEInputObject
	wordevolveSettings: WESettingsObject
	morphoSyntaxInfo: MorphoSyntaxObject
	lexicon: LexiconObject
	viewState: ViewStateObject
	extraCharactersState: ExtraCharactersState
	conceptsState: ConceptsState
}
// Be sure to change stateObjectProps in ReducksDucks, too.
// Be sure to change stateObjectProps in ReducksDucks, too.
// Be sure to change stateObjectProps in ReducksDucks, too.
// Be sure to change stateObjectProps in ReducksDucks, too.
// Be sure to change stateObjectProps in ReducksDucks, too.

export interface PageData {
	modalPropsMaker: ModalPropsMaker
}

export interface ModalProperties {
	isOpen: boolean
	setIsOpen: SetBooleanState
}

export interface ExtraCharactersModalOpener {
	isOpen: boolean
	setIsOpen: SetBooleanState
	openECM: SetBooleanState
}

