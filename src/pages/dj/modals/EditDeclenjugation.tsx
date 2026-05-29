import React, { useCallback, useEffect, useState, FC, useMemo } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonButton,
	IonInput,
	useIonAlert,
	useIonToast,
	IonToggle,
	IonItemDivider
} from '@ionic/react';
import { useSelector } from 'react-redux';
import {
	addCircle
} from 'ionicons/icons';

import {
	Declenjugation,
	ModalProperties,
	SetState,
	StateObject
} from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import toaster from '../../../components/toaster';
import yesNoAlert from '../../../components/yesNoAlert';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

interface EditDJModal extends ModalProperties {
	incomingDeclenjugation: Declenjugation | null
	setOutgoingDeclenjugation: SetState<Declenjugation | null | string>
	caseMakerModalInfo: ModalProperties
	savedTitle: string
	setSavedTitle: SetState<string>
	typeString: string
}

const translations = [
	"Modification", "Prefix", "Suffix",
	"modBaseWordNotStemMsg",
	"UseAdvancedMethod", "UseEntireWord",
	"noMatchExpressionMsg",
	"needTitleOrDescriptionMsg"
];

const commons = [
	"deleteThisCannotUndo", "MaybeDiscardEdits",
	"Deleted", "Ok", "UnsavedInfo", "YesDiscard"
];

const presentations = [ "MatchingExpression", "ReplacementExpression" ];

const context = { context: "presentation" };

