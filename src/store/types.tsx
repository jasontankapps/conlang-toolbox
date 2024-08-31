import { Dispatch, SetStateAction } from "react";
import { LanguageCode } from "iso-639-1";
import RangeStartToEndMinusOne from "../components/NumericRange";

export type Zero_OneHundred = RangeStartToEndMinusOne<0, 101>;
export type Two_Fifteen = RangeStartToEndMinusOne<2, 16>;
export type Zero_Fifty = RangeStartToEndMinusOne<0, 51>;
export type Five_OneHundred = RangeStartToEndMinusOne<5, 101>;
type FOTPartOne = RangeStartToEndMinusOne<50, 287>;
type FOTPartTwo = RangeStartToEndMinusOne<287, 525>;
type FOTPartThree = RangeStartToEndMinusOne<525, 762>;
type FOTPartFour = RangeStartToEndMinusOne<762, 999>;
export type Fifty_OneThousand = FOTPartOne | FOTPartTwo | FOTPartThree | FOTPartFour | 999 | 1000;

//
// SORTING SETTINGS
//

export type SortSeparator = "" | "," | ";" | " " | ".";

export interface RelationObject {
	id: string
	base: string
	pre: string[]
	post: string[]
	separator: SortSeparator
}

export interface EqualityObject {
	id: string
	base: string
	equals: string[]
	separator: SortSeparator
}

export type SortLanguage = LanguageCode | "unicode";

export type SortSensitivity = "base" | "accent" | "case" | "variant";

export interface SortObject {
	id: string
	title: string
	sortLanguage?: SortLanguage
	sensitivity?: SortSensitivity
	customAlphabet?: string[]
	separator?: SortSeparator
	customizations?: (RelationObject | EqualityObject)[]
	multiples?: string[]
}

export type SorterFunc = (x: string, y: string) => number

export interface SortInformation {
	sortLanguage: SortLanguage
	sensitivity: SortSensitivity
	sortObject: SortObject | null
}

export interface SortSettings {
	customSorts: SortObject[]
	sortLanguage?: SortLanguage
	sensitivity: SortSensitivity
	defaultCustomSort?: string
}

//
// WORDGEN
//
export interface WGCharGroupObject {
	title: string
	label: string
	run: string
	dropoffOverride?: Zero_Fifty
}
export interface WGTransformObject {
	id: string
	seek: string
	replace: string
	description: string
}
export type WGOutputTypes = "text" | "wordlist" | "syllables";
export type SyllableTypes = "singleWord" | "wordInitial" | "wordMiddle" | "wordFinal";
export interface SyllableDropoffs {
	singleWord: null | Zero_Fifty
	wordInitial: null | Zero_Fifty
	wordMiddle: null | Zero_Fifty
	wordFinal: null | Zero_Fifty
}
export interface WGSettings {
	// SETTINGS
	monosyllablesRate: Zero_OneHundred
	maxSyllablesPerWord: Two_Fifteen
	characterGroupDropoff: Zero_Fifty
	syllableBoxDropoff: Zero_Fifty
	capitalizeSentences: boolean
	declarativeSentencePre: string
	declarativeSentencePost: string
	interrogativeSentencePre: string
	interrogativeSentencePost: string
	exclamatorySentencePre: string
	exclamatorySentencePost: string
	customSort: string | null
}
export interface WGSyllables {
	// SYLLABLES
	multipleSyllableTypes: boolean
	singleWord: string
	wordInitial: string
	wordMiddle: string
	wordFinal: string
	syllableDropoffOverrides: SyllableDropoffs
}
export type Base_WG = WGSyllables & WGSettings & {
	// GROUPS
	characterGroups: WGCharGroupObject[]
	// TRANSFORMS
	transforms: WGTransformObject[]
};
export interface WGMoreSettings {
	output: WGOutputTypes
	showSyllableBreaks: boolean
	sentencesPerText: Five_OneHundred
	capitalizeWords: boolean
	sortWordlist: boolean
	wordlistMultiColumn: boolean
	wordsPerWordlist: Fifty_OneThousand
}
export type WGState = Base_WG & WGMoreSettings;
export type WGPresetArray = [
	string,
	Base_WG
][];

