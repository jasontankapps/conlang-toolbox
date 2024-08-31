import React, { useCallback, useEffect, useState, FC, useMemo } from 'react';
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
	IonToggle,
	IonItemDivider
} from '@ionic/react';
import {
	closeCircleOutline,
	saveOutline,
	addCircle
} from 'ionicons/icons';
import { v4 as uuidv4 } from 'uuid';

import {
	Declenjugation,
	ExtraCharactersModalOpener,
	ModalProperties,
	SetState
} from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import { $i } from '../../../components/DollarSignExports';
import toaster from '../../../components/toaster';
import yesNoAlert from '../../../components/yesNoAlert';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

interface AddDJModal extends ExtraCharactersModalOpener {
	setSavedDeclenjugation: SetState<Declenjugation | null>
	caseMakerModalInfo: ModalProperties
	savedTitle: string
	setSavedTitle: SetState<string>
	typeString: string
}

const translations = [
	"modBaseWordNotStemMsg",
	"Modification", "Prefix", "Suffix", "UseAdvancedMethod",
	"noMatchExpressionMsg", "UseEntireWord",
	"needTitleOrDescriptionMsg",
	"MatchingExpression", "ReplacementExpression",
	"word", "stem"
];

const commons = [
	"MaybeDiscardThing", "Cancel",
	"Ok", "Save", "UnsavedInfo", "YesDiscard"
];

const expressions = [ "MatchingExpression", "ReplacementExpression" ];
const context = { context: "presentation" };

