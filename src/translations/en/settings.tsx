const settings = {

	DisableConfPrompts: "Disable Confirmation Prompts",
	confPromptExplanation: "Eliminates yes/no prompts when deleting or overwriting data.",
	ChangeTheme: "Change Theme",
	SortSettings: "Sort Settings",
	ImportAppInfo: "Import App Info",
	ChooseATheme: "Choose a Theme",

	Default: "Default",
	Light: "Light",
	Dark: "Dark",
	SolarizedLight: "Solarized Light",
	SolarizedDark: "Solarized Dark",

	ExportData: "Export App Data",
	exportAllMsg: [
		"Save this info to a note or file.  ",
		"You can use it later to restore your data."
	],
	ExportedData: "Exported Data",

	WhatToExport: "What to Export",
	nothingImportedMsg: "You haven't imported anything yet.",
	YesClose: "Yes, Close This",
	successImport: "Imported new info for {{listing}}",
	alsoOverwrote: "; also completely overwrote storage for {{listing}}",
	successOverwrote: "Completely overwrote storage for {{listing}}",
	exportAppInfo: "Export App Info",

	ImportInfo: "Import Info",
	importDescription:
		"Paste your data below. This only accepts data exported through"
		+ " \"Export App Info\".",
	DataToImport: "Data to Import",
	Reset: "Reset",
	Analyze: "Analyze",
	WhatToImport: "What to Import",
	currentSettings: "Current {{tool}} Settings",
	storedSettings: "Stored {{tool}} Settings",
	storedDocuments: "Stored {{tool}} Documents",
	appSettings: "{{tool}} Settings",
	OtherAppSettings: "Other App Settings",

	nothingChosenForImportMsg: "You did not choose anything to import.",
	WARNING: "WARNING!",
	willOverwriteCurrent: "This will overwrite all current data in {{listing}}.",
	alsoOverwriteStorage: "It will ALSO delete and replace stored data for {{listing}}.",
	willOverwriteStorage: "This will delete and replace stored data for {{listing}}.",
	areYouVerySure: "Are you SURE you want to do this?",
	YesIAmSure: "Yes, I Want to Do This",

	none: "(none)",
	ManageSortMethods: "Manage Sort Methods",
	BasicSort: "Basic Sort",
	UseLangBasedSort: "Use Language-Based Sort",
	langSortExplanation:
		"Use a language's rules for sorting instead of using Unicode points."
		+ " (If this option is disabled, your device does not support"
		+ " language-based sorting.)",
	SortLanguage: "Sort Language:",

	BaseOnly:
		"[ȁ = Ȁ, a = ȁ]: Base letters only",
	Diacritics:
		"[ȁ = Ȁ, a ≠ ȁ]: Diacritics",
	UpperLowercase:
		"[ȁ ≠ Ȁ, a = ȁ]: Upper/lowercase",
	DiacriticsUpperLowercase:
		"[ȁ ≠ Ȁ, a ≠ ȁ]: Diacritics and upper/lowercase",

	overrideNoteMsg: "Note: This can be overriden by a language's sorting rules.",
	UsingCustomSort: "Using Custom Sort:",
	AllCustomSortMethods: "All Custom Sort Methods",
	customAlphabet: "custom alphabet",
	CustomAlphabet: "Custom Alphabet",

	relation_one: "{{count}} relation",
	relation_other: "{{count}} relations",

	equality_one: "{{count}} equality",
	equality_other: "{{count}} equalities",

	needTitleMsg: "You must provide a title before saving.",
	blankAlphabetProvided: "The alphabet provided was blank.",
	noEnteredInfoMsg: "You did not enter any information.",
	noBaseCharMsg: "You must provide a \"base\" character.",
	noEqualCharMsg: "You must provide some \"equal\" characters.",
	noPostPreCharMsg: "You must provide some \"pre\" or \"post\" characters.",

	NewCustomSort: "New Custom Sort",
	AddSort: "Add Custom Sort",
	SortAdded: "Custom Sort added",
	DeleteSort: "Delete This?",
	DeleteSortButton: "Delete Sort",
	SortDeleted: "Custom Sort deleted",
	EditSort: "Edit Custom Sort",
	SortEdited: "Custom Sort edited",
	TitleOfSort: "Title for this sort",
	UnicodeSort: "Unicode sort (language-independent)",
	SortSensitivity: "Sort Sensitivity:",
	DefaultSensitivity: "Default sensitivity",
	UseAlternateAlphabet: "Use alternate alphabet",
	alternateAlphabetExplanation:
		"Items will be sorted according to the order you provide."
		+ " Characters not in your alphabet will be sorted according to the"
		+ " rules above.",
	WriteAlphaHere: "Write your alphabet here.",
	AlphabetSeparator: "Alphabet separator:",

	NoSeparator:
		"[abcde]: No separator",
	Space:
		"[a b c d e]: Space",
	Comma:
		"[a,b,c,d,e]: Comma",
	Period:
		"[a.b.c.d.e]: Period",
	Semicolon:
		"[a;b;c;d;e]: Semicolon",

	Relations: "Relations",
	relationMsg: "Similar characters that should be sorted separately.",
	AddRelation: "Add Relation",
	RelationAdded: "Relation added",
	DeleteRelation: "Delete Relation?",
	RelationEdited: "Relation edited",
	EditRelation: "Edit Relation",
	Equalities: "Equalities",
	equalityMsg: "Characters that should be sorted together as if they were strictly equal.",
	AddEquality: "Add Equality",
	EqualityAdded: "Equality added",
	DeleteEquality: "Delete Equality?",
	EqualityEdited: "Equality edited",
	EditEquality: "Edit Equality",

	BaseChar: "Base Character:",
	BaseEqual: "Equal to the Base:",
	CharsSeparator: "Characters Separator:",
	PrePostSeparator: "Pre/Post Separator:",
	SortedAfterBase: "Sorted After the Base:",
	SortedBeforeBase: "Sorted Before the Base:",
	EqualsSeparator: "Equalities Separator:",

	Basecharacter: "Base character",
	TheBaseCharacter: "The base character",
	CharsEqual: "Characters equal to the base",
	CharsToBeEqual: "Characters to be equal to the Base.",
	CharsPreBase: "Characters sorted before the base",
	charsPreBaseMsg: "End with the one just before the Base.",
	CharsPostBase: "Characters sorted after the base",
	charsPostBaseMsg: "Start with the one just after the Base.",

};

export default settings;