//
// WORDEVOLVE
//

export interface WECharGroupObject {
	title: string
	label?: string
	run: string
}
export type WETransformDirection = "both" | "in" | "out" | "double";
export interface WETransformObject {
	id: string
	seek: string
	replace: string
	direction: WETransformDirection
	description: string
}
export interface WESoundChangeObject {
	id: string
	seek: string
	replace: string
	context: string
	anticontext: string
	description: string
}
export type WEOutputTypes = "outputOnly" | "rulesApplied" | "inputFirst" | "outputFirst";
export interface WEPresetObject {
	characterGroups: WECharGroupObject[]
	soundChanges: WESoundChangeObject[]
	transforms: WETransformObject[]
}
export interface WEState extends WEPresetObject {
	input: string
	outputStyle: WEOutputTypes
	inputLower: boolean
	inputAlpha: boolean
	customSort: string | null
}
export type WEPresets = [
	string,
	WEPresetObject
][];

//
// MORPHOSYNTAX
//

export type MSBool = "BOOL_prefixMost" | "BOOL_prefixLess" | "BOOL_suffixMost" | "BOOL_suffixLess"
				| "BOOL_circumfixMost" | "BOOL_circumfixLess" | "BOOL_infixMost" | "BOOL_infixLess"
				| "BOOL_actions" | "BOOL_actionProcesses" | "BOOL_weather" | "BOOL_states"
				| "BOOL_involuntaryProcesses" | "BOOL_bodyFunctions" | "BOOL_motion" | "BOOL_position"
				| "BOOL_factive" | "BOOL_cognition" | "BOOL_sensation" | "BOOL_emotion"
				| "BOOL_utterance" | "BOOL_manipulation" | "BOOL_otherVerbClass" | "BOOL_lexVerb"
				| "BOOL_lexNoun" | "BOOL_lexVN" | "BOOL_lexVorN" | "BOOL_adjectives" | "BOOL_baseFive"
				| "BOOL_baseTen" | "BOOL_baseTwenty" | "BOOL_baseOther" | "BOOL_numGL" | "BOOL_numLG"
				| "BOOL_numNone" | "BOOL_multiNumSets" | "BOOL_inflectNum" | "BOOL_APV" | "BOOL_AVP"
				| "BOOL_PAV" | "BOOL_PVA" | "BOOL_VAP" | "BOOL_VPA" | "BOOL_preP" | "BOOL_postP"
				| "BOOL_circumP" | "BOOL_numSing" | "BOOL_numDual" | "BOOL_numTrial" | "BOOL_numPaucal"
				| "BOOL_numPlural" | "BOOL_classGen" | "BOOL_classAnim" | "BOOL_classShape" | "BOOL_classFunction"
				| "BOOL_classOther" | "BOOL_dimAugYes" | "BOOL_dimAugObligatory" | "BOOL_dimAugProductive"
				| "BOOL_nomAcc" | "BOOL_ergAbs" | "BOOL_markInv" | "BOOL_markDirInv" | "BOOL_verbAgreeInv"
				| "BOOL_wordOrderChange" | "BOOL_tenseMorph" | "BOOL_aspectMorph" | "BOOL_modeMorph"
				| "BOOL_otherMorph" | "BOOL_chainFirst" | "BOOL_chainLast" | "BOOL_chainN" | "BOOL_chainV"
				| "BOOL_chainCj" | "BOOL_chainT" | "BOOL_chainA" | "BOOL_chainPer" | "BOOL_chainNum"
				| "BOOL_chainOther" | "BOOL_relPre" | "BOOL_relPost" | "BOOL_relInternal"
				| "BOOL_relHeadless" | "BOOL_coordMid" | "BOOL_coordTwo" | "BOOL_coordLast";
