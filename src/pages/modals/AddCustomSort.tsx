import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
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
	IonModal,
	IonInput,
	IonFooter,
	useIonAlert,
	useIonToast,
	IonSelect,
	IonSelectOption,
	IonToggle,
	IonItemSliding,
	IonItemOptions,
	IonItemOption,
	IonReorderGroup,
	IonReorder,
	SelectCustomEvent
} from '@ionic/react';
import {
	closeCircleOutline,
	saveOutline,
	globeOutline,
	addOutline,
	trash,
	reorderThree
} from 'ionicons/icons';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { LanguageCode } from 'iso-639-1';

import {
	EqualityObject,
	ExtraCharactersModalOpener,
	ModalProperties,
	RelationObject,
	SetState,
	SortLanguage,
	SortObject,
	SortSensitivity,
	SortSeparator
} from '../../store/types';
import { addNewCustomSort } from '../../store/sortingSlice';
import useTranslator from '../../store/translationHooks';

import { $i } from '../../components/DollarSignExports';
import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';

interface CustomSortModal extends ExtraCharactersModalOpener {
	langObj: {[key: string]: string}
	languages: LanguageCode[]

	addRelationModalInfo: ModalProperties
	savedRelation: RelationObject | null
	setSavedRelation: SetState<RelationObject | null>

	editRelationModalInfo: ModalProperties
	setIncomingRelation: SetState<RelationObject | null>
	outgoingRelation: RelationObject | null | string
	setOutgoingRelation: SetState<RelationObject | null | string>

	addEqualityModalInfo: ModalProperties
	savedEquality: EqualityObject | null
	setSavedEquality: SetState<EqualityObject | null>

	editEqualityModalInfo: ModalProperties
	setIncomingEquality: SetState<EqualityObject | null>
	outgoingEquality: EqualityObject | null | string
	setOutgoingEquality: SetState<EqualityObject | null | string>
}

const translations = [
	"none", "BaseOnly", "blankAlphabetProvided",
	"equalityMsg",
	"Comma", "CustomAlphabet", "DefaultSensitivity",
	"DiacriticsUpperLowercase", "Diacritics", "Equalities",
	"NoSeparator", "Period", "Relations", "Semicolon",
	"relationMsg", "Space",
	"TitleOfSort", "UnicodeSort",
	"UpperLowercase", "UseAlternateAlphabet", "WriteAlphaHere",
	"noEnteredInfoMsg",
	"needTitleMsg", "alternateAlphabetExplanation",
	"SortLanguage", "SortSensitivity", "AlphabetSeparator",
	"AddSort", "DeleteSort", "SortAdded"
];

const commons = [
	"AddNew", "deleteThisCannotUndo",
	"MaybeDiscardThing", "Cancel", "Close",
	"defaultSort", "Delete", "Edit", "ExtraChars", "Ok", "Save",
	"Title", "UnsavedInfo", "YesDiscard", "areYouSure"
];

