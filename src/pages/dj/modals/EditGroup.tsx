import React, { useCallback, useEffect, useState, FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
	addCircleOutline,
	trash,
	reorderThree
} from 'ionicons/icons';

import {
	DJCustomInfo,
	DJGroup,
	DJSeparator,
	Declenjugation,
	ModalProperties,
	SetState,
	StateObject
} from '../../../store/types';
import { addGroup, deleteGroup, editGroup } from '../../../store/declenjugatorSlice';
import useTranslator from '../../../store/translationHooks';

import toaster from '../../../components/toaster';
import yesNoAlert from '../../../components/yesNoAlert';
import ltr from '../../../components/LTR';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

function clearBlanks (input: string[]) {
	return input.filter(line => line);
}

interface EditGroupProps extends ModalProperties {
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
	"Delete", "Deleted", "Edit", "Ok", "UnsavedInfo",
	"YesDiscard", "areYouSure", "emphasizedError"
];


const EditGroup: FC<EditGroupProps> = (props) => {
	const [ t ] = useTranslator('dj');
	const [ tc ] = useTranslator('common');
	const [
		tAddNew, tYouSure, tDel, tDeleted, tEdit, tOk,
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
	const [editTitle, editTitleRef] = useElement<HTMLIonInputElement>();
	const [editAppliesTo, editAppliesToRef] = useElement<HTMLIonInputElement>();
	const [editStarts, editStartsRef] = useElement<HTMLIonInputElement>();
	const [editEnds, editEndsRef] = useElement<HTMLIonInputElement>();
	const [editRegex1, editRegex1Ref] = useElement<HTMLIonInputElement>();
	const [editRegex2, editRegex2Ref] = useElement<HTMLIonInputElement>();
	const [editingDJGroup, editingDJGroupRef] = useElement<HTMLIonListElement>();
	const [isLoaded, setIsLoaded] = useState(false);

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
		const [editingType, editingGroup] = editingGroupInfo || [type, {}];
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
		} = editingGroup;
		setId(id);
		setSeparator(separator);
		if(editingType) { setType(editingType); }
		setDeclenjugations(declenjugations);
		getSetValue(editTitle, title);
		getSetValue(editAppliesTo, appliesTo);
		getSetValue(editStarts, startsWith.join(separator));
		getSetValue(editEnds, endsWith.join(separator));
		if(regex) {
			setUseAdvancedMethod(true);
			getSetValue(editRegex1, regex[0]);
			getSetValue(editRegex2, regex[1]);
		} else {
			setUseAdvancedMethod(false);
		}
	}, [
		editingGroupInfo, type, tError, editTitle, editAppliesTo,
		editStarts, editEnds, editRegex1, editRegex2
	]);

	useEffect(() => {
		if(isLoaded && editTitle && editAppliesTo && editStarts && editEnds && editRegex1 && editRegex2) { return; }
		onLoad();
		setIsLoaded(true);
	}, [
		isLoaded, setIsLoaded, onLoad, editTitle, editAppliesTo,
		editStarts, editEnds, editRegex1, editRegex2
	]);

	const closeModal = useCallback(() => {
		setIsOpen(false);
		setId("");
		getSetValue(editTitle, "");
		getSetValue(editAppliesTo, "");
		setSeparator(" ");
		setDeclenjugations([]);
		getSetValue(editStarts, "");
		getSetValue(editEnds, "");
		getSetValue(editRegex1, "");
		getSetValue(editRegex2, "");
	}, [setIsOpen, editTitle, editAppliesTo, editStarts, editEnds, editRegex1, editRegex2]);

	const grabInfo = useCallback(() => {
		const title = getSetValue(editTitle).trim();
		const appliesTo = getSetValue(editAppliesTo).trim();
		const startsWith: string[] = clearBlanks(getSetValue(editStarts).split(separator));
		const endsWith: string[] = clearBlanks(getSetValue(editEnds).split(separator));
		const regex1 = getSetValue(editRegex1);
		const regex2 = getSetValue(editRegex2);
		return {
			title,
			appliesTo,
			startsWith,
			endsWith,
			regex1,
			regex2
		};
	}, [separator, editTitle, editAppliesTo, editStarts, editEnds, editRegex1, editRegex2]);
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
	}, [
		closeModal, declenjugations, doAlert, editingGroupInfo,
		grabInfo, separator, type, tUnsaved, tYes, tYouSure
	]);
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
		editingDJGroup && editingDJGroup.closeSlidingItems();
		setIncomingDeclenjugation(declenjugation);
		editDeclenjugationModalInfo.setIsOpen(true);
	}, [editDeclenjugationModalInfo, setIncomingDeclenjugation, editingDJGroup]);
	const maybeDeleteDeclenjugation = useCallback((id: string) => {
		editingDJGroup && editingDJGroup.closeSlidingItems();
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
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: t("Delete" + typeString),
				message: tRUSure,
				submit: tc("confirmDel", { count: 1 }),
				cssClass: "danger",
				handler,
				doAlert
			});
		}
	}, [
		typeString, t, declenjugations, disableConfirms,
		doAlert, tc, tDeleted, tRUSure, toast, editingDJGroup
	]);

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
			if(prefix) { stem = prefix + stem; }
			if(suffix) { stem = stem + suffix; }
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
		<Modal
			bottomEnd={[{button: "save", action: maybeSaveGroup}]}
			bottomStart={[{button: "delete", action: maybeDeleteGroup}]}
			isOpen={isOpen}
			closeFunc={maybeCancel}
			title={tEditGroup}
			enclosed
			onIonModalDidPresent={onLoad}
			extraChars
		>
			<IonList lines="full" id="editingDJGroup" ref={editingDJGroupRef} className="hasSpecialLabels hasToggles">
				<IonItem className="labelled">
					<IonLabel className="ion-text-wrap ion-padding-bottom">
						{tTitleInput}
					</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTitleInput}
						id="editTitle"
						ref={editTitleRef}
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
						ref={editAppliesToRef}
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
						ref={editRegex1Ref}
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
						ref={editRegex2Ref}
					/>
				</IonItem>
				<IonItem className={`labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tpRemoveStart}</IonLabel>
				</IonItem>
				<IonItem className={`toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<IonInput
						aria-label={tRemoveStart}
						id="editStarts"
						ref={editStartsRef}
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
						ref={editEndsRef}
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
					onIonReorderEnd={doReorder}
				>
					{allDeclenjugations}
				</IonReorderGroup>
			</IonList>
		</Modal>
	);
};

export default EditGroup;