export type MSNum = "NUM_synthesis" | "NUM_fusion" | "NUM_stemMod" | "NUM_suppletion" | "NUM_redupe"
				| "NUM_supraMod" | "NUM_headDepMarked";
export type MSText = "TEXT_tradTypol" | "TEXT_morphProcess" | "TEXT_headDepMark" | "TEXT_propNames"
				| "TEXT_possessable" | "TEXT_countMass" | "TEXT_pronounAnaphClitic" | "TEXT_semanticRole"
				| "TEXT_verbClass" | "TEXT_verbStructure" | "TEXT_propClass" | "TEXT_quantifier"
				| "TEXT_numeral" | "TEXT_adverb" | "TEXT_mainClause" | "TEXT_verbPhrase" | "TEXT_nounPhrase"
				| "TEXT_adPhrase" | "TEXT_compare" | "TEXT_questions" | "TEXT_COType" | "TEXT_compounding"
				| "TEXT_denoms" | "TEXT_nNumberOpt" | "TEXT_nNumberObl" | "TEXT_nCase" | "TEXT_articles"
				| "TEXT_demonstratives" | "TEXT_possessors" | "TEXT_classGender" | "TEXT_dimAug"
				| "TEXT_predNom" | "TEXT_predLoc" | "TEXT_predEx" | "TEXT_predPoss" | "TEXT_ergative"
				| "TEXT_causation" | "TEXT_applicatives" | "TEXT_dativeShifts" | "TEXT_datOfInt"
				| "TEXT_possessRaising" | "TEXT_refls" | "TEXT_recips" | "TEXT_passives" | "TEXT_inverses"
				| "TEXT_middleCon" | "TEXT_antiP" | "TEXT_objDemOmInc" | "TEXT_verbNoms" | "TEXT_verbComp"
				| "TEXT_tense" | "TEXT_aspect" | "TEXT_mode" | "TEXT_locDirect" | "TEXT_evidence"
				| "TEXT_miscVerbFunc" | "TEXT_pragFocusEtc" | "TEXT_negation" | "TEXT_declaratives"
				| "TEXT_YNQs" | "TEXT_QWQs" | "TEXT_imperatives" | "TEXT_serialVerbs" | "TEXT_complClauses"
				| "TEXT_advClauses" | "TEXT_clauseChainEtc" | "TEXT_relClauses" | "TEXT_coords";
export type MSBoolType = {
	[key in MSBool]?: boolean
}
export type MSNumType = {
	[key in MSNum]?: number
}
export type MSTextType = {
	[key in MSText]?: string
}
export type MSInfo = MSBoolType & MSNumType & MSTextType
export interface MSBasics {
	id: string
	lastSave: number
	title: string
	description: string
}
export type MSState = MSBasics & MSInfo;

//
// LEXICON
//

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
export interface LexiconState {
	id: string
	lastSave: number
	title: string
	description: string
	columns: LexiconColumn[]
	truncateColumns: boolean
	lexicon: Lexicon[]
	sortDir: boolean
	sortPattern: number[]
	blankSort: LexiconBlankSorts
	fontType?: string
	customSort: string | undefined
}

//
// CONCEPTS
//

export interface ConceptDisplayObject {
	asjp?: boolean
	lj?: boolean
	d?: boolean
	sy?: boolean
	s100?: boolean
	s207?: boolean
	ssl?: boolean
	l200?: boolean
}
export interface Concept extends ConceptDisplayObject {
	id: string
	word: string
}
export interface ConceptCombo {
	id: string
	parts: Concept[]
}
export type ConceptDisplay = keyof Omit<Concept, "id" | "word">;
export interface ConceptsState {
	display: ConceptDisplayObject
	textCenter: boolean
	showingCombos: boolean
	combinations: ConceptCombo[]
}

//
// DECLENJUGATOR
//

export type DJSeparator = "," | ";" | " " | "/";

export type RegexPair = [string, string]; // simple regex match and replacement

