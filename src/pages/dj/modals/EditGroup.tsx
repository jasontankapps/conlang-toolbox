import React, { useCallback, useEffect, useState, FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonToolbar,
	IonButton,
	IonModal,
	IonInput,
	IonFooter,
	useIonAlert,
	useIonToast,
	IonSelect,
	IonSelectOption,
	IonItemDivider,
	IonReorder,
	IonItemOption,
	IonItemOptions,
	IonItemSliding,
	IonToggle,
	IonReorderGroup,
	SelectCustomEvent
} from '@ionic/react';
import {
	saveOutline,
	addCircleOutline,
	trash,
	reorderThree,
	trashOutline
} from 'ionicons/icons';

import {
	DJCustomInfo,
	DJGroup,
	DJSeparator,
	Declenjugation,
	ExtraCharactersModalOpener,
	ModalProperties,
	SetState,
	StateObject
} from '../../../store/types';
import { addGroup, deleteGroup, editGroup } from '../../../store/declenjugatorSlice';
import useTranslator from '../../../store/translationHooks';

import { $i } from '../../../components/DollarSignExports';
import toaster from '../../../components/toaster';
import yesNoAlert from '../../../components/yesNoAlert';
import ltr from '../../../components/LTR';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

function clearBlanks (input: string[]) {
	return input.filter(line => line);
}

interface EditGroupProps extends ExtraCharactersModalOpener {
	editingGroupInfo: [keyof DJCustomInfo, DJGroup] | null

	addDeclenjugationModalInfo: ModalProperties
	savedDeclenjugation: Declenjugation | null
	setSavedDeclenjugation: SetState<Declenjugation | null>
	setDeclenjugationType: SetState<string>

	editDeclenjugationModalInfo: ModalProperties
	setIncomingDeclenjugation: SetState<Declenjugation | null>
	outgoingDeclenjugation: Declenjugation | null | string
	setOutgoingDeclenjugation: SetState<Declenjugation | null | string>
}

const presentations = [
	"TypesBeingAffected", "MatchingExpression",
	"RemoveFromStartOfWordToFindRoot", "ReplacementExpression",
	"RemoveFromEndOfWordToFindRoot", "Type"
];
const context = { context: "presentation" };

const translations = [
	"ChooseSeparator", "Comma", "Conjugation", "Declension",
	"regExNeedsBothMsg",
	"Other1", "Semicolon", "SimpleRootFinder", "Slash", "Space", "Type",
	"UseAdvancedMethod", "UseRegExpToIdStem",
	"needTitleOrDescriptionMsg",
	"needConditionMsg", "GroupSaved",
	"exampleAppliesTo", "wordMarker", "RegExp",
	"SepMultiWith", "EditGroup", "TitleInput",
	"delEntireGroup", "GroupDeleted"
];

const commons = [
	"AddNew", "MaybeDiscardEdits",
	"Delete", "Deleted", "Edit", "Ok", "Save", "UnsavedInfo",
	"YesDiscard", "areYouSure", "emphasizedError"
];


