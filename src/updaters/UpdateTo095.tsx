import { LexiconStorage } from "../components/PersistentInfo";
import { LexiconObject } from "./oldReduxTypes";

// Updating to 0.9.5
function doUpdate (incomingState: any) {
	const storedState = {...incomingState};
	// DELETE SOME PROPS
	if(storedState.modalState) {
		delete storedState.modalState;
	}
	if(storedState.temporaryInfo) {
		delete storedState.temporaryInfo;
	}
	// RENAME SOME PROPS
	if(storedState.wordgenRewriteRules) {
		storedState.wordgenTransforms = storedState.wordgenRewriteRules;
		delete storedState.wordgenRewriteRules;
	}
	if(storedState.wordgenCategories) {
		storedState.wordgenCharGroups = storedState.wordgenCategories;
		delete storedState.wordgenCategories;
	}
	if(storedState.wordevolveCategories) {
		storedState.wordevolveCharGroups = storedState.wordevolveCategories;
		delete storedState.wordevolveCategories;
	}
	// UPDATE WORD LISTS
	storedState.wordListsState.combinations = [];
	storedState.wordListsState.showingCombos = false;
	storedState.conceptsState = storedState.wordListsState;
	delete storedState.wordListsState;
	// UPDATE LEXICON
	if(storedState.lexicon && storedState.lexicon.key !== undefined) {
		storedState.lexicon = updateLexiconObject(storedState.lexicon);
	}
	// Update Lexicon Storage
	LexiconStorage.iterate(lexiconStorageUpdater095);
	// Update settings
	storedState.appSettings.sortLanguage = "en";
	storedState.appSettings.sensitivity = "accent";
	return storedState;
};

interface Lexicon094 {
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
	lexicon: {
		key: string
		columns: string[]
	}[]
	waitingToAdd: any
	editing: number | undefined
	colEdit: any
	lexiconWrap: boolean
};

export function lexiconStorageUpdater095 (value: Lexicon094, key: string) {
	const newLex = updateLexiconObject(value);
	LexiconStorage.setItem(key, newLex)
}

function updateLexiconObject (input: Lexicon094) {
	const {
		key,
		lastSave,
		title,
		description,
		columnOrder,
		columnTitles,
		columnSizes,
		sort,
		lexicon,
		lexiconWrap
	} = input;
	const [col, dir] = sort;
	const output: LexiconObject = {
		id: key,
		lastSave,
		title,
		description,
		truncateColumns: !lexiconWrap,
		columns: columnOrder.map((col: number) => {
			return {
				id: "0" + String(col),
				label: columnTitles[col],
				size: columnSizes[col]
			};
		}),
		sortDir: !!dir,
		sortPattern: [col, ...columnOrder.filter((c: number, i: number) => (i !== col))],
		blankSort: "last",
		lexicon: lexicon.map((lex: any) => {
			const {key, columns} = lex;
			return {
				id: key,
				columns: columnOrder.map((col: number) => columns[col])
			};
		})
	};
	return output;
}

export default doUpdate