const AddDeclenjugation: FC<AddDJModal> = (props) => {
	const {
		isOpen,
		setIsOpen,
		openECM,
		setSavedDeclenjugation,
		caseMakerModalInfo,
		savedTitle,
		setSavedTitle,
		typeString
	} = props;

	const [ t ] = useTranslator('dj');
	const [ tYouSure, tCancel, tOk, tSave, tUnsaved, tYes ] = useI18Memo(commons);
	const [
		tBaseNotStem, tMod, tPref, tSuff, tAdvMeth, tNoMatch,
		tUseWord, tNoTitle, tMEx, tREx, tWord, tStem
	] = useI18Memo(translations, "dj");
	const tAddThing = useMemo(() => typeString ? t("Add" + (typeString || "Other")) : "", [t, typeString]);
	const tThingSaved = useMemo(() => typeString ? t((typeString || "Other") + "Saved") : "", [t, typeString]);
	const [ tpMEx, tpREx ] = useI18Memo(expressions, "dj", context);
	const tTitleMethod = useMemo(() => t("TitleMethod", { context: typeString || "Other" }), [t, typeString]);
	const tAdvExpl = useMemo(() => t("advancedExplanation", { context: typeString || "Other" }), [t, typeString]);

	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const [useWholeWord, setUseWholeWord] = useState<boolean>(false);
	const [useAdvancedMethod, setUseAdvancedMethod] = useState<boolean>(false);
	const onLoad = useCallback(() => {
		setUseAdvancedMethod(false);
		setUseWholeWord(false);
		const addDJTitle = $i<HTMLInputElement>("addDJTitle");
		addDJTitle && (addDJTitle.value = "");
		const addDJPrefix = $i<HTMLInputElement>("addDJPrefix");
		addDJPrefix && (addDJPrefix.value = "");
		const addDJSuffix = $i<HTMLInputElement>("addDJSuffix");
		addDJSuffix && (addDJSuffix.value = "");
		const addDJRegex1 = $i<HTMLInputElement>("addDJRegex1");
		addDJRegex1 && (addDJRegex1.value = "");
		const addDJRegex2 = $i<HTMLInputElement>("addDJRegex2");
		addDJRegex2 && (addDJRegex2.value = "");
	}, []);
	const closeModal = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);
	const grabInfo = useCallback(() => {
		const addDJTitle = $i<HTMLInputElement>("addDJTitle");
		const title = addDJTitle ? addDJTitle.value.trim() : "";
		const addDJPrefix = $i<HTMLInputElement>("addDJPrefix");
		const prefix = addDJPrefix && addDJPrefix.value ? addDJPrefix.value : "";
		const addDJSuffix = $i<HTMLInputElement>("addDJSuffix");
		const suffix = addDJSuffix && addDJSuffix.value ? addDJSuffix.value : "";
		const addDJRegex1 = $i<HTMLInputElement>("addDJRegex1");
		const regex1 = addDJRegex1 && addDJRegex1.value ? addDJRegex1.value : "";
		const addDJRegex2 = $i<HTMLInputElement>("addDJRegex2");
		const regex2 = addDJRegex2 && addDJRegex2.value ? addDJRegex2.value : "";
		return {
			title,
			prefix,
			suffix,
			regex1,
			regex2
		};
	}, []);

	// Accept new title from other modal
	useEffect(() => {
		const addDJTitle = $i<HTMLInputElement>("addDJTitle");
		if(isOpen && savedTitle && addDJTitle) {
			const title = addDJTitle ? addDJTitle.value.trim() : "";
			if(!title) {
				addDJTitle.value = savedTitle;
			} else {
				addDJTitle.value = addDJTitle.value + " " + savedTitle;
			}
			setSavedTitle("");
		}
	}, [isOpen, savedTitle, setSavedTitle]);

	const maybeSaveNewDeclenjugation = useCallback(() => {
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
		const newDJ: Declenjugation = {
			id: uuidv4(),
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
			newDJ.regex = [regex1, regex2];
		} else {
			newDJ.prefix = prefix;
			newDJ.suffix = suffix;
		}
		setSavedDeclenjugation(newDJ);
		closeModal();
		toaster({
			message: tThingSaved,
			position: "middle",
			color: "success",
			duration: 2000,
			toast
		});
	}, [
		closeModal, doAlert, grabInfo, setSavedDeclenjugation, t, tNoMatch,
		tNoTitle, tOk, tThingSaved, toast, useAdvancedMethod, useWholeWord
	]);
	const maybeCancel = useCallback(() => {
		const {
			title,
			prefix,
			suffix,
			regex1,
			regex2
		} = grabInfo();
		if(
			title ||
			(useAdvancedMethod ?
				(regex1 || regex2)
			:
				(prefix || suffix)
			)
		) {
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
	}, [closeModal, doAlert, grabInfo, tUnsaved, tYes, tYouSure, useAdvancedMethod]);
	const openCase = useCallback(() => caseMakerModalInfo.setIsOpen(true), [caseMakerModalInfo]);
	const toggleUseWholeWord = useCallback(() => setUseWholeWord(!useWholeWord), [useWholeWord]);
	const toggleUseAdvanced = useCallback(() => setUseAdvancedMethod(!useAdvancedMethod), [useAdvancedMethod]);
	return (
		<IonModal isOpen={isOpen} backdropDismiss={false} onIonModalDidPresent={onLoad}>
			<ModalHeader title={tAddThing} closeModal={maybeCancel} openECM={openECM} />
			<IonContent>
				<IonList lines="full" id="addingCustomDeclenjugatorList" className="hasSpecialLabels hasToggles">
					<IonItem className="labelled">
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tTitleMethod}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tTitleMethod}
							id="addDJTitle"
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
							<h2>{tUseWord}</h2>
							<p>{tBaseNotStem}</p>
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
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tpMEx}</IonLabel>
					</IonItem>
					<IonItem className={`"wrappableInnards toggleable${useAdvancedMethod ? "" : " toggled"}`}>
						<IonInput
							id="addDJRegex1"
							aria-label={tMEx}
						/>
					</IonItem>
					<IonItem className={`"labelled toggleable${useAdvancedMethod ? "" : " toggled"}`}>
						<IonLabel className="ion-text-wrap ion-padding-bottom">{tpREx}</IonLabel>
					</IonItem>
					<IonItem className={`"wrappableInnards toggleable${useAdvancedMethod ? "" : " toggled"}`}>
						<IonInput
							id="addDJRegex2"
							aria-label={tREx}
						/>
					</IonItem>
					<IonItem className={`"labelled toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<div slot="start">{tPref}</div>
						<div slot="end">{tSuff}</div>
					</IonItem>
					<IonItem className={`"wrappableInnards prefixSuffix toggleable${useAdvancedMethod ? " toggled" : ""}`}>
						<IonInput
							id="addDJPrefix"
							aria-label={tPref}
							className="ion-text-end"
						/>
						<div className="ion-text-center stem pad-horizontal-rem">
							<strong>{useWholeWord ? tWord : tStem}</strong>
						</div>
						<IonInput
							id="addDJSuffix"
							aria-label={tSuff}
							className="ion-text-start"
						/>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter className="modalBorderTop">
				<IonToolbar>
					<IonButton
						color="warning"
						slot="start"
						onClick={maybeCancel}
					>
						<IonIcon icon={closeCircleOutline} slot="end" />
						<IonLabel>{tCancel}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={maybeSaveNewDeclenjugation}
					>
						<IonIcon icon={saveOutline} slot="end" />
						<IonLabel>{tSave}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default AddDeclenjugation;
