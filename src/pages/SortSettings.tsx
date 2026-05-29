import React, { useCallback, useMemo, useState, FC, useContext } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonFooter,
	IonItemDivider,
	IonSelect,
	IonSelectOption,
	IonPage,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	useIonAlert,
	IonToggle,
	SelectCustomEvent
} from '@ionic/react';
import {
	closeCircleOutline,
	checkmarkCircleSharp,
	addCircleSharp,
	trash
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";
import ISO6391, { LanguageCode } from "iso-639-1";

import { EqualityObject, RelationObject, SortObject, StateObject } from '../store/types';
import { deleteCustomSort, setDefaultCustomSort, setSortLanguageCustom, setSortSensitivity } from '../store/sortingSlice';
import useTranslator from '../store/translationHooks';

import ExtraCharactersModal from './modals/ExtraCharacters';
import AddCustomSort from './modals/AddCustomSort';
import AddCustomSortRelation from './modals/AddCustomSortRelation';
import AddCustomSortEquality from './modals/AddCustomSortEquality';
import EditCustomSortRelation from './modals/EditCustomSortRelation';
import EditCustomSortEquality from './modals/EditCustomSortEquality';
import EditCustomSort from './modals/EditCustomSort';
import useElement from '../components/useElement';
import yesNoAlert from '../components/yesNoAlert';
import PermanentInfo from '../components/PermanentInfo';
import useI18Memo from '../components/useI18Memo';
import { ExCharContext, ModalMakingContext } from '../components/contexts';

const codes = ISO6391.getAllCodes();
const names = ISO6391.getAllNativeNames();
const languages = Intl.Collator.supportedLocalesOf(codes) as LanguageCode[];
const langObj: {[key: string]: string} = {
	unicode: "language-independent"
};
codes.forEach((code, i) => {
	langObj[code] = names[i];
});
const permanents = PermanentInfo.sort.permanentCustomSorts;

const translations = [
	"BaseOnly", "BasicSort", "DiacriticsUpperLowercase",
	"Diacritics", "ManageSortMethods", "NewCustomSort",
	"overrideNoteMsg",
	"UpperLowercase", "UseLangBasedSort", "customAlphabet",
	"langSortExplanation", "none", "AllCustomSortMethods",
	"SortLanguage", "UsingCustomSort", "SortSensitivity"
];

const commons = [
	"Close", "Delete", "Edit", "Ok", "Done", "deleteThisCannotUndo"
];

const SortSettings: FC = () => {
	const [ t ] = useTranslator('settings');
	const [ tc ] = useTranslator('common');
	const [ tClose, tDelete, tEdit, tOk, tDone, tYouSure ] = useI18Memo(commons);
	const [
		tBaseOnly, tBasicSort, tDiaCase, tDia, tManage, tNewSort, tNote, 
		tUppLow, tUseLang, tCustom, tLangSort, tNone, tAll, tpSortLang,
		tpUsing, tpSens
	] = useI18Memo(translations, 'settings');

	const modalPropsMaker = useContext(ModalMakingContext);
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	// main modals
	const [isOpenECM, setIsOpenECM] = useState<boolean>(false);
	const openEx = useCallback(() => setIsOpenECM(true), [setIsOpenECM]);
	const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
	const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
	const [editingCustomSort, setEditingCustomSort] = useState<SortObject | null>(null);
	// submodal: add relation
	const [addRelationOpen, setAddRelationOpen] = useState<boolean>(false);
	const [savedRelation, setSavedRelation] = useState<RelationObject | null>(null);
	// submodal: add equality
	const [addEqualityOpen, setAddEqualityOpen] = useState<boolean>(false);
	const [savedEquality, setSavedEquality] = useState<EqualityObject | null>(null);
	// submodal: edit relation
	const [editRelationOpen, setEditRelationOpen] = useState<boolean>(false);
	const [incomingRelation, setIncomingRelation] = useState<RelationObject | null>(null);
	const [outgoingRelation, setOutgoingRelation] = useState<RelationObject | null | string>(null);
	// submodal: edit equality
	const [editEqualityOpen, setEditEqualityOpen] = useState<boolean>(false);
	const [incomingEquality, setIncomingEquality] = useState<EqualityObject | null>(null);
	const [outgoingEquality, setOutgoingEquality] = useState<EqualityObject | null | string>(null);

	const {
		sortLanguage,
		sensitivity,
		defaultCustomSort,
		customSorts
	} = useSelector((state: StateObject) => state.sortSettings);
	const defaultSortLanguage = useSelector((state: StateObject) => state.internals.defaultSortLanguage);
	const [useLanguageSort, setUseLanguageSort] = useState<boolean>(sortLanguage !== "unicode");
	const addRelationModalInfo = modalPropsMaker(addRelationOpen, setAddRelationOpen);
	const addEqualityModalInfo = modalPropsMaker(addEqualityOpen, setAddEqualityOpen);
	const editRelationModalInfo = modalPropsMaker(editRelationOpen, setEditRelationOpen);
	const editEqualityModalInfo = modalPropsMaker(editEqualityOpen, setEditEqualityOpen);
	const [listOfCustomSorts, listOfCustomSortsRef] = useElement<HTMLIonListElement>();
	const openEditor = useCallback((sorter: SortObject) => {
		if(listOfCustomSorts) { listOfCustomSorts.closeSlidingItems(); }
		setEditingCustomSort(sorter);
		setEditModalOpen(true);
	}, [listOfCustomSorts]);

	const setLang = useCallback((e: SelectCustomEvent) => dispatch(setSortLanguageCustom(e.detail.value)), [dispatch]);
	const setSens = useCallback((e: SelectCustomEvent) => dispatch(setSortSensitivity(e.detail.value)), [dispatch]);
	const setDefault = useCallback((e: SelectCustomEvent) => setDefaultCustomSort(e.detail.value), []);

	const customSortOptions = useMemo(() => customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).map(sorter => (
		<IonSelectOption
			className="ion-text-wrap ion-text-align-end"
			key={`customSortChooser:${sorter.id}:${sorter.title}`}
			value={sorter.id}
		>
			{sorter.title}
		</IonSelectOption>
	)), [customSorts]);

	const allCustomSortMethods = useMemo(() => customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).map(sorter => {
		const {
			id,
			title,
			sortLanguage,
			sensitivity,
			customAlphabet,
			customizations
		} = sorter;
		const desc: string[] = [];
		if(sortLanguage) { desc.push(langObj[sortLanguage]); }
		if(sensitivity) { desc.push(sensitivity); }
		if(customAlphabet) { desc.push(tCustom); }
		if(customizations && customizations.length) {
			let r: number = 0;
			let e: number = 0;
			customizations.forEach(custom => {
				if("equals" in custom) {
					e++;
				} else {
					r++;
				}
			});
			if(r > 0) { desc.push(t("relation", { count: r })); }
			if(e > 0) { desc.push(t("equality", { count: e })); }
		}
		const maybeDeleteSort = (id: string, title: string) => {
			if(listOfCustomSorts) { listOfCustomSorts.closeSlidingItems(); }
			const message = permanents[id];
			if(message) {
				return doAlert({
					header: "",
					message,
					cssClass: "danger",
					buttons: [
						{
							text: tOk,
							role: "cancel",
							cssClass: "submit"
						}
					]
				});
			}
			yesNoAlert({
				header: tc("deleteTitleQ", { title }),
				message: tYouSure,
				submit: tc("confirmDel", { count: 1 }),
				cssClass: "danger",
				handler: () => dispatch(deleteCustomSort(id)),
				doAlert
			});
		};
		return (
			<IonItemSliding key={`sortSettings:display:${id}`} className="customSorts">
				<IonItemOptions side="end" className="serifChars">
					<IonItemOption
						color="primary"
						aria-label={tEdit}
						onClick={() => openEditor(sorter)}
					>
						<IonIcon slot="icon-only" src="svg/edit.svg" />
					</IonItemOption>
					<IonItemOption
						color="danger"
						aria-label={tDelete}
						onClick={() => maybeDeleteSort(id, title)}
					>
						<IonIcon slot="icon-only" icon={trash} />
					</IonItemOption>
				</IonItemOptions>
				<IonItem>
					<IonLabel className="customSortDescription">
						<h2>{title}</h2>
						<p>{desc.join("; ")}</p>
					</IonLabel>
					<IonIcon size="small" slot="end" src="svg/slide-indicator.svg" />
				</IonItem>
			</IonItemSliding>
		);
	}), [customSorts, t, tc, doAlert, dispatch, tCustom, tDelete, tEdit, tOk, tYouSure, listOfCustomSorts, openEditor]);

	const toggleUsingLang = useCallback(() => {
		const newValue = !useLanguageSort;
		setUseLanguageSort(newValue);
		dispatch(setSortLanguageCustom(newValue ? defaultSortLanguage : "unicode"));
	}, [useLanguageSort, defaultSortLanguage, dispatch]);

	const openAdd = useCallback(() => setAddModalOpen(true), []);

	const languageOptions = useMemo(() => languages.map((language) => (
		<IonSelectOption
			key={`knownLang:${language}`}
			className="ion-text-wrap ion-text-align-end"
			value={language}
		>{langObj[language] || language}</IonSelectOption>
	)), []);

	return (
		<IonPage>
			<ExCharContext value={openEx}>
				<AddCustomSort
					{...modalPropsMaker(addModalOpen, setAddModalOpen)}

					langObj={langObj}
					languages={languages}

					addRelationModalInfo={addRelationModalInfo}
					savedRelation={savedRelation}
					setSavedRelation={setSavedRelation}

					editRelationModalInfo={editRelationModalInfo}
					setIncomingRelation={setIncomingRelation}
					outgoingRelation={outgoingRelation}
					setOutgoingRelation={setOutgoingRelation}

					addEqualityModalInfo={addEqualityModalInfo}
					savedEquality={savedEquality}
					setSavedEquality={setSavedEquality}

					editEqualityModalInfo={editEqualityModalInfo}
					setIncomingEquality={setIncomingEquality}
					outgoingEquality={outgoingEquality}
					setOutgoingEquality={setOutgoingEquality}
				/>
				<AddCustomSortRelation
					{...addRelationModalInfo}
					setSavedRelation={setSavedRelation}
				/>
				<EditCustomSortRelation
					{...editRelationModalInfo}
					incomingRelation={incomingRelation}
					setOutgoingRelation={setOutgoingRelation}
				/>
				<AddCustomSortEquality
					{...addEqualityModalInfo}
					setSavedEquality={setSavedEquality}
				/>
				<EditCustomSortEquality
					{...editEqualityModalInfo}
					incomingEquality={incomingEquality}
					setOutgoingEquality={setOutgoingEquality}
				/>
				<EditCustomSort
					{...modalPropsMaker(editModalOpen, setEditModalOpen)}
					editingCustomSort={editingCustomSort}

					langObj={langObj}
					languages={languages}

					addRelationModalInfo={addRelationModalInfo}
					savedRelation={savedRelation}
					setSavedRelation={setSavedRelation}

					editRelationModalInfo={editRelationModalInfo}
					setIncomingRelation={setIncomingRelation}
					outgoingRelation={outgoingRelation}
					setOutgoingRelation={setOutgoingRelation}

					addEqualityModalInfo={addEqualityModalInfo}
					savedEquality={savedEquality}
					setSavedEquality={setSavedEquality}

					editEqualityModalInfo={editEqualityModalInfo}
					setIncomingEquality={setIncomingEquality}
					outgoingEquality={outgoingEquality}
					setOutgoingEquality={setOutgoingEquality}
				/>
			</ExCharContext>
			<ExtraCharactersModal {...modalPropsMaker(isOpenECM, setIsOpenECM)} />
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tManage}</IonTitle>
					<IonButtons slot="end">
						<IonButton routerLink='/settings' routerDirection='back' aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="full" id="listOfCustomSorts" ref={listOfCustomSortsRef} className="buttonFilled sortSettings hasSpecialLabels">
					<IonItemDivider>{tBasicSort}</IonItemDivider>
					<IonItem className="wrappableInnards">
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={useLanguageSort}
							onIonChange={toggleUsingLang}
							disabled={defaultCustomSort === "unicode"}
						>
							<h2>{tUseLang}</h2>
							<p>{tLangSort}</p>
						</IonToggle>
					</IonItem>
					<IonItem className="wrappableInnards">
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tpSortLang}
							value={sortLanguage || defaultSortLanguage || "unicode"}
							onIonChange={setLang}
							disabled={!useLanguageSort}
						>
							{languageOptions}
						</IonSelect>
					</IonItem>
					<IonItem className="wrappableInnards sublabelled">
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							value={sensitivity || "variant"}
							onIonChange={setSens}
							label={tpSens}
							labelPlacement="start"
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="base"
							>
								{tBaseOnly}
							</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="accent"
							>
								{tDia}
							</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="case"
							>
								{tUppLow}
							</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="variant"
							>
								{tDiaCase}
							</IonSelectOption>
						</IonSelect>
					</IonItem>
					<IonItem className="sublabel wrappableInnards">
						<p className="ion-text-end">{tNote}</p>
					</IonItem>
					<IonItem className="wrappableInnards">
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tpUsing}
							value={defaultCustomSort || null}
							onIonChange={setDefault}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value={null}
							>
								{tNone}
							</IonSelectOption>
							{customSortOptions}
						</IonSelect>
					</IonItem>
					<IonItemDivider>{tAll}</IonItemDivider>
					{allCustomSortMethods}
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="primary"
						slot="start"
						onClick={openAdd}
					>
						<IonIcon icon={addCircleSharp} slot="end" />
						<IonLabel>{tNewSort}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						routerLink='/settings'
						routerDirection='back'
					>
						<IonIcon icon={checkmarkCircleSharp} slot="end" />
						<IonLabel>{tDone}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonPage>
	);
};

export default SortSettings;
