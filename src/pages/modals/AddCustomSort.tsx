import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonButton,
	IonInput,
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
	addOutline,
	trash,
	reorderThree
} from 'ionicons/icons';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { LanguageCode } from 'iso-639-1';

import {
	EqualityObject,
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

import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import useI18Memo from '../../components/useI18Memo';
import useElement from '../../components/useElement';
import getSetValue from '../../components/getSetValue';
import Modal from '../../components/Modal';

interface CustomSortModal extends ModalProperties {
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
	"CustomSort", "DeleteSort", "SortAdded"
];

const commons = [
	"AddNew", "deleteThisCannotUndo",
	"MaybeDiscardThing", "defaultSort", "Delete",
	"Edit", "Ok", "Title", "UnsavedInfo",
	"YesDiscard", "areYouSure"
];

const AddCustomSort: FC<CustomSortModal> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tNone, tBaseOnly, tBlankProv, tCharsEqual, tComma, tCustomAlpha,
		tDefSens, tDiaPlus, tDia, tEqualities, tNoSep, tPeriod, tRelations,
		tSemi, tSimilarSep, tSpace, tTitleSort, tUniSort, tUppLow, tUseAlph,
		tWriteAlpha, tNoNewInfo, tNoTitle, tAltAlphExpl, tpSortLang,
		tpSortSens, tpAlphaSep, tCustomSort, tDelThing, tThingSaved
	] = useI18Memo(translations, 'settings');
	const [
		tAddNew, tYouSure, tSureDiscard, tDefSort, tDelete,
		tEdit, tOk, tTitle, tUnsaved, tYesDisc, tRUSure
	] = useI18Memo(commons);
	const tpTitle = useMemo(() => tc("Title", { context: "presentation" }), [tc]);

	const {
		isOpen,
		setIsOpen,

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
	const [addSortTitle, addSortTitleRef] = useElement<HTMLIonInputElement>();
	const [addCustomAlphabet, addCustomAlphabetRef] = useElement<HTMLIonInputElement>();
	const [addingCustomSortList, addingCustomSortListRef] = useElement<HTMLIonListElement>();
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setCustomizations([]);
		setSortLang("default");
		setSortSensitivity("default");
		setUsingAlpha(false);
		getSetValue(addSortTitle, "");
		getSetValue(addCustomAlphabet, "");
	}, [setIsOpen, addSortTitle, addCustomAlphabet]);
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
		const title = getSetValue(addSortTitle);
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
			const alpha: string[] = getSetValue(addCustomAlphabet)
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
		toast, usingAlpha, addSortTitle, addCustomAlphabet
	]);
	const maybeCancel = useCallback(() => {
		if(
			sortLang !== "default" || sortSensitivity !== "default"
			|| (usingAlpha && getSetValue(addCustomAlphabet).trim())
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
		tSureDiscard, tUnsaved, tYesDisc, usingAlpha, addCustomAlphabet
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
								addingCustomSortList && addingCustomSortList.closeSlidingItems();
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
								addingCustomSortList && addingCustomSortList.closeSlidingItems();
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
								addingCustomSortList && addingCustomSortList.closeSlidingItems();
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
								addingCustomSortList && addingCustomSortList.closeSlidingItems();
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
		setIncomingEquality, setIncomingRelation, addingCustomSortList
	]);
	const allLanguages = useMemo(() => languages.map((language) => (
		<IonSelectOption
			key={`knownLang:${language}`}
			className="ion-text-wrap ion-text-align-end"
			value={language}
		>{langObj[language] || language}</IonSelectOption>
	)), [languages, langObj]);
	return (
		<Modal
			isOpen={isOpen}
			closeFunc={maybeCancel}
			enclosed
			title={tCustomSort}
			bottomEnd={[{button: "add", action: maybeSaveNewSort}]}
			bottomStart={[{button: "cancel"}]}
			extraChars
		>
			<IonList lines="full" id="addingCustomSortList" ref={addingCustomSortListRef}>
				<IonItem>
					<div slot="start" className="ion-margin-end">{tpTitle}</div>
					<IonInput
						aria-label={tTitle}
						id="addSortTitle"
						helperText={tTitleSort}
						ref={addSortTitleRef}
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
								ref={addCustomAlphabetRef}
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
					onIonReorderEnd={doReorder}
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
		</Modal>
	);
};

export default AddCustomSort;
