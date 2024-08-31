import React, { FC, MouseEventHandler, useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonTitle,
	IonButton,
	IonIcon,
	useIonAlert,
	useIonToast,
	IonModal,
	IonList,
	IonItem,
	IonLabel,
	IonFooter,
	IonCheckbox,
	IonToggle,
	IonInput,
	IonSelect,
	IonSelectOption,
	IonItemDivider,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	SelectCustomEvent
} from '@ionic/react';
import {
	enterOutline,
	globeOutline,
	closeCircleOutline,
	add,
	save,
	close,
	trash
} from 'ionicons/icons';

import { ExtraCharactersModalOpener, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import { $i } from '../../components/DollarSignExports';
import useI18Memo from '../../components/useI18Memo';

interface ImporterProps extends ExtraCharactersModalOpener {
	currentInput: string
	importFunc: (a: string) => void
}

interface ColumnTest {
	col: number
	test: string
}

// Testing words to see if they are eligible for importing
const testColumns = (lex: string[], tests: ColumnTest[], matchAll: boolean) => {
	const method = matchAll ? "every" : "some";
	return tests[method](testObject => {
		const { col, test } = testObject;
		const word = lex[col] || "";
		return word.indexOf(test) >= 0;
	});
};
const testColumnMatches = (lex: string[], tests: ColumnTest[], matchAll: boolean) => {
	const method = matchAll ? "every" : "some";
	return tests[method](testObject => {
		const { col, test } = testObject;
		const regex = new RegExp(test);
		const word = lex[col] || "";
		return word.match(regex);
	});
};
const testWords = (word: string, tests: string[], matchAll: boolean) => {
	const method = matchAll ? "every" : "some";
	return tests[method](testString => {
		return word.indexOf(testString) >= 0;
	});
};
const testMatches = (word: string, tests: string[], matchAll: boolean) => {
	const method = matchAll ? "every" : "some";
	return tests[method](testString => {
		const regex = new RegExp(testString);
		return word.match(regex);
	});
};


const commons = [
	"Close", "ExtraChars", "Save", "Help",
	"AddConditions", "Cancel", "ColXMustHaveY",
	"ColXMustMatchY", "NothingToImport",
	"ExitWOImport", "ImportFromWhichColumns",
	"ifMatchAllOff", "Import",
	"MatchAllConditions", "NothingToSave",
	"SelectOneCol",
	"TypeWordHere", "TypeRegExHere",
	"WordMustContainX", "WordMustMatchX",
	"WordsThatMatch", "WordsWithColumn", "TestColumn",
	"WordsThatContain", "ImportFromLexicon",
	"ConditionSaved"
];

const LexiconImporterModal: FC<ImporterProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tClose, tExChar, tSave, tHelp,
		tAddCond, tCancel, tColXY,
		tColXmY, tNoImport,
		tExWithout, tImpFrom,
		tIfOff, tImport,
		tMatchAll, tNothingToSave,
		tSelOne,
		tTypeWord, tTypeRegex,
		tX, tMX,
		tWordsMatch, tWordsCol, tTestCol,
		tWordsCont, tImpFromLexicon, tSaved
	] = useI18Memo(commons);

	const {
		isOpen,
		setIsOpen,
		openECM,
		currentInput,
		importFunc
	} = props;
	const { columns, lexicon } = useSelector((state: StateObject) => state.lexicon);
	const maxCols = columns.length - 1;
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [importing, setImporting] = useState<boolean[]>([]);
	const [addingWordTest, setAddingWordTest] = useState<boolean>(false);
	const [addingWordMatch, setAddingWordMatch] = useState<boolean>(false);
	const [addingColumn, setAddingColumn] = useState<number>(0);
	const [addingColumnTest, setAddingColumnTest] = useState<boolean>(false);
	const [addingColumnMatch, setAddingColumnMatch] = useState<boolean>(false);
	const [wordTests, setWordTests] = useState<string[]>([]);
	const [columnTests, setColumnTests] = useState<ColumnTest[]>([]);
	const [wordMatches, setWordMatches] = useState<string[]>([]);
	const [columnMatches, setColumnMatches] = useState<ColumnTest[]>([]);
	const [matchAll, setMatchAll] = useState<boolean>(false);

	const doClose = useCallback(() => {
		setIsOpen(false);
		setWordTests([]);
		setColumnTests([]);
		setWordMatches([]);
		setColumnMatches([]);
		setAddingWordTest(false);
		setAddingWordMatch(false);
		setAddingColumnTest(false);
		setAddingColumnMatch(false);
		setMatchAll(false);
	}, [setIsOpen]);

	const maybeDoClose = useCallback(() => {
		// Check for unsaved info?
		if(
			importing.some(imp => imp)
			|| (
				wordTests.length
				+ columnTests.length
				+ wordMatches.length
				+ columnMatches.length
			) > 0
		) {
			return yesNoAlert({
				message: tExWithout,
				submit: tClose,
				cssClass: "warning",
				handler: doClose,
				doAlert
			});
		}
		doClose();
	}, [columnMatches.length, columnTests.length, doAlert, doClose, importing, tExWithout, tClose, wordMatches.length, wordTests.length]);

	const onLoad = useCallback(() => {
		const bools: boolean[] = [];
		columns.forEach(col => bools.push(false));
		setImporting(bools);
	}, [columns]);

	// Printing out matching tests
	const displayTest = useCallback((text: string, deleter: MouseEventHandler<HTMLIonItemOptionElement>) => {
		return (
			<IonItemSliding className="importFromLexiconSlider" key={`displayingTest:${text}`}>
				<IonItemOptions>
					<IonItemOption color="danger" onClick={deleter} aria-label={tHelp}>
						<IonIcon slot="icon-only" icon={trash} />
					</IonItemOption>
				</IonItemOptions>
				<IonItem>
					<IonLabel className="wrappableInnards ion-text-end">{text}</IonLabel>
					<IonIcon size="small" slot="end" src="svg/slide-indicator.svg" />
				</IonItem>
			</IonItemSliding>
		);
	}, [tHelp]);

	// Import words from Lexicon
	const importLexicon = useCallback(() => {
		const cols: number[] = [];
		importing.forEach((imp, i) => {
			if(imp) {
				cols.push(i);
			}
		});
		if(cols.length === 0) {
			return toaster({
				message: tSelOne,
				color: "danger",
				duration: 2500,
				position: "middle",
				toast
			});
		}
		// We have column(s) to import from.
		const possibles: string[] = [];
		// Go through the lexicon and test each item.
		lexicon.forEach(lex => {
			let flag: boolean | null = null;
			if(columnTests.length > 0) {
				flag = testColumns(lex.columns, columnTests, matchAll);
				if(matchAll && !flag) {
					// Matching has failed (column tests)
					return;
				}
			}
			if(columnMatches.length > 0) {
				flag = testColumnMatches(lex.columns, columnMatches, matchAll);
				if(matchAll && !flag) {
					// Matching has failed (column matches)
					return;
				}
			}
			// At this point, we only need to look at the word itself
			const words = cols.map(col => lex.columns[col]).filter(word => {
				if(!word) {
					// Ignore blanks
					return false;
				} else if(!matchAll && flag) {
					// This word has already qualified
					return true;
				}
				// At this point, flag is either false or null, or it's true with matchAll true
				let innerFlag: boolean | null = flag;
				if(wordTests.length > 0) {
					innerFlag = testWords(word, wordTests, matchAll);
					if(matchAll && !innerFlag) {
						// Matching has failed (word tests)
						return false;
					}
				}
				if(wordMatches.length > 0) {
					// Last set of matches determines it all
					return testMatches(word, wordMatches, matchAll);
				}
				// At this point, innerFlag is either false or null, or it's true with matchAll true
				// If null, there were no tests to match, so it goes through
				return (innerFlag === null) ? true : innerFlag;
			});
			possibles.push(...words);
		});
		if(possibles.length === 0) {
			return toaster({
				message: tNoImport,
				color: "danger",
				duration: 4500,
				position: "middle",
				toast
			});
		}
		const final = possibles.join("\n");
		// Save information
		const base = currentInput ? currentInput + "\n" : "";
		importFunc(base + final);
		toaster({
			message: tc("importSuccess", { count: possibles.length }),
			color: "success",
			duration: 3500,
			position: "middle",
			toast
		});
		doClose();
	}, [columnMatches, columnTests, currentInput, doClose, importFunc, importing, lexicon, matchAll, tc, tNoImport, tSelOne, toast, wordMatches, wordTests]);
	const toggleImport = useCallback((col: number) => {
		const newImporting = [...importing];
		newImporting[col] = !importing[col];
		setImporting(newImporting);
	}, [importing]);

	// Add various tests
	const addWordTest = useCallback(() => {
		const el = $i<HTMLInputElement>("word");
		if(!el || !el.value) {
			return toaster({
				message: tNothingToSave,
				color: "danger",
				duration: 1500,
				position: "bottom",
				toast
			});
		}
		const input = el.value;
		setWordTests([...wordTests.filter(x => x !== input), input]);
		setAddingWordTest(false);
		el.value = "";
		return toaster({
			message: tSaved,
			color: "success",
			duration: 2000,
			position: "bottom",
			toast
		});
	}, [tNothingToSave, tSaved, toast, wordTests]);
	const addWordMatch = useCallback(() => {
		const el = $i<HTMLInputElement>("wordMatch");
		if(!el || !el.value) {
			return toaster({
				message: tNothingToSave,
				color: "danger",
				duration: 1500,
				position: "bottom",
				toast
			});
		}
		const input = el.value;
		setWordMatches([...wordMatches.filter(x => x !== input), input]);
		setAddingWordMatch(false);
		el.value = "";
		return toaster({
			message: tSaved,
			color: "success",
			duration: 2000,
			position: "bottom",
			toast
		});
	}, [tNothingToSave, tSaved, toast, wordMatches]);
	const addColumnTest = useCallback(() => {
		const el = $i<HTMLInputElement>("colTest");
		if(!el || !el.value) {
			return toaster({
				message: tNothingToSave,
				color: "danger",
				duration: 1500,
				position: "bottom",
				toast
			});
		}
		const input = el.value;
		setColumnTests([
			...columnTests.filter(x => x.col !== addingColumn && x.test !== input),
			{
				col: addingColumn,
				test: input
			}
		]);
		setAddingColumnTest(false);
		setAddingColumn(0);
		el.value = "";
		return toaster({
			message: tSaved,
			color: "success",
			duration: 2000,
			position: "bottom",
			toast
		});
	}, [addingColumn, columnTests, tNothingToSave, tSaved, toast]);
	const addColumnMatch = useCallback(() => {
		const el = $i<HTMLInputElement>("colMatch");
		if(!el || !el.value) {
			return toaster({
				message: tNothingToSave,
				color: "danger",
				duration: 1500,
				position: "bottom",
				toast
			});
		}
		const input = el.value;
		setColumnMatches([
			...columnMatches.filter(x => x.col !== addingColumn && x.test !== input),
			{
				col: addingColumn,
				test: input
			}
		]);
		setAddingColumnMatch(false);
		setAddingColumn(0);
		el.value = "";
		return toaster({
			message: tSaved,
			color: "success",
			duration: 2000,
			position: "bottom",
			toast
		});
	}, [addingColumn, columnMatches, tNothingToSave, tSaved, toast]);

	// Remove various tests
	const deleteWordTest = useCallback((test: string) => {
		setWordTests(wordTests.filter(x => x !== test));
	}, [wordTests]);
	const deleteWordMatch = useCallback((test: string) => {
		setWordMatches(wordMatches.filter(x => x !== test));
	}, [wordMatches]);
	const deleteColumnTest = useCallback((col: number, test: string) => {
		setColumnTests(columnTests.filter(x => x.col !== col && x.test !== test));
	}, [columnTests]);
	const deleteColumnMatch = useCallback((col: number, test: string) => {
		setColumnMatches(columnMatches.filter(x => x.col !== col && x.test !== test));
	}, [columnMatches]);

	const openEx = useCallback(() => openECM(true), [openECM]);

	const lexColumns = useMemo(() => columns.map((col, i) => {
		return (
			<IonItem
				key={`lexColImporter:${col.id}`}
				lines={i === maxCols ? "full" : "none"}
				className="columnListing"
				onClick={() => toggleImport(i)}
			>
				<IonCheckbox checked={importing[i]}>{col.label}</IonCheckbox>
			</IonItem>
		);
	}), [columns, importing, maxCols, toggleImport]);
	const columnOptions = useMemo(() => columns.map((col, i) => {
		return (
			<IonSelectOption
				key={`lexColImportAdder2:${col.id}`}
				className="ion-text-wrap ion-text-align-end"
				value={i}
			>{col.label}</IonSelectOption>
		);
	}), [columns]);

	const wordTestOutput = useMemo(() => (
		wordTests.length > 0 ?
			<>
				<IonItemDivider>{tWordsCont}</IonItemDivider>
				{wordTests.map((test, i) => {
					return displayTest(
						test,
						() => deleteWordTest(test)
					)
				})}
			</>
		: <></>
	), [deleteWordTest, displayTest, tWordsCont, wordTests]);
	const wordMatchesOutput = useMemo(() => (
		wordMatches.length > 0 ?
			<>
				<IonItemDivider>{tWordsMatch}</IonItemDivider>
				{wordMatches.map((test, i) => {
					return displayTest(
						`/${test}/`,
						() => deleteWordMatch(test)
					)
				})}
			</>
		: <></>
	), [deleteWordMatch, displayTest, tWordsMatch, wordMatches]);
	const columnTestOutput = useMemo(() => (
		columnTests.length > 0 ?
			<>
				<IonItemDivider>{tWordsCol}</IonItemDivider>
				{columnTests.map((obj, i) => {
					const {col, test} = obj;
					return displayTest(
						tc("columnContains", { column: columns[col].label, test }),
						() => deleteColumnTest(col, test)
					)
				})}
			</>
		: <></>
	), [columnTests, columns, deleteColumnTest, displayTest, tc, tWordsCol]);
	const columnMatchesOutput = useMemo(() => (
		columnMatches.length > 0 ?
			<>
				<IonItemDivider>{tWordsMatch}</IonItemDivider>
				{columnMatches.map((obj, i) => {
					const {col, test} = obj;
					return displayTest(
						tc("columnMatches", { column: columns[col].label, test }),
						() => deleteColumnMatch(col, test)
					)
				})}
			</>
		: <></>
	), [columnMatches, columns, deleteColumnMatch, displayTest, tWordsMatch, tc]);

	const addableColumns = useMemo(() => columns.map((col, i) => {
		return (
			<IonSelectOption
				key={`lexColImportAdder1:${col.id}`}
				className="ion-text-wrap ion-text-align-end"
				value={i}
			>{col.label}</IonSelectOption>
		);
	}), [columns]);
	const doSetAddingColumn = useCallback((e: SelectCustomEvent) => setAddingColumn(e.detail.value), []);
	const toggleAddingWordTest = useCallback(() => setAddingWordTest(!addingWordTest), [addingWordTest]);
	const toggleAddingWordMatch = useCallback(() => setAddingWordMatch(!addingWordMatch), [addingWordMatch]);
	const toggleAddingColumnTest = useCallback(() => setAddingColumnTest(!addingColumnTest), [addingColumnTest]);
	const toggleAddingColumnMatch = useCallback(() => setAddingColumnMatch(!addingColumnMatch), [addingColumnMatch]);
	const toggleMatchAll = useCallback(() => setMatchAll(!matchAll), [matchAll]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={doClose} onIonModalDidPresent={onLoad}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tImpFromLexicon}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={openEx} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={maybeDoClose} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList id="lexiconImporter" lines="full" className="lexiconImporter hasToggles">
					<IonItem>
						<IonLabel>{tImpFrom}</IonLabel>
					</IonItem>
					{lexColumns}
					<IonItemDivider>{tAddCond}</IonItemDivider>
					<IonItem className={"wrappableInnards doubleable" + (addingWordTest ? " toggled" : "")}>
						<IonLabel className="ion-text-wrap">{tX}</IonLabel>
						<IonButton
							color={addingWordTest ? "warning" : "primary"}
							slot="end"
							disabled={addingWordMatch || addingColumnTest || addingColumnMatch}
							onClick={toggleAddingWordTest}
						><IonIcon icon={addingWordTest ? close : add} slot="icon-only" /></IonButton>
					</IonItem>
					<IonItem className={"toggleable wrappableInnards biggerToggle" + (addingWordTest ? "" : " toggled")}>
						<IonInput id="word" helperText={tTypeWord} />
						<IonButton
							color="success"
							slot="end"
							onClick={addWordTest}
							aria-label={tSave}
						><IonIcon icon={save} slot="icon-only" /></IonButton>
					</IonItem>

					<IonItem className={"wrappableInnards doubleable" + (addingWordMatch ? " toggled" : "")}>
						<IonLabel className="ion-text-wrap">{tMX}</IonLabel>
						<IonButton
							color={addingWordMatch ? "warning" : "primary"}
							slot="end"
							disabled={addingWordTest || addingColumnTest || addingColumnMatch}
							onClick={toggleAddingWordMatch}
						><IonIcon icon={addingWordMatch ? close : add} slot="icon-only" /></IonButton>
					</IonItem>
					<IonItem className={"toggleable wrappableInnards" + (addingWordMatch ? "" : " toggled")}>
						<IonInput id="wordMatch" helperText={tTypeRegex} />
						<IonButton
							color="success"
							slot="end"
							onClick={addWordMatch}
							aria-label={tSave}
						><IonIcon icon={save} slot="icon-only" /></IonButton>
					</IonItem>

					<IonItem className={"wrappableInnards doubleable" + (addingColumnTest ? " toggled" : "")}>
						<IonLabel className="ion-text-wrap">{tColXY}</IonLabel>
						<IonButton
							color={addingColumnTest ? "warning" : "primary"}
							slot="end"
							disabled={addingWordTest || addingWordMatch || addingColumnMatch}
							onClick={toggleAddingColumnTest}
						><IonIcon icon={addingColumnTest ? close : add} slot="icon-only" /></IonButton>
					</IonItem>
					<IonItem
						className={"toggleable wrappableInnards" + (addingColumnTest ? "" : " toggled")}
						lines="none"
					>
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							justify="start"
							label={tTestCol}
							value={addingColumn}
							onIonChange={doSetAddingColumn}
						>
							{addableColumns}
						</IonSelect>
					</IonItem>
					<IonItem className={"toggleable wrappableInnards" + (addingColumnTest ? "" : " toggled")}>
						<IonInput id="colTest" helperText={tTypeWord} />
						<IonButton
							color="success"
							slot="end"
							onClick={addColumnTest}
							aria-label={tSave}
						><IonIcon icon={save} slot="icon-only" /></IonButton>
					</IonItem>

					<IonItem className={"wrappableInnards doubleable" + (addingColumnMatch ? " toggled" : "")}>
						<IonLabel className="ion-text-wrap">{tColXmY}</IonLabel>
						<IonButton
							color={addingColumnMatch ? "warning" : "primary"}
							slot="end"
							disabled={addingWordTest || addingWordMatch || addingColumnTest}
							onClick={toggleAddingColumnMatch}
						><IonIcon icon={addingColumnMatch ? close : add} slot="icon-only" /></IonButton>
					</IonItem>
					<IonItem
						className={"toggleable wrappableInnards" + (addingColumnMatch ? "" : " toggled")}
						lines="none"
					>
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							justify="start"
							label={tTestCol}
							value={addingColumn}
							onIonChange={doSetAddingColumn}
						>
							{columnOptions}
						</IonSelect>
					</IonItem>
					<IonItem className={"toggleable wrappableInnards" + (addingColumnMatch ? "" : " toggled")}>
						<IonInput id="colMatch" helperText={tTypeRegex} />
						<IonButton
							color="success"
							slot="end"
							onClick={addColumnMatch}
							aria-label={tSave}
						><IonIcon icon={save} slot="icon-only" /></IonButton>
					</IonItem>

					{wordTestOutput}
					{wordMatchesOutput}
					{columnTestOutput}
					{columnMatchesOutput}

					<IonItem
						className={
							"wrappableInnards toggleable biggerToggle"
							+ ((
								wordTests.length
								+ columnTests.length
								+ wordMatches.length
								+ columnMatches.length
							> 1) ? "" : " toggled")
						}
					>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={matchAll}
							onIonChange={toggleMatchAll}
						>
							<h2>{tMatchAll}</h2>
							<p>{tIfOff}</p>
						</IonToggle>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="warning" slot="start" onClick={maybeDoClose}>
						<IonIcon icon={closeCircleOutline} slot="start" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
					<IonButton color="success" slot="end" onClick={importLexicon}>
						<IonIcon icon={enterOutline} slot="start" />
						<IonLabel>{tImport}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default LexiconImporterModal;