export interface Declenjugation {
	title: string
	id: string
	prefix?: string
	suffix?: string
	regex?: RegexPair
	useWholeWord: boolean // by default, operates on stem; set true to operate on entire word
}

export interface DJGroup {
	title: string
	appliesTo: string
	id: string
	startsWith: string[]
	endsWith: string[]
	separator: DJSeparator
	regex?: RegexPair
	declenjugations: Declenjugation[]
}

export interface DJCustomInfo {
	declensions: DJGroup[]
	conjugations: DJGroup[]
	other: DJGroup[]
}

export interface DJState extends DJCustomInfo {
	input: string
}

//
// EXTRA CHARACTERS
//

export type ExtraCharactersList = string[];

export type ExtraCharactersGroups =
	"Latin" | "IPA" | "Greek" | "Coptic" | "Cyrillic" | "Armenian" | "Hebrew"
	| "Arabic" | "Thai" | "Lao" | "Hiragana" | "Katakana" | "Bopomofo";

export type ExtraCharactersDisplayName = ExtraCharactersGroups | "Favorites";

export interface ExtraCharactersObject {
	objects: { [key in ExtraCharactersGroups]: ExtraCharactersList  }
	contents: (ExtraCharactersDisplayName)[]
}
export interface ExtraCharactersState {
	faves: ExtraCharactersList
	toCopy: string
	copyImmediately: boolean
	showNames: boolean
	nowShowing: ExtraCharactersDisplayName
}

//
// SETTINGS
//

export type ThemeNames = "Default" | "Light" | "Dark" | "SolarizedLight" | "SolarizedDark";

export interface AppSettings {
	theme: ThemeNames
	disableConfirms: boolean
}

//
// INTERNALS
//

export interface Log {
	time: number,
	log: string[]
}

export interface InternalState {
	logs: Log[]
	defaultSortLanguage: SortLanguage
	lastClean: number
	lastViewMS: string
}

//
// MAIN
//

export interface StateObject {
	wg: WGState
	we: WEState
	ms: MSState
	dj: DJState
	lexicon: LexiconState
	concepts: ConceptsState
	ec: ExtraCharactersState
	appSettings: AppSettings
	sortSettings: SortSettings
	internals: InternalState
}

export type SetState<T extends unknown> = Dispatch<SetStateAction<T>>;
export type SetBooleanState = SetState<boolean>;
export type ModalPropsMaker = (x: boolean, y: SetBooleanState) => ({isOpen: boolean, setIsOpen: SetBooleanState})

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

// Import / Export/ Archive / Cleaning

export type ARCHIVE_MSBool = "prefixMost" | "prefixLess" | "suffixMost" | "suffixLess"
				| "circumfixMost" | "circumfixLess" | "infixMost" | "infixLess"
				| "actions" | "actionProcesses" | "weather" | "states"
				| "involuntaryProcesses" | "bodyFunctions" | "motion" | "position"
				| "factive" | "cognition" | "sensation" | "emotion"
				| "utterance" | "manipulation" | "otherVerbClass" | "lexVerb"
				| "lexNoun" | "lexVN" | "lexVorN" | "adjectives" | "baseFive"
				| "baseTen" | "baseTwenty" | "baseOther" | "numGL" | "numLG"
				| "numNone" | "multiNumSets" | "inflectNum" | "APV" | "AVP"
				| "PAV" | "PVA" | "VAP" | "VPA" | "preP" | "postP"
				| "circumP" | "numSing" | "numDual" | "numTrial" | "numPaucal"
				| "numPlural" | "classGen" | "classAnim" | "classShape" | "classFunction"
				| "classOther" | "dimAugYes" | "dimAugObligatory" | "dimAugProductive"
				| "nomAcc" | "ergAcc" | "markInv" | "markDirInv" | "verbAgreeInv"
				| "wordOrderChange" | "tenseMorph" | "aspectMorph" | "modeMorph"
				| "otherMorph" | "chainFirst" | "chainLast" | "chianLast" | "chainN" | "chainV"
				| "chainCj" | "chainT" | "chainA" | "chainPer" | "chainNum"
				| "chainOther" | "relPre" | "relPost" | "relInternal"
				| "relHeadless" | "coordMid" | "coordTwo" | "coordLast";