const EditDeclenjugation: FC<EditDJModal> = (props) => {
	const {
		isOpen,
		setIsOpen,
		incomingDeclenjugation,
		setOutgoingDeclenjugation,
		caseMakerModalInfo,
		savedTitle,
		setSavedTitle,
		typeString
	} = props;

	const [ t ] = useTranslator('dj');
	const [ tc ] = useTranslator('common');
	const [
		tYouSureDel, tYouSureDiscard, tDeleted, tOk,
		tUnsaved, tYes
	] = useI18Memo(commons);
	const [
		tMod, tPref, tSuff, tBaseWord, tAdvMeth, tWord,
		tNoMatch, tNoTitle
	] = useI18Memo(translations, "dj");
	const tTitleMethod = useMemo(() => t("TitleMethod", { context: typeString || "Other" }), [t, typeString]);
	const tAdvExpl = useMemo(() => t("advancedExplanation", { context: typeString || "Other" }), [t, typeString]);
	const [ tpMatch, tpReplace ] = useI18Memo(presentations, "dj", context);
	const [ tMatch, tReplace ] = useI18Memo(presentations, "dj");
	const tEditThing = useMemo(() => t("Edit" + (typeString || "Other")), [typeString, t]);
	const tDelThing = useMemo(() => t("Delete" + (typeString || "Other")), [typeString, t]);

	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [id, setId] = useState<string>("");
	const [useWholeWord, setUseWholeWord] = useState<boolean>(false);
	const [useAdvancedMethod, setUseAdvancedMethod] = useState<boolean>(false);
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);
	const [editDJTitle, editDJTitleRef] = useElement<HTMLIonInputElement>();
	const [editDJPrefix, editDJPrefixRef] = useElement<HTMLIonInputElement>();
	const [editDJSuffix, editDJSuffixRef] = useElement<HTMLIonInputElement>();
	const [editDJRegex1, editDJRegex1Ref] = useElement<HTMLIonInputElement>();
	const [editDJRegex2, editDJRegex2Ref] = useElement<HTMLIonInputElement>();
	const onLoad = useCallback(() => {
		const {
			title = "",
			id = "",
			prefix = "",
			suffix = "",
			regex = ["", ""],
			useWholeWord: uww = false
		} = incomingDeclenjugation || {};
		const [regex1, regex2] = regex;
		setUseAdvancedMethod((regex1 || regex2) ? true : false);
		setUseWholeWord(uww);
		setId(id);
		getSetValue(editDJTitle, title);
		getSetValue(editDJPrefix, prefix);
		getSetValue(editDJSuffix, suffix);
		getSetValue(editDJRegex1, regex1);
		getSetValue(editDJRegex2, regex2);
	}, [incomingDeclenjugation, editDJTitle, editDJPrefix, editDJSuffix, editDJRegex1, editDJRegex2]);
	useEffect(() => {
		onLoad();
	}, [onLoad])
	const closeModal = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);
	const grabInfo = useCallback(() => {
		const title = getSetValue(editDJTitle).trim();
		const prefix = getSetValue(editDJPrefix);
		const suffix = getSetValue(editDJSuffix);
		const regex1 = getSetValue(editDJRegex1);
		const regex2 = getSetValue(editDJRegex2);
		return {
			title,
			prefix,
			suffix,
			regex1,
			regex2
		};
	}, [editDJPrefix, editDJSuffix, editDJTitle, editDJRegex1, editDJRegex2]);

	const tWordOrStem = useMemo(() => t(useWholeWord ? "word" : "stem"), [t, useWholeWord]);

	// Accept new title from other modal
	useEffect(() => {
		if(isOpen && savedTitle && editDJTitle) {
			const title = getSetValue(editDJTitle);
			getSetValue(editDJTitle, title ? (title + " " + savedTitle) : savedTitle);
			setSavedTitle("");
		}
	}, [isOpen, savedTitle, setSavedTitle, editDJTitle]);

	const maybeSaveEditedDeclenjugation = useCallback(() => {
		const {
			title,
			prefix,
			suffix,
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
			});
			return;
		}
		const editedDJ: Declenjugation = {
			id,
			title,
			useWholeWord
		};
		if(useAdvancedMethod) {
			if(!regex1) {
				doAlert({
					message: tNoMatch,
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
					header: t("regexpError", { regex: regex1 }),
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
			editedDJ.regex = [regex1, regex2];
		} else {
			editedDJ.prefix = prefix;
			editedDJ.suffix = suffix;
		}
		setOutgoingDeclenjugation(editedDJ);
		closeModal();
		toaster({
			message: tc("titleSaved", { title }),
			position: "middle",
			color: "success",
			duration: 2500,
			toast
		});
	}, [
		closeModal, doAlert, grabInfo, id, setOutgoingDeclenjugation, t,
		tc, tNoMatch, tNoTitle, tOk, toast, useAdvancedMethod,
		useWholeWord
	]);
	const maybeCancel = useCallback(() => {
		const {
			title,
			prefix,
			suffix,
			regex1,
			regex2
		} = grabInfo();
		const {
			title: _title = "",
			prefix: _prefix = "",
			suffix: _suffix = "",
			regex = ["", ""]
		} = incomingDeclenjugation || {};
		if(
			title !== _title
			|| prefix !== _prefix
			|| suffix !== _suffix
			|| regex.join("^^^") !== `${regex1}^^^${regex2}`
		) {
			return yesNoAlert({
				header: tUnsaved,
				message: tYouSureDiscard,
				cssClass: "warning",
				submit: tYes,
				handler: closeModal,
				doAlert
			});
		}
		closeModal();
	}, [closeModal, doAlert, grabInfo, incomingDeclenjugation, tUnsaved, tYes, tYouSureDiscard]);
	const maybeDelete = useCallback(() => {
		const handler = () => {
			setOutgoingDeclenjugation(id);
			closeModal();
			toaster({
				message: tDeleted,
				position: "middle",
				color: "danger",
				duration: 2000,
				toast
			});
		};
		if(!disableConfirms) {
			return yesNoAlert({
				header: tDelThing,
				message: tYouSureDel,
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
		handler();
	}, [
		closeModal, disableConfirms, doAlert, id, setOutgoingDeclenjugation,
		tDelThing, tc, tDeleted, tYouSureDel, toast
	]);
	const openCase = useCallback(() => caseMakerModalInfo.setIsOpen(true), [caseMakerModalInfo]);
	const toggleUseWholeWord = useCallback(() => setUseWholeWord(!useWholeWord), [useWholeWord]);
	const toggleUseAdvanced = useCallback(() => setUseAdvancedMethod(!useAdvancedMethod), [useAdvancedMethod]);
	return (
		<Modal
			isOpen={isOpen}
			enclosed
			onIonModalDidPresent={onLoad}
			title={tEditThing}
			closeFunc={maybeCancel}
			bottomEnd={[{button: "save", action: maybeSaveEditedDeclenjugation}]}
			bottomStart={[{button: "delete", action: maybeDelete}]}
			extraChars
		>
			<IonList lines="full" id="addingCustomDeclenjugatorList" className="hasSpecialLabels hasToggles">
				<IonItem className="labelled">
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tTitleMethod}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tTitleMethod}
						id="editDJTitle"
						ref={editDJTitleRef}
					/>
					<IonButton color="primary" onClick={openCase} slot="end">
						<IonIcon icon={addCircle} slot="icon-only" />
					</IonButton>
				</IonItem>
				<IonItem className="wrappableInnards">
					<IonToggle
						labelPlacement="start"
						enableOnOffLabels
						checked={useWholeWord}
						onIonChange={toggleUseWholeWord}
					>
						<h2>{tWord}</h2>
						<p>{tBaseWord}</p>
					</IonToggle>
				</IonItem>
				<IonItem className="wrappableInnards">
					<IonToggle
						labelPlacement="start"
						enableOnOffLabels
						checked={useAdvancedMethod}
						onIonChange={toggleUseAdvanced}
					>
						<h2>{tAdvMeth}</h2>
						<p>{tAdvExpl}</p>
					</IonToggle>
				</IonItem>
				<IonItemDivider>{tMod}</IonItemDivider>
				<IonItem className={`"labelled toggleable${useAdvancedMethod ? "" : " toggled"}`}>
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tpMatch}</IonLabel>
				</IonItem>
				<IonItem className={`"wrappableInnards toggleable${useAdvancedMethod ? "" : " toggled"}`}>
					<IonInput
						id="editDJRegex1"
						aria-label={tMatch}
						ref={editDJRegex1Ref}
					/>
				</IonItem>
				<IonItem className={`"labelled toggleable${useAdvancedMethod ? "" : " toggled"}`}>
					<IonLabel className="ion-text-wrap ion-padding-bottom">{tpReplace}</IonLabel>
				</IonItem>
				<IonItem className={`"wrappableInnards toggleable${useAdvancedMethod ? "" : " toggled"}`}>
					<IonInput
						id="editDJRegex2"
						aria-label={tReplace}
						ref={editDJRegex2Ref}
					/>
				</IonItem>
				<IonItem className={`"labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<div slot="start">{tPref}</div>
					<div slot="end">{tSuff}</div>
				</IonItem>
				<IonItem className={`"wrappableInnards prefixSuffix toggleable${useAdvancedMethod ? " toggled" : ""}`}>
					<IonInput
						id="editDJPrefix"
						aria-label={tPref}
						className="ion-text-end"
						ref={editDJPrefixRef}
					/>
					<div className="ion-text-center stem pad-horizontal-rem">
						<strong>{tWordOrStem}</strong>
					</div>
					<IonInput
						id="editDJSuffix"
						aria-label={tSuff}
						className="ion-text-start"
						ref={editDJSuffixRef}
					/>
				</IonItem>
			</IonList>
		</Modal>
	);
};

export default EditDeclenjugation;
