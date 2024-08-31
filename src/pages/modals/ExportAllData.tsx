import React, { useState, useEffect, useMemo, useCallback, FC } from 'react';
import {
	IonIcon,
	IonLabel,
	IonList,
	IonItem,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal,
	IonFooter,
	IonTextarea,
	useIonToast,
	IonItemDivider,
	IonToggle
} from '@ionic/react';
import { closeCircleOutline, checkmarkDoneCircleOutline } from "ionicons/icons";
import { useSelector } from 'react-redux';
import Markdown from 'react-markdown';

import {
	Base_WG,
	DJCustomInfo,
	DJGroup,
	ImportExportObject,
	LexiconState,
	ModalProperties,
	MSState,
	SortSettings,
	StateObject,
	storedDJ,
	storedLex,
	storedMS,
	storedWE,
	storedWG,
	WEPresetObject
} from '../../store/types';
import { currentVersion } from '../../store/blankAppState';
import useTranslator from '../../store/translationHooks';

import {
	CustomStorageWE,
	CustomStorageWG,
	DeclenjugatorStorage,
	LexiconStorage,
	MorphoSyntaxStorage
} from '../../components/PersistentInfo';
import { $i } from '../../components/DollarSignExports';
import copyText from '../../components/copyText';
import useI18Memo from '../../components/useI18Memo';

const commons = [ "Close", "CopyToClipboard", "Done", "Loading" ];

const translations = [
	"ExportedData", "OtherAppSettings", "WhatToExport", "ExportData"
];