export type ARCHIVE_MSNum = "synthesis" | "fusion" | "stemMod" | "suppletion" | "redupe"
				| "supraMod" | "headDepMarked";
export type ARCHIVE_MSText = "tradTypol" | "morphProcess" | "headDepMark" | "propNames"
				| "possessable" | "countMass" | "pronounAnaphClitic" | "semanticRole"
				| "verbClass" | "verbStructure" | "propClass" | "quantifier"
				| "numeral" | "adverb" | "mainClause" | "verbPhrase" | "nounPhrase"
				| "adPhrase" | "compare" | "questions" | "COType" | "compounding"
				| "denoms" | "nNumberOpt" | "nNumberObl" | "case" | "articles"
				| "demonstratives" | "possessors" | "classGender" | "dimAug"
				| "predNom" | "predLoc" | "predEx" | "predPoss" | "ergative"
				| "causation" | "applicatives" | "dativeShifts" | "datOfInt"
				| "possessRaising" | "refls" | "recips" | "passives" | "inverses"
				| "middleCon" | "antiP" | "objDemOmInc" | "verbNoms" | "verbComp"
				| "tense" | "aspect" | "mode" | "locDirect" | "evidence"
				| "miscVerbFunc" | "pragFocusEtc" | "negation" | "declaratives"
				| "YNQs" | "QWQs" | "imperatives" | "serialVerbs" | "complClauses"
				| "advClauses" | "clauseChainEtc" | "relClauses" | "coords";

interface ARCHIVE_MSState {
	id?: string
	key: string
	lastSave: string
	title: string
	description: string
	bool?: any
	boolStrings: ARCHIVE_MSBool[]
	num: { [key in ARCHIVE_MSNum]: number }
	text: { [key in ARCHIVE_MSText]: string }
}
export type storedLex = [string, LexiconState][];
export type storedMS = [string, MSState | ARCHIVE_MSState][];
export type storedWG = [string, Base_WG][];
export type storedWE = [string, WEPresetObject][];
export type storedDJ = [string, DJCustomInfo][];
interface ARCHIVE_WordListsState {
	centerTheDisplayedWords: [ "center" ] | []
	listsDisplayed: { [key in keyof Omit<Concept, "id" | "word">]: boolean }
}
interface ARCHIVE_AppSettings {
	theme: "Default" | "Light" | "Dark" | "Solarized Light" | "Solarized Dark"
	disableConfirms: boolean
}
export interface ImportExportObject {
	currentVersion: string
	wg?: WGState
	we?: WEState
	ms?: MSState
	dj?: DJState
	lexicon?: LexiconState
	concepts?: ConceptsState
	wordLists?: ARCHIVE_WordListsState
	ec?: ExtraCharactersState
	appSettings?: AppSettings | ARCHIVE_AppSettings
	sortSettings?: SortSettings
	wgStored?: storedWG
	weStored?: storedWE
	msStored?: storedMS
	djStored?: storedDJ
	lexStored?: storedLex
	storages?: {
		lex: storedLex
		wg: storedWG
		we: storedWE
		mx: storedMS
	}
}
export interface StateCleanerObject {
	wg: (keyof WGState)[]
	we: (keyof WEState)[]
	ms: (keyof MSBasics)[]
	msBool: MSBool[]
	msNum: MSNum[]
	msText: MSText[]
	dj: (keyof DJState)[]
	lexicon: (keyof LexiconState)[]
	concepts: (keyof ConceptsState)[]
	ec: (keyof ExtraCharactersState)[]
	appSettings: (keyof AppSettings)[]
	sortSettings: (keyof SortSettings)[]
}
