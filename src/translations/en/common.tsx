import characters from "./characters";

const common = {

	appTitle: "Conlang Toolbox",
	appTitle_filename: "ConlangToolbox",
	appSubtitle: "tools for language invention",

	MorphoSyntax: "MorphoSyntax",

	WordGen: "WordGen",
	WordGen_filename: "WordGen",

	WordEvolve: "WordEvolve",
	WordEvolve_filename: "WordEvolve",

	Declenjugator: "Declenjugator",
	Declenjugator_filename: "Declenjugator",

	Lexicon: "Lexicon",
	Lexicon_filename: "Lexicon",

	Concepts: "Concepts",

	ExtraChars: "Extra Characters",

	AppInfo: "App Info",
	AppSettings: "App Settings",
	Main: "Main",

	Overview: "Overview", 
	Settings: "Settings",
	Input: "Input",
	Output: "Output",
	Info: "Info",

	Cancel: "Cancel",
	Clear: "Clear",
	Save: "Save",
	Ok: "Ok",
	Done: "Done",
	Close: "Close",
	Delete: "Delete",
	Edit: "Edit",
	Help: "Help",
	AddAndClose: "Add and Close",
	AddNew: "Add New",
	Copy: "Copy",
	Generate: "Generate",
	SaveAsNew: "Save as New",
	CopyToClipboard: "Copy to Clipboard",

	Display: "Display:",

	SavedAt: "Saved: {{time}}",

	CopiedToClipboard: "Copied to clipboard",
	NothingToCopy: "Nothing to copy",
	CharactersToBeCopied: "Characters to be copied",

	Untitled: "[Untitled]",
	fileFormat: "{{title}} - {{date}}.{{extension}}",
	UnableToExport: "UNABLE TO EXPORT: {{error}}",
	FileExported: "{{filename}} exported.",

	andGlue: ", ",
	andFinal: ", and ",
	joinTwo: "{{one}} and {{two}}",

	ExitAppQHead: "Exit App?",
	ExitAppQ: "Do you want to exit the app?",
	YesExit: "Yes, Exit!",

	saveToLexColumn_one: "{{count}} word saved to $t(Lexicon) under \"{{column}}\"",
	saveToLexColumn_other: "{{count}} words saved to $t(Lexicon) under \"{{column}}\"",
	SelectAColumn: "Select a column",
	GoToLexicon: "Go to $t(Lexicon)",
	TapWordsToSave: "Tap words you want to save to $t(Lexicon).",
	SaveToLexiconMessage: "Your selected words will be added to the $t(Lexicon) under that column.",

	ChooseFormat: "Choose a Format",
	ChooseFormat_presentation: "Choose a format:",

	fileDocx: "Word Document (docx)",
	fileText: "Text File",
	filePlain: "$t(fileText) (plain)",
	fileMd: "$t(fileText) (markdown)",
	fileCsv: "Spreadsheet (csv)",
	fileJson: "JSON File",
	fileXml: "XML File",

	deleteTitleQ: "Delete \"{{title}}\"?",
	loadTitleQ: "Load \"{{title}}\"?",
	exportTitle: "Export \"{{title}}\"",
	titleSaved: "\"{{title}}\" saved.",
	titleAlreadyExists: "\"{{title}}\" already exists.",
	titleLoaded: "\"{{title}}\" loaded.",
	titleNotFound: "\"{{title}}\" not found.",
	titleDeleted: "\"{{title}}\" deleted.",
	titleOverwritten: "\"{{title}}\" overwritten.",

	YesOverwriteIt: "Yes, Overwrite It",

	ClearOverwritePrevSave: "This will clear and overwrite the previous save",
	LoadError: "Load Error",
	ManageCustomInfo: "Manage Custom Info",
	SaveCurrentInfo: "Save Current Information",
	NameOfSave: "Name of save",
	NameYourInfo: "Name your custom info",
	Load: "Load",
	NoSavedInfo: "No saved info",
	LoadSavedInfo: "Load Saved Info",
	missingTitleMsg: "Missing title.",

	SortMethod: "Sort method:",

	cannotUndo: "This cannot be undone.",
	areYouSure: "Are you sure?",
	deleteThisCannotUndo: "Are you sure you want to delete this? $t(cannotUndo)",
	DeleteEverythingQ: "Delete Everything?",

	confirmDel_one: "Yes, Delete It",
	confirmDel_other: "Yes, Delete Them",


	confirmLoad: "Yes, Load Info",

	NothingToSave: "Nothing to save.",
	Deleted: "Deleted",
	UnsavedInfo: "Unsaved Info",


	MaybeDiscardThing: "Are you sure you want to discard this?",

	MaybeDiscardEdits: "Are you sure you want to discard your edits?",
	YesDiscard: "Yes, Discard",
	MaybeClearEntireInput: "$t(areYouSure) This will clear the entire input, and cannot be undone.",
	YesClear: "Yes, Clear It",

	defaultSort: "Default sort",

	error: "Error",
	emphasizedError: "<$t(error)>",

	regexpError: "Error trying to parse \"{{regex}}\"",

	Loading: "Loading",
	PleaseWait: "Please wait...",

	Title: "Title",
	Title_presentation: "Title:",
	Description: "Description",
	Description_presentation: "Description:",

	overviewOf: "Overview: {{what}}",

	ImportFromLexicon: "Import from Lexicon",
	LoadPreset: "Load Preset",

	Import: "Import",
	ImportFromWhichColumns: "Import from which column(s)?",
	optional: "(optional)",
	AddConditions: "Add Conditions $t(optional)",
	WordMustContainX: "Word must contain [x]",
	TypeWordHere: "Type part of word here.",
	WordMustMatchX: "Word must match expression [x]",
	TypeRegExHere: "Type regular expression here.",
	ColXMustHaveY: "Column [x] must contain [y]",
	ColXMustMatchY: "Column [x] must match expression [y]",
	ConditionSaved: "Condition saved.",

	TestColumn: "Test column:",
	WordsThatContain: "Words that contain:",
	WordsThatMatch: "Words that match:",
	WordsWithColumn: "Words where the column:",

	columnContains: "[{{column}}] contains \"{{test}}\"",
	columnMatches: "[{{column}}] matches /{{test}}/",
	MatchAllConditions: "Match all conditions",
	ifMatchAllOff: "If off, this will import words that match any condition.",
	ExitWOImport: "Exit Without Importing?",
	SelectOneCol: "Please select at least one column to import from.",
	NothingToImport: "Did not find anything to import.",
	importSuccess_one: "Imported {{count}} word from $t(Lexicon).",
	importSuccess_other: "Imported {{count}} words from $t(Lexicon).",
	yesImport: "Yes, Import",

	stoppedCopying: "No longer copying directly to clipboard.",
	startedCopying: "Now copying immediately to clipboard.",
	copiedCharToClipboard: "Copied {{char}} to clipboard",
	Favorites: "Favorites",
	startedFavoriting : "Start favoriting characters",
	stoppedFavoriting : "Stop favoriting characters",
	startedSaving: "Now saving characters to $t(Favorites)",
	stoppedSaving: "No longer saving to $t(Favorites)",
	TapToAdd: "Tap characters to add them here",
	ShowNames: "Show full character names",
	HideNames: "Hide full character names",

	extraHelp: { // Markdown format
		help1p1:[
			"This is a place to find and copy characters that may not be",
			"easily accessible to you on your device's keyboard. The other",
			"buttons can be toggled for additional effects:"
		],
		help1p2:[
			"When active, copies any character you tap directly to the",
			"clipboard. When inactive, copies tapped characters to the",
			"copy-bar below, where you can copy them at your leisure."
		],
		help1p3:[
			"When active, tapping on a character adds or removes it from your",
			"Favorites list. Characters will not be copied to the clipboard",
			"or the copy-bar."
		],
		help1p4:[
			"When active, shows the standard Unicode name of every character.",
			"When inactive, the characters are presented by themselves."
		],
		help2: [
			"Tap a character set below to see the characters in that set."
		],
		help3: [
			"Characters will display below. Tap them to copy them to the",
			"copy-bar above."
		],
	},
	characterInfo: characters,

	WGPresetsSorter: "WG Presets Sorter",

	cannotDeleteSorter: "This is used by $t(WordGen) presets. It cannot be modified or deleted.",

	regexpInfo: [
		"To put it as simply as possible, a regular expression is a",
		"sequence of characters that specifies a match pattern in text.",
		"$t(appTitle) uses JavaScript-style regexes without the",
		"surrounding slash characters.",
		"",
		"Fully explaining regular expressions is a topic that's too",
		"complicated for this app to cover, but they are very useful. Here",
		"are some resources where you can learn more about them:",
		"",
		"- [Wikipedia: Regular Expression](https://en.wikipedia.org/wiki/Regular_expression)",
		"- [MDN: Writing a regular expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions#writing_a_regular_expression_pattern)",
		"- [Regular-Expressions.info](https://www.regular-expressions.info) (a tutorial site)",
		"- [Geeks for Geeks: Write Reguar Expressions](https://www.geeksforgeeks.org/write-regular-expressions/)"
	],

};

export default common;