const MExportAllData: FC<ModalProperties> = (props) => {
	const [ t ] = useTranslator('common');
	const [ ts ] = useTranslator('settings');
	const [ tClose, tCopy, tDone, tLoading ] = useI18Memo(commons);
	const [ tExportedData, tOtherSettings, tWhatToExport, tExportThing ] = useI18Memo(translations, "settings");
	const tExportMsg = useMemo(() => ts("exportAllMsg", { joinArrays: "\n" }), [ts]);
	const tCurrentMorphoSyntaxSettings = useMemo(() => ts("currentSettings", { tool: t("MorphoSyntax") }), [ts, t]);
	const tStoredMorphoSyntaxDocuments = useMemo(() => ts("storedDocuments", { tool: t("MorphoSyntax") }), [ts, t]);
	const tCurrentWordGenSettings = useMemo(() => ts("currentSettings", { tool: t("WordGen") }), [ts, t]);
	const tStoredWordGenSettings = useMemo(() => ts("storedSettings", { tool: t("WordGen") }), [ts, t]);
	const tCurrentWordEvolveSettings = useMemo(() => ts("currentSettings", { tool: t("WordEvolve") }), [ts, t]);
	const tStoredWordEvolveSettings = useMemo(() => ts("storedSettings", { tool: t("WordEvolve") }), [ts, t]);
	const tCurrentDeclenjugatorSettings = useMemo(() => ts("currentSettings", { tool: t("Declenjugator") }), [ts, t]);
	const tStoredDeclenjugatorSettings = useMemo(() => ts("storedSettings", { tool: t("Declenjugator") }), [ts, t]);
	const tCurrentLexiconSettings = useMemo(() => ts("currentSettings", { tool: t("Lexicon") }), [ts, t]);
	const tStoredLexiconDocuments = useMemo(() => ts("storedDocuments", { tool: t("Lexicon") }), [ts, t]);
	const tConceptsSettings = useMemo(() => ts("appSettings", { tool: t("Concepts") }), [ts, t]);
	const tExtraCharactersSettings = useMemo(() => ts("appSettings", { tool: t("ExtraChars") }), [ts, t]);

	const { isOpen, setIsOpen } = props;
	const toast = useIonToast();
	const [outputString, setOutputString] = useState<string>(tLoading);
	const [output, setOutput] = useState<ImportExportObject | null>(null);
	const [export_wg, setExport_wg] = useState<boolean>(true);
	const [export_we, setExport_we] = useState<boolean>(true);
	const [export_ms, setExport_ms] = useState<boolean>(true);
	const [export_dj, setExport_dj] = useState<boolean>(true);
	const [export_lex, setExport_lex] = useState<boolean>(true);
	const [export_con, setExport_con] = useState<boolean>(true);
	const [export_ec, setExport_ec] = useState<boolean>(true);
	const [export_set, setExport_set] = useState<boolean>(true); // This covers settings AND sort settings
	const [export_wgStored, setExport_wgStored] = useState<boolean>(true);
	const [export_weStored, setExport_weStored] = useState<boolean>(true);
	const [export_msStored, setExport_msStored] = useState<boolean>(true);
	const [export_djStored, setExport_djStored] = useState<boolean>(true);
	const [export_lexStored, setExport_lexStored] = useState<boolean>(true);
	const {
		wg,
		we,
		ms,
		dj,
		lexicon,
		concepts,
		ec,
		appSettings,
		sortSettings
	} = useSelector((state: StateObject) => state);

	const exportedSortSettings = useMemo(() => {
		const { customSorts, ...etc } = sortSettings;
		const exportedSettings: SortSettings = {
			...etc,
			customSorts: customSorts.map(obj => {
				return {
					...obj,
					customAlphabet: obj.customAlphabet && [...obj.customAlphabet],
					multiples: obj.multiples && [...obj.multiples],
					customizations: obj.customizations && obj.customizations.map(custom => {
						if("equals" in custom) {
							return {
								...custom,
								equals: [...custom.equals]
							};
						}
						return {
							...custom,
							pre: [...custom.pre],
							post: [...custom.post]
						};
					})
				};
			})
		};
		return exportedSettings;
	}, [sortSettings]);

	const doClose = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

	useEffect(() => {
		const lexS: storedLex = [];
		const msS: storedMS = [];
		const wgS: storedWG = [];
		const weS: storedWE = [];
		const djS: storedDJ = [];
		setOutputString(tLoading);
		const where = $i<HTMLInputElement>("exportedData");
		where && (where.value = tLoading);

		const copyDJGroup = (input: DJGroup) => {
			const {startsWith, endsWith, regex, declenjugations} = input;
			const output: DJGroup = {
				...input,
				startsWith: [...startsWith],
				endsWith: [...endsWith],
				regex: regex ? [regex[0], regex[1]] : undefined,
				declenjugations: declenjugations.map(obj => {
					return obj.regex ?
						{
							...obj,
							regex: [obj.regex[0], obj.regex[1]]
						}
					:
						{...obj}
				})
			};
			return output;
		};

		LexiconStorage.iterate((value: LexiconState, key: string) => {
			lexS.push([key, value]);
			return; // Blank return keeps the loop going
		}).then(() => {
			return MorphoSyntaxStorage.iterate((value: MSState, key: string) => {
				msS.push([key, value]);
				return; // Blank return keeps the loop going
			});
		}).then(() => {
			return CustomStorageWE.iterate((value: WEPresetObject, title: string) => {
				weS.push([title, value]);
				return; // Blank return keeps the loop going
			});
		}).then(() => {
			return CustomStorageWG.iterate((value: Base_WG, title: string) => {
				wgS.push([title, value]);
				return; // Blank return keeps the loop going
			});
		}).then(() => {
			return DeclenjugatorStorage.iterate((value: DJCustomInfo, title: string) => {
				djS.push([title, value]);
				return; // Blank return keeps the loop going
			});
		}).then(() => {
			setOutput({
				currentVersion,
				wg: {
					...wg,
					characterGroups: wg.characterGroups.map((obj) => ({...obj})),
					transforms: wg.transforms.map((obj) => ({...obj}))
				},
				we: {
					...we,
					characterGroups: we.characterGroups.map((obj) => ({...obj})),
					transforms: we.transforms.map((obj) => ({...obj})),
					soundChanges: we.soundChanges.map((obj) => ({...obj})),
				},
				ms: {...ms},
				dj: { // versions >= 0.11.0
					input: dj.input,
					declensions: dj.declensions.map((obj) => ({...copyDJGroup(obj)})),
					conjugations: dj.conjugations.map((obj) => ({...copyDJGroup(obj)})),
					other: dj.other.map((obj) => ({...copyDJGroup(obj)}))
				},
				appSettings: {...appSettings},
				lexicon: {
					...lexicon,
					sortPattern: [...lexicon.sortPattern],
					columns: lexicon.columns.map((obj) => ({...obj})),
					lexicon: lexicon.lexicon.map((obj) => ({
						id: obj.id,
						columns: [...obj.columns]
					}))
				},
//				wordLists: { // versions <= 0.9.4
//					centerTheDisplayedWords: wordListsState.textcenter ? [ "center" ] : [],
//					listsDisplayed: convertedListsDisplayed
//				},
				concepts: { // versions >= 0.9.5
					...concepts,
					display: {...concepts.display},
					combinations: concepts.combinations.map((obj) => ({
						id: obj.id,
						parts: obj.parts.map((obj) => ({...obj}))
					}))
				},
				sortSettings: exportedSortSettings, // versions >= 0.10.0
				ec: {
					...ec,
					faves: [...ec.faves]
				},
//				storages: { // versions <= 0.10.1
//					lex: lexS,
//					mx: msS, // Note the misspelling
//					wg: wgS,
//					we: weS
//				}
				lexStored: lexS, // versions >= 0.11.0
				msStored: msS,   // versions >= 0.11.0
				wgStored: wgS,   // versions >= 0.11.0
				weStored: weS,   // versions >= 0.11.0
				djStored: djS    // versions >= 0.11.0
			});
		});
	}, [
		wg,
		we,
		ms,
		dj,
		lexicon,
		concepts,
		ec,
		appSettings,
		exportedSortSettings,
		tLoading
	]);

	useEffect(() => {
		if(!output) {
			return;
		}
		const exportable: ImportExportObject = {...output};
		if(!export_wg) {
			delete exportable.wg;
		}
		if(!export_we) {
			delete exportable.we;
		}
		if(!export_ms) {
			delete exportable.ms;
		}
		if(!export_dj) {
			delete exportable.dj;
		}
		if(!export_lex) {
			delete exportable.lexicon;
		}
		if(!export_con) {
			delete exportable.concepts;
		}
		if(!export_ec) {
			delete exportable.ec;
		}
		if(!export_set) {
			delete exportable.appSettings;
			delete exportable.sortSettings;
		}
		if(!export_wgStored) {
			delete exportable.wgStored;
		}
		if(!export_weStored) {
			delete exportable.weStored;
		}
		if(!export_msStored) {
			delete exportable.msStored;
		}
		if(!export_djStored) {
			delete exportable.djStored;
		}
		if(!export_lexStored) {
			delete exportable.lexStored;
		}
		const final = JSON.stringify(exportable);
		setOutputString(final);
		const where = $i<HTMLInputElement>("exportedData");
		where && (where.value = final);
	}, [
		output,
		export_wg,
		export_we,
		export_ms,
		export_dj,
		export_lex,
		export_con,
		export_ec,
		export_set,
		export_wgStored,
		export_weStored,
		export_msStored,
		export_djStored,
		export_lexStored
	]);

	const onLoad = useCallback(() => {
		setExport_wg(true);
		setExport_we(true);
		setExport_ms(true);
		setExport_dj(true);
		setExport_lex(true);
		setExport_con(true);
		setExport_ec(true);
		setExport_set(true);
		setExport_wgStored(true);
		setExport_weStored(true);
		setExport_msStored(true);
		setExport_djStored(true);
		setExport_lexStored(true);
	}, []);

	const doCopyText = useCallback(() => copyText(outputString, toast), [outputString, toast]);
	const toggleSetExport_ms = useCallback(() => setExport_ms(!export_ms), [export_ms]);
	const toggleSetExport_msStored = useCallback(() => setExport_msStored(!export_msStored), [export_msStored]);
	const toggleSetExport_wg = useCallback(() => setExport_wg(!export_wg), [export_wg]);
	const toggleSetExport_wgStored = useCallback(() => setExport_wgStored(!export_wgStored), [export_wgStored]);
	const toggleSetExport_we = useCallback(() => setExport_we(!export_we), [export_we]);
	const toggleSetExport_weStored = useCallback(() => setExport_weStored(!export_weStored), [export_weStored]);
	const toggleSetExport_dj = useCallback(() => setExport_dj(!export_dj), [export_dj]);
	const toggleSetExport_djStored = useCallback(() => setExport_djStored(!export_djStored), [export_djStored]);
	const toggleSetExport_lex = useCallback(() => setExport_lex(!export_lex), [export_lex]);
	const toggleSetExport_lexStored = useCallback(() => setExport_lexStored(!export_lexStored), [export_lexStored]);
	const toggleSetExport_con = useCallback(() => setExport_con(!export_con), [export_con]);
	const toggleSetExport_ec = useCallback(() => setExport_ec(!export_ec), [export_ec]);
	const toggleSetExport_set = useCallback(() => setExport_set(!export_set), [export_set]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={doClose} onIonModalDidPresent={onLoad}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tExportThing}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={doClose} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="full">
					<IonItem>
						<IonLabel className="ion-text-center ion-text-wrap">
							<h2 className="ion-text-center ion-text-wrap blankContents">
								<Markdown>{tExportMsg}</Markdown>
							</h2>
						</IonLabel>
					</IonItem>
					<IonItem lines="none">
						<IonTextarea
							aria-label={tExportedData}
							wrap="soft"
							rows={12}
							id="exportedData"
							value={outputString}
						></IonTextarea>
					</IonItem>
					<IonItem lines="none">
						<IonButton
							color="primary"
							onClick={doCopyText}
							slot="end"
						>{tCopy}</IonButton>
					</IonItem>
					<IonItemDivider>{tWhatToExport}</IonItemDivider>
					<IonItem lines="none">
						<IonToggle
							enableOnOffLabels
							checked={export_ms}
							onIonChange={toggleSetExport_ms}
						>{tCurrentMorphoSyntaxSettings}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={export_msStored}
							onIonChange={toggleSetExport_msStored}
						>{tStoredMorphoSyntaxDocuments}</IonToggle>
					</IonItem>
					<IonItem lines="none">
						<IonToggle
							enableOnOffLabels
							checked={export_wg}
							onIonChange={toggleSetExport_wg}
						>{tCurrentWordGenSettings}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={export_wgStored}
							onIonChange={toggleSetExport_wgStored}
						>{tStoredWordGenSettings}</IonToggle>
					</IonItem>
					<IonItem lines="none">
						<IonToggle
							enableOnOffLabels
							checked={export_we}
							onIonChange={toggleSetExport_we}
						>{tCurrentWordEvolveSettings}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={export_weStored}
							onIonChange={toggleSetExport_weStored}
						>{tStoredWordEvolveSettings}</IonToggle>
					</IonItem>
					<IonItem lines="none">
						<IonToggle
							enableOnOffLabels
							checked={export_dj}
							onIonChange={toggleSetExport_dj}
						>{tCurrentDeclenjugatorSettings}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={export_djStored}
							onIonChange={toggleSetExport_djStored}
						>{tStoredDeclenjugatorSettings}</IonToggle>
					</IonItem>
					<IonItem lines="none">
						<IonToggle
							enableOnOffLabels
							checked={export_lex}
							onIonChange={toggleSetExport_lex}
						>{tCurrentLexiconSettings}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={export_lexStored}
							onIonChange={toggleSetExport_lexStored}
						>{tStoredLexiconDocuments}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={export_con}
							onIonChange={toggleSetExport_con}
						>{tConceptsSettings}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							checked={export_ec}
							onIonChange={toggleSetExport_ec}
						>{tExtraCharactersSettings}</IonToggle>
					</IonItem>
					<IonItem>
						<IonToggle
							enableOnOffLabels
							aria-label={tOtherSettings}
							checked={export_set}
							onIonChange={toggleSetExport_set}
						>{tOtherSettings}</IonToggle>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton color="success" slot="end" onClick={doClose}>
						<IonIcon icon={checkmarkDoneCircleOutline} slot="start" />
						<IonLabel>{tDone}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default MExportAllData;