const EditGroup: FC<EditGroupProps> = (props) => {
	const [ t ] = useTranslator('dj');
	const [ tc ] = useTranslator('common');
	const [
		tAddNew, tYouSure, tDel, tDeleted, tEdit, tOk, tSave,
		tUnsaved, tYes, tRUSure, tError
	] = useI18Memo(commons);
	const [ tChooseSep, tComma, tConj1, tDecl1, tNeedBoth, tOther1, tSemi,
		tSimple, tSlash, tSpace, tType, tUseAdv, tUseRegex, tNoTitle,
		tNoCond, tThingSaved, tExample, tWM, tRegEx, tpSeparate, tEditGroup,
		tTitleInput, tDelAllMsg, tGroupDeleted
	] = useI18Memo(translations, "dj");
	const [ tTypes, tMatching, tRemoveStart, tReplacement, tRemoveEnd ] = useI18Memo(presentations, "dj");
	const [
		tpTypes, tpMatching, tpRemoveStart,
		tpReplacement, tpRemoveEnd, tpType
	] = useI18Memo(presentations, "dj", context);

	const {
		isOpen,
		setIsOpen,
		openECM,

		editingGroupInfo,

		addDeclenjugationModalInfo,
		savedDeclenjugation,
		setSavedDeclenjugation,
		setDeclenjugationType,

		editDeclenjugationModalInfo,
		setIncomingDeclenjugation,
		outgoingDeclenjugation,
		setOutgoingDeclenjugation
	} = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [id, setId] = useState<string>("");
	const [separator, setSeparator] = useState<DJSeparator>(" ");
	const [declenjugations, setDeclenjugations] = useState<Declenjugation[]>([]);
	const [useAdvancedMethod, setUseAdvancedMethod] = useState<boolean>(false);
	const [type, setType] = useState<keyof DJCustomInfo>("declensions");
	const [typeString, setTypeString] = useState<string>("Declensions");
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);

	useEffect(() => {
		if(isOpen && savedDeclenjugation) {
			if(declenjugations.length === 0) {
				setDeclenjugations([savedDeclenjugation]);
			} else {
				if(declenjugations.slice().pop()!.id === savedDeclenjugation.id) {
					// We already saved this.
					return;
				}
				setDeclenjugations([...declenjugations, savedDeclenjugation]);
			}
			setSavedDeclenjugation(null);
		}
	}, [isOpen, savedDeclenjugation, setSavedDeclenjugation, declenjugations]);
	// Accept edited declenjugation from other modal
	useEffect(() => {
		if(isOpen && outgoingDeclenjugation) {
			if(typeof outgoingDeclenjugation === "string") {
				// a string means the declenjugation was deleted
				setDeclenjugations(
					declenjugations.filter(obj => obj.id !== outgoingDeclenjugation)
				);
			} else {
				setDeclenjugations(
					declenjugations.map(
						obj => (obj.id === outgoingDeclenjugation.id ? outgoingDeclenjugation : obj)
					)
				);
			}
			setOutgoingDeclenjugation(null);
		}
	}, [isOpen, outgoingDeclenjugation, setOutgoingDeclenjugation, declenjugations]);
	// Set typeString
	useEffect(() => {
		let declenjugation: string | undefined;
		switch(type) {
			case "declensions":
				declenjugation = "Declensions";
				break;
			case "conjugations":
				declenjugation = "Conjugations";
				break;
			case "other":
				declenjugation = "Other";
		}
		const plural = t(declenjugation || "");
		setDeclenjugationType(plural);
		setTypeString(plural);
	}, [t, type, setDeclenjugationType]);

	const onLoad = useCallback(() => {
		const [editingType, editingGroup] = editingGroupInfo || [type, null];
		const error = tError;
		const {
			id = error,
			title = error,
			appliesTo = "",
			startsWith = [error],
			endsWith = [error],
			regex,
			separator = " ",
			declenjugations = []
		} = editingGroup || {};
		setId(id);
		setSeparator(separator);
		editingType && setType(editingType);
		setDeclenjugations(declenjugations);
		const editTitle = $i<HTMLInputElement>("editTitle");
		editTitle && (editTitle.value = title);
		const editAppliesTo = $i<HTMLInputElement>("editAppliesTo");
		editAppliesTo && (editAppliesTo.value = appliesTo);
		const editStarts = $i<HTMLInputElement>("editStarts");
		editStarts && (editStarts.value = startsWith.join(separator));
		const editEnds = $i<HTMLInputElement>("editEnds");
		editEnds && (editEnds.value = endsWith.join(separator));
		if(regex) {
			setUseAdvancedMethod(true);
			const editRegex1 = $i<HTMLInputElement>("editRegex1");
			editRegex1 && (editRegex1.value = regex[0]);
			const editRegex2 = $i<HTMLInputElement>("editRegex2");
			editRegex2 && (editRegex2.value = regex[1]);
		} else {
			setUseAdvancedMethod(false);
		}
	}, [editingGroupInfo, type, tError]);

	const closeModal = useCallback(() => {
		setIsOpen(false);
		setId("");
		const editSortTitle = $i<HTMLInputElement>("editSortTitle");
		editSortTitle && (editSortTitle.value = "");
		const editAppliesTo = $i<HTMLInputElement>("editAppliesTo");
		editAppliesTo && (editAppliesTo.value = "");
		setSeparator(" ");
		setDeclenjugations([]);
		const editStarts = $i<HTMLInputElement>("editStarts");
		editStarts && (editStarts.value = "");
		const editEnds = $i<HTMLInputElement>("editEnds");
		editEnds && (editEnds.value = "");
		const editRegex1 = $i<HTMLInputElement>("editRegex1");
		editRegex1 && (editRegex1.value = "");
		const editRegex2 = $i<HTMLInputElement>("editRegex2");
		editRegex2 && (editRegex2.value = "");
	}, [setIsOpen]);

	const grabInfo = useCallback(() => {
		const editTitle = $i<HTMLInputElement>("editTitle");
		const title = editTitle ? editTitle.value.trim() : "";
		const editAppliesTo = $i<HTMLInputElement>("editAppliesTo");
		const appliesTo = editAppliesTo ? editAppliesTo.value.trim() : "";
		const editStarts = $i<HTMLInputElement>("editStarts");
		const startsWith: string[] = editStarts && editStarts.value ? clearBlanks(editStarts.value.split(separator)) : [];
		const editEnds = $i<HTMLInputElement>("editEnds");
		const endsWith: string[] = editEnds && editEnds.value ? clearBlanks(editEnds.value.split(separator)) : [];
		const editRegex1 = $i<HTMLInputElement>("editRegex1");
		const regex1: string = (editRegex1 && editRegex1.value) || "";
		const editRegex2 = $i<HTMLInputElement>("editRegex2");
		const regex2: string = (editRegex2 && editRegex2.value) || "";
		return {
			title,
			appliesTo,
			startsWith,
			endsWith,
			regex1,
			regex2
		};
	}, [separator]);
	const maybeSaveGroup = useCallback(() => {
		const {
			title,
			appliesTo,
			startsWith,
			endsWith,
			regex1,
			regex2
		} = grabInfo();
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
		} else if (useAdvancedMethod) {
			if(!regex1 || !regex2) {
				doAlert({
					message: tNeedBoth,
					cssClass: "danger",
					buttons: [
						{
							text: tOk,
							role: "cancel",
							cssClass: "submit"
						}
					]
				});
				return;
			}
			try {
				new RegExp(regex1);
			} catch(e) {
				doAlert({
					header: tc("regexpError", { regex: regex1 }),
					message: `${e}`,
					cssClass: "danger",
					buttons: [
						{
							text: tOk,
							role: "cancel",
							cssClass: "submit"
						}
					]
				});
				return;
			}
		} else if((startsWith.length + endsWith.length) === 0) {
			doAlert({
				message: tNoCond,
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
		const editedGroup: DJGroup = {
			id,
			title,
			appliesTo,
			startsWith,
			endsWith,
			separator,
			declenjugations
		};
		if(regex1) {
			editedGroup.regex = [regex1, regex2];
		}
		const editingType = editingGroupInfo![0];
		if(type === editingType) {
			dispatch(editGroup({type, group: editedGroup}));
		} else {
			dispatch(deleteGroup([editingType, id]));
			dispatch(addGroup({type, group: editedGroup}))
		}
		closeModal();
		toaster({
			message: tThingSaved,
			position: "middle",
			color: "success",
			duration: 2000,
			toast
		});
	}, [
		closeModal, declenjugations, dispatch, doAlert, editingGroupInfo,
		grabInfo, id, separator, tThingSaved, tc, toast, type, useAdvancedMethod,
		tNeedBoth, tNoCond, tNoTitle, tOk
	]);
	const maybeCancel = useCallback(() => {
		const {
			title,
			appliesTo,
			startsWith,
			endsWith,
			regex1,
			regex2
		} = grabInfo();
		const [editingType, editingGroup] = editingGroupInfo!;
		const {
			title: _title,
			appliesTo: _appliesTo,
			startsWith: starts = [],
			endsWith: ends = [],
			regex = ["",""],
			separator: _sep,
			declenjugations: _dec = []
		} = editingGroup || {};
		const mapper = (decl: Declenjugation) => {
			const {
				title,
				prefix = "",
				suffix = "",
				regex = [],
				useWholeWord
			} = decl;
			return `${title}...${prefix},,,${suffix}---${regex.join("///")}===${useWholeWord}`;
		};
		const changed = (
			title !== _title
			|| type !== editingType
			|| appliesTo !== _appliesTo
			|| _sep !== separator
			|| starts.join(separator) !== startsWith.join(separator)
			|| ends.join(separator) !== endsWith.join(separator)
			|| regex.join(separator) !== `${regex1}${separator}${regex2}`
			|| _dec.length !== declenjugations.length
			|| _dec.map(mapper).join(separator) !== declenjugations.map(mapper).join(separator)
		);
		if(changed) {
			return yesNoAlert({
				header: tUnsaved,
				message: tYouSure,
				cssClass: "warning",
				submit: tYes,
				handler: closeModal,
				doAlert
			});
		}
		closeModal();
	}, [closeModal, declenjugations, doAlert, editingGroupInfo, grabInfo, separator, type, tUnsaved, tYes, tYouSure]);
	const maybeDeleteGroup = useCallback(() => {
		const handler = () => {
			dispatch(deleteGroup([editingGroupInfo![0], id]));
			closeModal();
			toaster({
				message: tGroupDeleted,
				position: "middle",
				color: "danger",
				duration: 2000,
				toast
			});
		};
		if(!disableConfirms) {
			return yesNoAlert({
				header: tYouSure,
				message: tDelAllMsg,
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
		handler();
	}, [
		closeModal, disableConfirms, dispatch, doAlert, editingGroupInfo,
		id, tc, toast, tDelAllMsg, tYouSure, tGroupDeleted
	]);

	const maybeAddNewDeclenjugation = useCallback(() => {
		setSavedDeclenjugation(null);
		addDeclenjugationModalInfo.setIsOpen(true);
	}, [addDeclenjugationModalInfo, setSavedDeclenjugation]);
	const editDeclenjugation = useCallback((declenjugation: Declenjugation) => {
		const el = $i<HTMLIonListElement>("editingDJGroup");
		el && el.closeSlidingItems();
		setIncomingDeclenjugation(declenjugation);
		editDeclenjugationModalInfo.setIsOpen(true);
	}, [editDeclenjugationModalInfo, setIncomingDeclenjugation]);
	const maybeDeleteDeclenjugation = useCallback((id: string) => {
		const el = $i<HTMLIonListElement>("editingDJGroup");
		el && el.closeSlidingItems();
		const handler = () => {
			setDeclenjugations(declenjugations.filter(obj => obj.id !== id));
			toaster({
				message: tDeleted,
				position: "middle",
				color: "danger",
				duration: 2000,
				toast
			});
		};
		disableConfirms ? handler() : yesNoAlert({
			header: t("Delete" + typeString),
			message: tRUSure,
			submit: tc("confirmDel", { count: 1 }),
			cssClass: "danger",
			handler,
			doAlert
		});
	}, [typeString, t, declenjugations, disableConfirms, doAlert, tc, tDeleted, tRUSure, toast]);

	const doReorder = useCallback((event: CustomEvent) => {
		const ed = event.detail;
		// move things around
		const { from, to } = ed;
		const moved = declenjugations[from];
		const remains = declenjugations.slice(0, from).concat(declenjugations.slice(from + 1));
		const final = remains.slice(0, to).concat(moved, remains.slice(to));
		// save result
		setDeclenjugations(final);
		ed.complete();
	}, [declenjugations]);

	const allDeclenjugations = useMemo(() => declenjugations.map(dj => {
		const {
			title,
			id,
			prefix,
			suffix,
			regex,
			useWholeWord
		} = dj;
		let stem = "";
		if(regex) {
			const arrow = (ltr() ? "⟶" : "⟵");
			const [match, replace] = regex;
			stem = `/${match}/ ${arrow} ${replace}`;
		} else {
			stem = "-";
			prefix && (stem = prefix + stem);
			suffix && (stem = stem + suffix);
		}
		return (
			<IonItemSliding
				className="groupedDeclenjugation"
				key={`add:${id}`}
			>
				<IonItemOptions side="end" className="serifChars">
					<IonItemOption
						color="primary"
						aria-label={tEdit}
						onClick={() => editDeclenjugation(dj)}
					>
						<IonIcon
							slot="icon-only"
							src="svg/edit.svg"
						/>
					</IonItemOption>
					<IonItemOption
						color="danger"
						aria-label={tDel}
						onClick={() => maybeDeleteDeclenjugation(id)}
					>
						<IonIcon
							slot="icon-only"
							icon={trash}
						/>
					</IonItemOption>
				</IonItemOptions>
				<IonItem className="groupedDeclenjugation">
					<IonReorder className="ion-padding-end"><IonIcon icon={reorderThree} /></IonReorder>
					<div className="title"><strong>{title}</strong></div>
					<div className="stem">
						<em>{stem}</em>
						{
							useWholeWord ?
								<em className="mini">{tWM}</em>
							:
								<></>
						}
					</div>
					<div className="icon"><IonIcon size="small" src="svg/slide-indicator.svg" /></div>
				</IonItem>
			</IonItemSliding>
		);
	}), [declenjugations, editDeclenjugation, maybeDeleteDeclenjugation, tDel, tEdit, tWM]);

	const doSetType = useCallback((e: SelectCustomEvent) => setType(e.detail.value), []);
	const toggleAdvMeth = useCallback(() => setUseAdvancedMethod(!useAdvancedMethod), [useAdvancedMethod]);
	const doSetSep = useCallback((e: SelectCustomEvent) => setSeparator(e.detail.value), []);
	const interfaceOperatorSep = useMemo(() => ({header: "Separator"}), []);
	const interfaceOperatorType = useMemo(() => ({header: tType}), [tType]);

	return (
		<IonModal isOpen={isOpen} backdropDismiss={false} onIonModalDidPresent={onLoad}>
			<ModalHeader title={tEditGroup} openECM={openECM} closeModal={maybeCancel}  />
			<IonContent>
				<IonList lines="full" id="editingDJGroup" className="hasSpecialLabels hasToggles">
					<IonItem className="labelled">
						<IonLabel className="ion-text-wrap ion-padding-bottom">
							{tTitleInput}
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTitleInput}
							id="editTitle"
						/>
					</IonItem>
					<IonItem>
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							label={tpType}
							value={type}
							onIonChange={doSetType}
							interfaceOptions={interfaceOperatorType}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="declensions"
							>{tDecl1}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="conjugations"
							>{tConj1}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="other"
							>{tOther1}</IonSelectOption>
						</IonSelect>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="ion-text-wrap ion-padding-bottom">
							{tpTypes}
						</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTypes}
							id="editAppliesTo"
							placeholder={tExample}
						/>
					</IonItem>
					<IonItem className="wrappableInnards">
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={useAdvancedMethod}
							onIonChange={toggleAdvMeth}
						>
							<h2>{tUseAdv}</h2>
							<p>{tUseRegex}</p>
						</IonToggle>
					</IonItem>
					<IonItemDivider>{useAdvancedMethod ? tRegEx : tSimple}</IonItemDivider>
					<IonItem className={`labelled toggleable${useAdvancedMethod ? "" : " toggled"}`}>
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tpMatching}</IonLabel>
					</IonItem>
					<IonItem lines="none" className={`toggleable${useAdvancedMethod ? "" : " toggled"}`}>
						<IonInput
							aria-label={tMatching}
							id="editRegex1"
							labelPlacement="stacked"
						/>
					</IonItem>
					<IonItem className={`labelled toggleable${useAdvancedMethod ? "" : " toggled"}`}>
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tpReplacement}</IonLabel>
					</IonItem>
					<IonItem className={`toggleable${useAdvancedMethod ? "" : " toggled"}`}>
						<IonInput
							aria-label={tReplacement}
							id="editRegex2"
							labelPlacement="stacked"
						/>
					</IonItem>
					<IonItem className={`labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tpRemoveStart}</IonLabel>
					</IonItem>
					<IonItem className={`toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<IonInput
							aria-label={tRemoveStart}
							id="editStarts"
						/>
					</IonItem>
					<IonItem className={`labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tpRemoveEnd}</IonLabel>
					</IonItem>
					<IonItem className={`toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<IonInput
							aria-label={tRemoveEnd}
							id="editEnds"
							labelPlacement="stacked"
						/>
					</IonItem>
					<IonItem className={`labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tpSeparate}</IonLabel>
					</IonItem>
					<IonItem className={`wrappableInnards toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<IonSelect
							color="primary"
							className="ion-text-wrap settings"
							aria-label={tChooseSep}
							value={separator}
							onIonChange={doSetSep}
							interfaceOptions={interfaceOperatorSep}
						>
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
								value=";"
							>{tSemi}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="/"
							>{tSlash}</IonSelectOption>
						</IonSelect>
					</IonItem>
					<IonItemDivider color="secondary">{typeString}</IonItemDivider>
					<IonItem>
						<IonButton slot="end" onClick={maybeAddNewDeclenjugation}>
							<IonIcon slot="start" icon={addCircleOutline} />
							{tAddNew}
						</IonButton>
					</IonItem>
					<IonReorderGroup
						disabled={false}
						onIonItemReorder={doReorder}
					>
						{allDeclenjugations}
					</IonReorderGroup>
				</IonList>
			</IonContent>
			<IonFooter className="modalBorderTop">
				<IonToolbar>
					<IonButton
						color="danger"
						slot="start"
						onClick={maybeDeleteGroup}
					>
						<IonIcon icon={trashOutline} slot="start" />
						<IonLabel>{tDel}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={maybeSaveGroup}
					>
						<IonIcon icon={saveOutline} slot="end" />
						<IonLabel>{tSave}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default EditGroup;
