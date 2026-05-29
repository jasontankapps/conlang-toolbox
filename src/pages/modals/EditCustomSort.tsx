import React, { useCallback, useEffect, useMemo, useState, FC } from 'react';
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
import { deleteCustomSort, editCustomSort } from '../../store/sortingSlice';
import useTranslator from '../../store/translationHooks';

import toaster from '../../components/toaster';
import yesNoAlert from '../../components/yesNoAlert';
import PermanentInfo from '../../components/PermanentInfo';
import useI18Memo from '../../components/useI18Memo';
import useElement from '../../components/useElement';
import getSetValue from '../../components/getSetValue';
import Modal from '../../components/Modal';

interface CustomSortModal extends ModalProperties {
	langObj: {[key: string]: string}
	languages: LanguageCode[]

	editingCustomSort: SortObject | null

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

const permanents = PermanentInfo.sort.permanentCustomSorts;

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
	"DeleteSort", "SortEdited", "EditSort",
	"SortDeleted"
];

const commons = [
	"AddNew", "defaultSort", "Delete", "Edit",
	"Ok", "Title", "areYouSure", "emphasizedError",
	"deleteThisCannotUndo",
];

const EditCustomSort: FC<CustomSortModal> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tAddNew, tDefSort, tDelete, tEdit,tOk,
		tTitle, tRUSure, tError, tYouSure
	] = useI18Memo(commons);
	const [
		tNone, tBase, tBlank, tCharsEqual, tComma, tCustomAlpha, tDefSens,
		tDiaPlus, tDia, tEqualities, tNoSep, tPeriod, tRelations, tSemi,
		tCharsSepar, tSpace, tTitleSort, tUnicode, tUppLow, tUseAlph,
		tWriteAlpha, tNoInfo, tNoTitle, tAltAlphaExpl,
		tpSortLang, tpSortSens, tpAlphaSep, tDelSort, tDelThisSort,
		tThingSaved, tEditThing, tThingDeleted
	] = useI18Memo(translations, "settings");
	const tpTitle = useMemo(() => tc("Title", { context: "presentation" }), [tc]);

	const {
		isOpen,
		setIsOpen,
		editingCustomSort,

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
	const [id, setId] = useState<string>("");
	const [sortLang, setSortLang] = useState<SortLanguage | "unicode" | "default">("default");
	const [sortSensitivity, setSortSensitivity] = useState<SortSensitivity | "default">("default");
	const [usingAlpha, setUsingAlpha] = useState<boolean>(false);
	const [separator, setSeparator] = useState<SortSeparator>("");
	const [customizations, setCustomizations] = useState<(RelationObject | EqualityObject)[]>([]);
	const [editSortTitle, editSortTitleRef] = useElement<HTMLIonInputElement>();
	const [editCustomAlphabet, editCustomAlphabetRef] = useElement<HTMLIonInputElement>();
	const [editingCustomSortList, editingCustomSortListRef] = useElement<HTMLIonListElement>();
	const onLoad = useCallback(() => {
		const {
			id = "ERROR",
			title = tError,
			sortLanguage = "default",
			sensitivity = "default",
			customAlphabet = [],
			separator = ",",
			customizations = []
		} = editingCustomSort || {};
		setId(id);
		getSetValue(editSortTitle, title);
		setSortLang(sortLanguage);
		setSortSensitivity(sensitivity);
		if(customAlphabet.length > 0) {
			setUsingAlpha(true);
		}
		getSetValue(editCustomAlphabet, customAlphabet.join(separator));
		setSeparator(separator);
		setCustomizations(customizations);
	}, [editingCustomSort, tError, editSortTitle, editCustomAlphabet]);
	const closeModal = useCallback(() => {
		setIsOpen(false);
		setId("");
		getSetValue(editSortTitle, "");
		setSortLang("default");
		setSortSensitivity("default");
		setUsingAlpha(false);
		getSetValue(editCustomAlphabet, "");
		setSeparator(",");
		setCustomizations([]);
	}, [setIsOpen, editSortTitle, editCustomAlphabet]);
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
					customizations.filter(obj => obj.id !== outgoingEquality)
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
	const maybeSaveEditedSort = useCallback(() => {
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
		const title = getSetValue(editSortTitle).trim();
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
			id,
			title
		};
		if(usingAlpha) {
			const alpha: string[] = getSetValue(editCustomAlphabet)
				.split(separator)
				.filter((char: string) => char);
			if(alpha.length === 0) {
				doAlert({
					message: tBlank,
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
				message: tNoInfo,
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
		dispatch(editCustomSort(customSort));
		closeModal();
		toaster({
			message: tThingSaved,
			position: "middle",
			color: "success",
			duration: 2000,
			toast
		});
	}, [
		closeModal, customizations, dispatch, doAlert, id,
		separator, sortLang, sortSensitivity, toast,
		usingAlpha, tBlank, tNoInfo, tNoTitle, tOk,
		tThingSaved, editSortTitle, editCustomAlphabet
	]);
	const maybeDeleteSort = useCallback(() => {
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
		const handler = () => {
			dispatch(deleteCustomSort(id));
			setIsOpen(false);
			toaster({
				message: tThingDeleted,
				color: "danger",
				duration: 2000,
				position: "top",
				toast
			});
		};
		yesNoAlert({
			header: tDelThisSort,
			message: tYouSure,
			submit: tc("confirmDel", { count: 1 }),
			cssClass: "danger",
			handler,
			doAlert
		});
	}, [dispatch, doAlert, id, setIsOpen, tDelThisSort, toast, tc, tOk, tThingDeleted, tYouSure]);
	const maybeAddNewRelation = useCallback(() => {
		setSavedRelation(null);
		addRelationModalInfo.setIsOpen(true);
	}, [addRelationModalInfo, setSavedRelation]);
	const maybeAddNewEquality = useCallback(() => {
		setSavedEquality(null);
		addEqualityModalInfo.setIsOpen(true);
	}, [addEqualityModalInfo, setSavedEquality]);
	const editRelation = useCallback((relation: RelationObject) => {
		if(editingCustomSortList) { editingCustomSortList.closeSlidingItems(); }
		setIncomingRelation(relation);
		editRelationModalInfo.setIsOpen(true);
	}, [editRelationModalInfo, setIncomingRelation, editingCustomSortList]);
	const maybeDeleteRelation = useCallback((id: string) => {
		yesNoAlert({
			header: tDelThisSort,
			message: tRUSure,
			submit: tc("confirmDel", { count: 1 }),
			cssClass: "danger",
			handler: () => setCustomizations(customizations.filter(obj => obj.id !== id)),
			doAlert
		});
	}, [customizations, doAlert, tDelThisSort, tc, tRUSure]);
	const editEquality = useCallback((relation: EqualityObject) => {
		if(editingCustomSortList) { editingCustomSortList.closeSlidingItems(); }
		setIncomingEquality(relation);
		editEqualityModalInfo.setIsOpen(true);
	}, [editEqualityModalInfo, setIncomingEquality, editingCustomSortList]);
	const maybeDeleteEquality = useCallback((id: string) => {
		if(editingCustomSortList) { editingCustomSortList.closeSlidingItems(); }
		yesNoAlert({
			header: tDelThisSort,
			message: tRUSure,
			submit: tc("confirmDel", { count: 1 }),
			cssClass: "danger",
			handler: () => setCustomizations(customizations.filter(obj => obj.id !== id)),
			doAlert
		});
	}, [customizations, doAlert, tDelThisSort, tc, tRUSure, editingCustomSortList]);
	const doReorder = useCallback((event: CustomEvent) => {
		const ed = event.detail;
		// move things around
		const { from, to } = ed;
		const moved = customizations[from];
		const remains = customizations.slice(0, from)
			.concat(customizations.slice(from + 1));
		const final = remains.slice(0, to).concat(moved, remains.slice(to));
		// save result
		setCustomizations(final);
		ed.complete();
	}, [customizations]);
	const allLanguages = useMemo(() => languages.map((language) => (
		<IonSelectOption
			key={`knownLang:${language}`}
			className="ion-text-wrap ion-text-align-end"
			value={language}
		>{langObj[language] || language}</IonSelectOption>
	)), [languages, langObj]);
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
					key={`equalityy:${id}`}
				>
					<IonItemOptions
						side="end"
						className="serifChars"
					>
						<IonItemOption
							color="primary"
							aria-label={tEdit}
							onClick={() => editEquality(obj)}
						>
							<IonIcon
								slot="icon-only"
								src="svg/edit.svg"
							/>
						</IonItemOption>
						<IonItemOption
							color="danger"
							aria-label={tDelete}
							onClick={() => maybeDeleteEquality(id)}
						>
							<IonIcon
								slot="icon-only"
								icon={trash}
							/>
						</IonItemOption>
					</IonItemOptions>
					<IonItem className="equality customization">
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
						><IonIcon size="small" src="svg/slide-indicator.svg" /></div>
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
					<IonItemOptions side="end" className="serifChars">
						<IonItemOption
							color="primary"
							aria-label={tEdit}
							onClick={() => editRelation(obj)}
						>
							<IonIcon slot="icon-only" src="svg/edit.svg" />
						</IonItemOption>
						<IonItemOption
							color="danger"
							aria-label={tDelete}
							onClick={() => maybeDeleteRelation(id)}
						>
							<IonIcon slot="icon-only" icon={trash} />
						</IonItemOption>
					</IonItemOptions>
					<IonItem className="relation customization">
						<IonReorder
							className="ion-padding-end"
						><IonIcon icon={reorderThree} /></IonReorder>
						{pre.length > 0 ?
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
						{post.length > 0 ?
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
	}), [customizations, editEquality, editRelation, maybeDeleteEquality, maybeDeleteRelation, tDelete, tEdit]);
	const doSetSeparator = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), [setSeparator]);
	const toggleUsingAlpha = useCallback(() => setUsingAlpha(!usingAlpha), [usingAlpha]);
	const doSetSortLang = useCallback((e: SelectCustomEvent) => setSortLang(e.detail.value), []);
	const doSetSortSens = useCallback((e: SelectCustomEvent) => setSortSensitivity(e.detail.value), []);
	return (
		<Modal
			isOpen={isOpen}
			closeFunc={closeModal}
			title={tEditThing}
			enclosed
			onIonModalDidPresent={onLoad}
			bottomEnd={[{button: "save", action: maybeSaveEditedSort}]}
			bottomStart={[{key: tDelSort, icon: "delete", isText: true, action: maybeDeleteSort}]}
			footerClass="modalBorderTop"
			extraChars
		>
			<IonList lines="full" id="editingCustomSortList" ref={editingCustomSortListRef}>
				<IonItem>
				<div slot="start" className="ion-margin-end">{tpTitle}</div>
					<IonInput
						aria-label={tTitle}
						id="editSortTitle"
						helperText={tTitleSort}
						ref={editSortTitleRef}
					/>
				</IonItem>
				<IonItem className="wrappableInnards">
					<IonSelect
						color="primary"
						className="ion-text-wrap settings"
						label={tpSortLang}
						value={sortLang}
						onIonChange={doSetSortLang}
					>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value="default"
						>{tDefSort}</IonSelectOption>
						{allLanguages}
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value="unicode"
						>{tUnicode}</IonSelectOption>
					</IonSelect>
				</IonItem>
				<IonItem className="wrappableInnards">
					<IonSelect
						color="primary"
						className="ion-text-wrap settings"
						label={tpSortSens}
						value={sortSensitivity}
						onIonChange={doSetSortSens}
					>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value="default"
						>{tDefSens}</IonSelectOption>
						<IonSelectOption
							className="ion-text-wrap ion-text-align-end"
							value="base"
						>{tBase}</IonSelectOption>
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
						<p>{tAltAlphaExpl}</p>
					</IonToggle>
				</IonItem>
				<IonItem
					lines="none"
					style={usingAlpha ? {} : {display: "none"}}
				>
					<IonInput
						aria-label={tCustomAlpha}
						id="editCustomAlphabet"
						helperText={tWriteAlpha}
						ref={editCustomAlphabetRef}
					/>
				</IonItem>
				<IonItem
					className="wrappableInnards"
					style={usingAlpha ? {} : {display: "none"}}
				>
					<IonSelect
						color="primary"
						className="ion-text-wrap settings"
						label={tpAlphaSep}
						value={separator}
						onIonChange={doSetSeparator}
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
				<IonItem className="wrappableInnards" lines="none">
					<IonLabel>
						<h2>{tRelations}</h2>
						<p>{tCharsSepar}</p>
					</IonLabel>
					<IonButton color="secondary" slot="end" onClick={maybeAddNewRelation}>
						<IonIcon icon={addOutline} slot="end" />
						<IonLabel>{tAddNew}</IonLabel>
					</IonButton>
				</IonItem>
				<IonItem className="wrappableInnards" lines="none">
					<IonLabel>
						<h2>{tEqualities}</h2>
						<p>{tCharsEqual}</p>
					</IonLabel>
					<IonButton color="secondary" slot="end" onClick={maybeAddNewEquality}>
						<IonIcon icon={addOutline} slot="end" />
						<IonLabel>{tAddNew}</IonLabel>
					</IonButton>
				</IonItem>
				<IonReorderGroup disabled={false} onIonReorderEnd={doReorder}>
					{customizations.length > 0 ?
						allCustomizations
					:
						<IonItem>
							<IonLabel className="ion-text-align-end"><em>{tNone}</em></IonLabel>
						</IonItem>
					}
				</IonReorderGroup>
			</IonList>
		</Modal>
	);
};

export default EditCustomSort;