const AddCustomSort: FC<CustomSortModal> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tNone, tBaseOnly, tBlankProv, tCharsEqual, tComma, tCustomAlpha,
		tDefSens, tDiaPlus, tDia, tEqualities, tNoSep, tPeriod, tRelations,
		tSemi, tSimilarSep, tSpace, tTitleSort, tUniSort, tUppLow, tUseAlph,
		tWriteAlpha, tNoNewInfo, tNoTitle, tAltAlphExpl, tpSortLang,
		tpSortSens, tpAlphaSep, tAddThing, tDelThing, tThingSaved
	] = useI18Memo(translations, 'settings');
	const [
		tAddNew, tYouSure, tSureDiscard, tCancel, tClose, tDefSort, tDelete,
		tEdit, tExChar, tOk, tSave, tTitle, tUnsaved, tYesDisc, tRUSure
	] = useI18Memo(commons);
	const tpTitle = useMemo(() => tc("Title", { context: "presentation" }), [tc]);

	const {
		isOpen,
		setIsOpen,
		openECM,

		langObj,
		languages,

		addRelationModalInfo,
		savedRelation,
		setSavedRelation,

		editRelationModalInfo,
		setIncomingRelation,
		outgoingRelation,
		setOutgoingRelation,

		addEqualityModalInfo,
		savedEquality,
		setSavedEquality,

		editEqualityModalInfo,
		setIncomingEquality,
		outgoingEquality,
		setOutgoingEquality,
	} = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [sortLang, setSortLang] = useState<SortLanguage | "unicode" | "default">("default");
	const [sortSensitivity, setSortSensitivity] = useState<SortSensitivity | "default">("default");
	const [usingAlpha, setUsingAlpha] = useState<boolean>(false);
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [customizations, setCustomizations] = useState<(RelationObject | EqualityObject)[]>([]);
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setCustomizations([]);
		setSortLang("default");
		setSortSensitivity("default");
		setUsingAlpha(false);
		const addSortTitle = $i<HTMLInputElement>("addSortTitle");
		addSortTitle && (addSortTitle.value = "");
		const addCustomAlphabet = $i<HTMLInputElement>("addCustomAlphabet");
		addCustomAlphabet && (addCustomAlphabet.value = "");
	}, [setIsOpen]);
	// Accept new relation from other modal
	useEffect(() => {
		if(isOpen && savedRelation) {
			if(customizations.length === 0) {
				setCustomizations([savedRelation]);
			} else {
				if(customizations.slice().pop()!.id === savedRelation.id) {
					// We already saved this.
					return;
				}
				setCustomizations([...customizations, savedRelation]);
			}
			setSavedRelation(null);
		}
	}, [isOpen, savedRelation, setSavedRelation, customizations]);
	// Accept edited relation from other modal
	useEffect(() => {
		if(isOpen && outgoingRelation) {
			if(typeof outgoingRelation === "string") {
				// a string means the relation was deleted
				setCustomizations(
					customizations.filter(obj => obj.id !== outgoingRelation)
				);
			} else {
				setCustomizations(
					customizations.map(
						obj => (obj.id === outgoingRelation.id ? outgoingRelation : obj)
					)
				);
			}
			setOutgoingRelation(null);
		}
	}, [isOpen, outgoingRelation, setOutgoingRelation, customizations]);
	// Accept new equality from other modal
	useEffect(() => {
		if(isOpen && savedEquality) {
			if(customizations.length === 0) {
				setCustomizations([savedEquality]);
			} else {
				if(customizations.slice().pop()!.id === savedEquality.id) {
					// We already saved this.
					return;
				}
				setCustomizations([...customizations, savedEquality]);
			}
			setSavedEquality(null);
		}
	}, [isOpen, savedEquality, setSavedEquality, customizations]);
	// Accept edited equality from other modal
	useEffect(() => {
		if(isOpen && outgoingEquality) {
			if(typeof outgoingEquality === "string") {
				// a string means the relation was deleted
				setCustomizations(
					customizations.filter(
						obj => obj.id !== outgoingEquality
					)
				);
			} else {
				setCustomizations(
					customizations.map(
						obj => (obj.id === outgoingEquality.id ? outgoingEquality : obj)
					)
				);
			}
			setOutgoingEquality(null);
		}
	}, [isOpen, outgoingEquality, setOutgoingEquality, customizations]);
	const maybeSaveNewSort = useCallback(() => {
		const addSortTitle = $i<HTMLInputElement>("addSortTitle");
		const title = addSortTitle ? addSortTitle.value.trim() : "";
		if(!title) {
			doAlert({
				message: tNoTitle,
				cssClass: "danger",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "submit"
					}
				]
			})
			return;
		}
		let test: boolean = false;
		const customSort: SortObject = {
			id: uuidv4(),
			title
		};
		if(usingAlpha) {
			const addCustomAlphabet = $i<HTMLInputElement>("addCustomAlphabet");
			const alpha: string[] = (addCustomAlphabet ? addCustomAlphabet.value : "")
				.split(separator)
				.filter((char: string) => char);
			if(alpha.length === 0) {
				doAlert({
					message: tBlankProv,
					cssClass: "danger",
					buttons: [
						{
							text: tOk,
							role: "cancel",
							cssClass: "submit"
						}
					]
				})
				return;
			}
			customSort.customAlphabet = alpha;
			customSort.separator = separator;
			test = true;
		}
		if(sortLang !== "default") {
			customSort.sortLanguage = sortLang;
			test = true;
		}
		if(sortSensitivity !== "default") {
			customSort.sensitivity = sortSensitivity;
			test = true;
		}
		if(customizations.length > 0) {
			customSort.customizations = customizations;
			test = true;
		}
		if(!test) {
			doAlert({
				message: tNoNewInfo,
				cssClass: "danger",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "submit"
					}
				]
			})
			return;
		}
		dispatch(addNewCustomSort(customSort));
		closeModal();
		toaster({
			message: tThingSaved,
			position: "middle",
			color: "success",
			duration: 2000,
			toast
		});
	}, [
		closeModal, customizations, dispatch, doAlert, separator, sortLang,
		sortSensitivity, tBlankProv, tNoNewInfo, tNoTitle, tOk, tThingSaved,
		toast, usingAlpha
	]);
	const maybeCancel = useCallback(() => {
		const addCustomAlphabet = $i<HTMLInputElement>("addCustomAlphabet");
		if(
			sortLang !== "default" || sortSensitivity !== "default"
			|| (usingAlpha && addCustomAlphabet && addCustomAlphabet.value.trim())
			|| (customizations.length > 0)
		) {
			return yesNoAlert({
				header: tUnsaved,
				message: tSureDiscard,
				cssClass: "warning",
				submit: tYesDisc,
				handler: closeModal,
				doAlert
			});
		}
		closeModal();
	}, [
		closeModal, customizations.length, doAlert, sortLang, sortSensitivity,
		tSureDiscard, tUnsaved, tYesDisc, usingAlpha
	]);
	const maybeAddNewRelation = useCallback(() => {
		setSavedRelation(null);
		addRelationModalInfo.setIsOpen(true);
	}, [addRelationModalInfo, setSavedRelation]);
	const maybeAddNewEquality = useCallback(() => {
		setSavedEquality(null);
		addEqualityModalInfo.setIsOpen(true);
	}, [addEqualityModalInfo, setSavedEquality]);
	const doReorder = useCallback((event: CustomEvent) => {
		const ed = event.detail;
		// move things around
		const { from, to } = ed;
		const moved = customizations[from];
		const remains = customizations.slice(0, from).concat(customizations.slice(from + 1));
		const final = remains.slice(0, to).concat(moved, remains.slice(to));
		// save result
		setCustomizations(final);
		ed.complete();
	}, [customizations]);
	const openEx = useCallback(() => openECM(true), [openECM]);
	const saveSortLang = useCallback((e: SelectCustomEvent) => setSortLang(e.detail.value), []);
	const saveSortSens = useCallback((e: SelectCustomEvent) => setSortSensitivity(e.detail.value), []);
	const saveSeparator = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);
	const toggleUsingAlpha = useCallback(() => setUsingAlpha(!usingAlpha), [usingAlpha]);
	const allCustomizations = useMemo(() => customizations.map(obj => {
		const {
			id,
			base,
			separator
		} = obj;
		if("equals" in obj) {
			const {
				equals
			} = obj;
			return (
				<IonItemSliding
					className="customSortItem"
					key={`relation:${id}`}
				>
					<IonItemOptions side="end" className="serifChars">
						<IonItemOption
							color="primary"
							aria-label={tEdit}
							onClick={() => {
								const el = $i<HTMLIonListElement>("addingCustomSortList");
								el && el.closeSlidingItems();
								setIncomingEquality(obj);
								editEqualityModalInfo.setIsOpen(true);
							}}
						>
							<IonIcon
								slot="icon-only"
								src="svg/edit.svg"
							/>
						</IonItemOption>
						<IonItemOption
							color="danger"
							aria-label={tDelete}
							onClick={() => {
								const el = $i<HTMLIonListElement>("addingCustomSortList");
								el && el.closeSlidingItems();
								yesNoAlert({
									header: tDelThing,
									message: tYouSure,
									submit: tc("confirmDel", { count: 1 }),
									cssClass: "danger",
									handler: () => setCustomizations(customizations.filter(obj => obj.id !== id)),
									doAlert
								});
							}}
						>
							<IonIcon
								slot="icon-only"
								icon={trash}
							/>
						</IonItemOption>
					</IonItemOptions>
					<IonItem
						className="equality customization"
					>
						<IonReorder
							className="ion-padding-end"
						><IonIcon icon={reorderThree} /></IonReorder>
						<div
							className="base"
						>{base}</div>
						<div
							className="equals"
						>=</div>
						<div
							className="equalities"
						>{
							equals.map(
								(ch, i) => (
									<div
										key={`equality:${ch}:${i}`}
									>{i ? separator : ""}{ch}</div>
								)
							)
						}</div>
						<div
							className="icon"
						><IonIcon
							size="small"
							src="svg/slide-indicator.svg"
						/></div>
					</IonItem>
				</IonItemSliding>
			);
		} else {
			const {
				pre,
				post
			} = obj;
			return (
				<IonItemSliding
					className="customSortItem"
					key={`relation:${id}`}
				>
					<IonItemOptions
						side="end"
						className="serifChars"
					>
						<IonItemOption
							color="primary"
							aria-label={tEdit}
							onClick={() => {
								const el = $i<HTMLIonListElement>("addingCustomSortList");
								el && el.closeSlidingItems();
								setIncomingRelation(obj);
								editRelationModalInfo.setIsOpen(true);
							}}
						>
							<IonIcon
								slot="icon-only"
								src="svg/edit.svg"
							/>
						</IonItemOption>
						<IonItemOption
							color="danger"
							aria-label={tDelete}
							onClick={() => {
								const el = $i<HTMLIonListElement>("addingCustomSortList");
								el && el.closeSlidingItems();
								yesNoAlert({
									header: tDelThing,
									message: tRUSure,
									submit: tc("confirmDel", { count: 1 }),
									cssClass: "danger",
									handler: () => setCustomizations(customizations.filter(obj => obj.id !== id)),
									doAlert
								});
							}}
						>
							<IonIcon slot="icon-only" icon={trash} />
						</IonItemOption>
					</IonItemOptions>
					<IonItem className="relation customization">
					<IonReorder
						className="ion-padding-end"
					><IonIcon icon={reorderThree} /></IonReorder>
						{pre.length ?
							<>
								<div className="pre">
									{
										pre.map(
											(ch, i) => (
												<div
													key={`pre:${ch}:${i}`}
												>{i ? separator : ""}{ch}</div>
											)
										)
									}
								</div>
								<div className="lessthan">&lt;</div>
							</>
						:
							<></>
						}
						<div className="base">{base}</div>
						{post.length ?
							<>
								<div className="lessthan">&lt;</div>
								<div className="post">
									{
										post.map(
											(ch, i) => (
												<div
													key={`post:${ch}:${i}`}
												>{i ? separator : ""}{ch}</div>
											)
										)
									}
								</div>
							</>
						:
							<></>
						}
						<div
							className="icon"
						><IonIcon
							size="small"
							src="svg/slide-indicator.svg"
						/></div>
					</IonItem>
				</IonItemSliding>
			);
		}
	}), [
		customizations, tDelete, doAlert, tc, tDelThing, tRUSure,
		tEdit, editEqualityModalInfo, editRelationModalInfo, tYouSure,
		setIncomingEquality, setIncomingRelation
	]);
	const allLanguages = useMemo(() => languages.map((language) => (
		<IonSelectOption
			key={`knownLang:${language}`}
			className="ion-text-wrap ion-text-align-end"
			value={language}
		>{langObj[language] || language}</IonSelectOption>
	)), [languages, langObj]);
	return (
		<IonModal isOpen={isOpen} backdropDismiss={false}>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tAddThing}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={openEx} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={maybeCancel} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<IonList lines="full" id="addingCustomSortList">
					<IonItem>
						<div slot="start" className="ion-margin-end">{tpTitle}</div>
						<IonInput
							aria-label={tTitle}
							id="addSortTitle"
							helperText={tTitleSort}
						/>
					</IonItem>
					<IonItem className="wrappableInnards">
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tpSortLang}
							value={sortLang}
							onIonChange={saveSortLang}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="default"
							>{tDefSort}</IonSelectOption>
							{allLanguages}
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="unicode"
							>{tUniSort}</IonSelectOption>
						</IonSelect>
					</IonItem>
					<IonItem className="wrappableInnards">
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tpSortSens}
							value={sortSensitivity}
							onIonChange={saveSortSens}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="default"
							>{tDefSens}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="base"
							>{tBaseOnly}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="accent"
							>{tDia}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="case"
							>{tUppLow}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="variant"
							>{tDiaPlus}</IonSelectOption>
						</IonSelect>
					</IonItem>
					<IonItem
						className="wrappableInnards"
						lines={usingAlpha ? "none" : undefined}
					>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={usingAlpha}
							onIonChange={toggleUsingAlpha}
						>
							<h2>{tUseAlph}</h2>
							<p>{tAltAlphExpl}</p>
						</IonToggle>
					</IonItem>
					{ usingAlpha ?
						<>
							<IonItem lines="none">
								<IonInput
									aria-label={tCustomAlpha}
									id="addCustomAlphabet"
									helperText={tWriteAlpha}
								/>
							</IonItem>
							<IonItem className="wrappableInnards">
								<IonSelect
									color="primary"
									className="ion-text-wrap settings"
									label={tpAlphaSep}
									value={separator}
									onIonChange={saveSeparator}
								>
									<IonSelectOption
										className="ion-text-wrap ion-text-align-end"
										value=""
									>{tNoSep}</IonSelectOption>
									<IonSelectOption
										className="ion-text-wrap ion-text-align-end"
										value=" "
									>{tSpace}</IonSelectOption>
									<IonSelectOption
										className="ion-text-wrap ion-text-align-end"
										value=","
									>{tComma}</IonSelectOption>
									<IonSelectOption
										className="ion-text-wrap ion-text-align-end"
										value="."
									>{tPeriod}</IonSelectOption>
									<IonSelectOption
										className="ion-text-wrap ion-text-align-end"
										value=";"
									>{tSemi}</IonSelectOption>
								</IonSelect>
							</IonItem>
						</>
					:
						<></>
					}
					<IonItem className="wrappableInnards" lines="none">
						<IonLabel>
							<h2>{tRelations}</h2>
							<p>{tSimilarSep}</p>
						</IonLabel>
						<IonButton
							color="secondary"
							slot="end"
							onClick={maybeAddNewRelation}
						>
							<IonIcon icon={addOutline} slot="end" />
							<IonLabel>{tAddNew}</IonLabel>
						</IonButton>
					</IonItem>
					<IonItem className="wrappableInnards" lines="none">
						<IonLabel>
							<h2>{tEqualities}</h2>
							<p>{tCharsEqual}</p>
						</IonLabel>
						<IonButton
							color="secondary"
							slot="end"
							onClick={maybeAddNewEquality}
						>
							<IonIcon icon={addOutline} slot="end" />
							<IonLabel>{tAddNew}</IonLabel>
						</IonButton>
					</IonItem>
					<IonReorderGroup
						disabled={false}
						onIonItemReorder={doReorder}
					>
						{customizations.length > 0 ?
							allCustomizations
						:
							<IonItem>
								<IonLabel
									className="ion-text-align-end"
								><em>{tNone}</em></IonLabel>
							</IonItem>
						}
					</IonReorderGroup>
				</IonList>
			</IonContent>
			<IonFooter className="modalBorderTop">
				<IonToolbar>
					<IonButton
						color="warning"
						slot="start"
						onClick={maybeCancel}
					>
						<IonIcon icon={saveOutline} slot="end" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={maybeSaveNewSort}
					>
						<IonIcon icon={saveOutline} slot="end" />
						<IonLabel>{tSave}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default AddCustomSort;
