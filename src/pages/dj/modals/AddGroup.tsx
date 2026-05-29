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
import { v4 as uuidv4 } from 'uuid';

import {
	DJCustomInfo,
	DJGroup,
	DJSeparator,
	Declenjugation,
	ModalProperties,
	SetState,
	StateObject
} from '../../../store/types';
import { addGroup } from '../../../store/declenjugatorSlice';
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

interface AddGroupProps extends ModalProperties {
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
	"SepMultiWith", "AddGroup", "TitleInput"
];

const commons = [
	"AddNew", "MaybeDiscardEdits",
	"Delete", "Deleted", "Edit", "Ok", "UnsavedInfo", "YesDiscard",
	"areYouSure"
];

const AddGroup: FC<AddGroupProps> = (props) => {
	const [ t ] = useTranslator('dj');
	const [ tc ] = useTranslator('common');
	const [
		tChoose, tComma, tConj1, tDecl1, tNeedExpr, tOther1, tSemi, tSimple,
		tSlash, tSpace, tType, tUseAdv, tUseRegex, tNoTitle, tNoCond,
		tThingSaved, tEx, tWM, tRegEx, tpSeparate, tAddGroup, tTitleInput
	] = useI18Memo(translations, "dj");
	const [
		tAddNew, tYouSure, tDel, tDeleted, tEdit, tOk,
		tUnsaved, tYes, tRUSure
	] = useI18Memo(commons);
	const [ tTypes, tMatching, tRemoveStart, tReplacement, tRemoveEnd ] = useI18Memo(presentations, "dj");
	const [
		tpTypes, tpMatching, tpRemoveStart, tpReplacement,
		tpRemoveEnd, tpType
	] = useI18Memo(presentations, "dj", context);

	const {
		isOpen,
		setIsOpen,

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
	const [separator, setSeparator] = useState<DJSeparator>(" ");
	const [declenjugations, setDeclenjugations] = useState<Declenjugation[]>([]);
	const [useAdvancedMethod, setUseAdvancedMethod] = useState<boolean>(false);
	const [type, setType] = useState<keyof DJCustomInfo>("declensions");
	const [typeString, setTypeString] = useState<string>("Declensions");
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [addTitle, addTitleRef] = useElement<HTMLIonInputElement>();
	const [addAppliesTo, addAppliesToRef] = useElement<HTMLIonInputElement>();
	const [addStarts, addStartsRef] = useElement<HTMLIonInputElement>();
	const [addEnds, addEndsRef] = useElement<HTMLIonInputElement>();
	const [addRegex1, addRegex1Ref] = useElement<HTMLIonInputElement>();
	const [addRegex2, addRegex2Ref] = useElement<HTMLIonInputElement>();
	const [addingDJGroup, addingDJGroupRef] = useElement<HTMLIonListElement>();
	
	// Accept new declenjugation from other modal
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
		const plural = t(declenjugation || "Other");
		setDeclenjugationType(plural);
		setTypeString(plural);
	}, [t, type, setDeclenjugationType]);

	const onLoad = () => {
		setSeparator(" ");
		setDeclenjugations([]);
		getSetValue(addTitle, "");
		getSetValue(addAppliesTo, "");
		getSetValue(addStarts, "");
		getSetValue(addEnds, "");
		getSetValue(addRegex1, "");
		getSetValue(addRegex2, "");
	};
	const maybeSaveNewGroup = () => {
		const title = getSetValue(addTitle);
		const appliesTo = getSetValue(addAppliesTo);
		const starting = getSetValue(addStarts);
		const startsWith: string[] = starting ? clearBlanks(starting.split(separator)) : [];
		const ending = getSetValue(addStarts);
		const endsWith: string[] = ending ? clearBlanks(ending.split(separator)) : [];
		const regex1: string = getSetValue(addRegex1);
		const regex2: string = getSetValue(addRegex2);
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
					message: tNeedExpr,
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
		const newGroup: DJGroup = {
			id: uuidv4(),
			title,
			appliesTo,
			startsWith,
			endsWith,
			separator,
			declenjugations
		};
		if(regex1) {
			newGroup.regex = [regex1, regex2];
		}
		dispatch(addGroup({type, group: newGroup}));
		setIsOpen(false);
		toaster({
			message: tThingSaved,
			position: "middle",
			color: "success",
			duration: 2000,
			toast
		});
	};
	const maybeCancel = () => {
		const title = getSetValue(addTitle);
		const starting = getSetValue(addStarts);
		const startsWith: string[] = starting ? clearBlanks(starting.split(separator)) : [];
		const ending = getSetValue(addStarts);
		const endsWith: string[] = ending ? clearBlanks(ending.split(separator)) : [];
		const regex1: string = getSetValue(addRegex1);
		const regex2: string = getSetValue(addRegex2);
		if(title || regex1 || regex2 || (startsWith.length + endsWith.length > 0)) {
			return yesNoAlert({
				header: tUnsaved,
				message: tYouSure,
				cssClass: "warning",
				submit: tYes,
				handler: () => setIsOpen(false),
				doAlert
			});
		}
		setIsOpen(false);
	};

	const maybeAddNewDeclenjugation = useCallback(() => {
		setSavedDeclenjugation(null);
		addDeclenjugationModalInfo.setIsOpen(true);
	}, [addDeclenjugationModalInfo, setSavedDeclenjugation]);
	const editDeclenjugation = useCallback((declenjugation: Declenjugation) => {
		addingDJGroup && addingDJGroup.closeSlidingItems();
		setIncomingDeclenjugation(declenjugation);
		editDeclenjugationModalInfo.setIsOpen(true);
	}, [editDeclenjugationModalInfo, setIncomingDeclenjugation, addingDJGroup]);
	const maybeDeleteDeclenjugation = useCallback((id: string) => {
		addingDJGroup && addingDJGroup.closeSlidingItems();
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
		declenjugations, disableConfirms, doAlert,
		tc, tDeleted, tRUSure, toast, t,
		typeString, addingDJGroup
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
			title={tAddGroup}
			closeFunc={maybeCancel}
			isOpen={isOpen}
			enclosed
			onIonModalDidPresent={onLoad}
			bottomStart={[{button: "cancel"}]}
			bottomEnd={[{action: maybeSaveNewGroup, button: "save"}]}
			extraChars
		>
			<IonList lines="full" id="addingDJGroup" ref={addingDJGroupRef} className="hasSpecialLabels hasToggles">
				<IonItem className="labelled">
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tTitleInput}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTitleInput}
						id="addTitle"
						ref={addTitleRef}
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
				<IonLabel className="ion-text-wrap ion-padding-bottom">
					{tpTypes}
				</IonLabel>
				<IonItem>
					<IonInput
						aria-label={tTypes}
						id="addAppliesTo"
						ref={addAppliesToRef}
						placeholder={tEx}
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
						id="addRegex1"
						ref={addRegex1Ref}
						labelPlacement="stacked"
					/>
				</IonItem>
				<IonItem className={`labelled toggleable${useAdvancedMethod ? "" : " toggled"}`}>
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tpReplacement}</IonLabel>
				</IonItem>
				<IonItem className={`toggleable${useAdvancedMethod ? "" : " toggled"}`}>
					<IonInput
						aria-label={tReplacement}
						id="addRegex2"
						ref={addRegex2Ref}
						labelPlacement="stacked"
					/>
				</IonItem>
				<IonItem className={`labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tpRemoveStart}</IonLabel>
				</IonItem>
				<IonItem className={`toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<IonInput
						aria-label={tRemoveStart}
						ref={addStartsRef}
						id="addStarts"
					/>
				</IonItem>
				<IonItem className={`labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tpRemoveEnd}</IonLabel>
				</IonItem>
				<IonItem className={`toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<IonInput
						aria-label={tRemoveEnd}
						id="addEnds"
						ref={addEndsRef}
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
						aria-label={tChoose}
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

export default AddGroup;
