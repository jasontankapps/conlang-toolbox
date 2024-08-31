import React, { useCallback, useMemo, useState, FC } from 'react';
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
	useIonToast
} from '@ionic/react';
import {
	saveOutline,
	trashOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";

import { WESoundChangeObject, ExtraCharactersModalOpener, StateObject, SetState } from '../../../store/types';
import { deleteSoundChangeWE, editSoundChangeWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import repairRegexErrors from '../../../components/RepairRegex';
import { $i, $q } from '../../../components/DollarSignExports';
import ltr from '../../../components/LTR';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import ModalHeader from '../../../components/ModalHeader';
import useI18Memo from '../../../components/useI18Memo';

interface ModalProps extends ExtraCharactersModalOpener {
	editing: null | WESoundChangeObject
	setEditing: SetState<null | WESoundChangeObject>
}

function resetError(prop: string) {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q("." + prop + "Label");
	where && where.classList.remove("invalidValue");
}

const resetSeek = () => resetError("seek");
const resetContext = () => resetError("context");
const resetException = () => resetError("anticontext");

const translations = [
	"soundChangeDesc", "soundChangesTo",
	"whereChangeDoesntHappen", "whereChangeHappens",
	"soundToChange", "DeleteSoundChange",
	"EditSoundChange", "SaveSoundChange",
	"SoundChangeDeleted", "SoundChangeSaved"
]

const commons = [
	"deleteThisCannotUndo", "Cancel", "error", "optional"
];

const wgweExp = [ "replacementExpression", "searchExpression" ];
const weExp = [ "contextExpression", "exceptionExpression", "soundChangeDesc" ];
const formal = { context: "formal" };
const presentation = { context: "presentation" };

const EditSoundChangeModal: FC<ModalProps> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tc ] = useTranslator('common');
	const [ tw ] = useTranslator('wgwe');
	const [ tYouSure, tCancel, tError, tOptional ] = useI18Memo(commons);
	const [
		tSCDesc, tReplace, tException, tContext, tSearch,
		tDelThing, tEditThing, tSaveThing, tThingDel, tThingSaved
	] = useI18Memo(translations, "we");
	const [ tfRepl, tfSrch ] = useI18Memo(wgweExp, "wgwe", formal);
	const [ tpRepl, tpSrch ] = useI18Memo(wgweExp, "wgwe", presentation);
	const [ tfCEx, tfEEx ] = useI18Memo(weExp, "we", formal);
	const [ tpCEx, tpEEx, tpSCD ] = useI18Memo(weExp, "we", presentation);
	const tNoSearch = useMemo(() => tw("noSearchMsg"), [tw])

	const { isOpen, setIsOpen, openECM, editing, setEditing } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);

	const [seekEl, setSeekEl] = useState<HTMLInputElement | null>(null);
	const [replaceEl, setReplaceEl] = useState<HTMLInputElement | null>(null);
	const [contextEl, setContextEl] = useState<HTMLInputElement | null>(null);
	const [antiEl, setAntiEl] = useState<HTMLInputElement | null>(null);
	const [descEl, setDescEl] = useState<HTMLInputElement | null>(null);
	const onLoad = useCallback(() => {
		const _seekEl = $i<HTMLInputElement>("editSeekExWESC");
		const _replaceEl = $i<HTMLInputElement>("editReplaceExWESC");
		const _contextEl = $i<HTMLInputElement>("editContextExWESC");
		const _antiEl = $i<HTMLInputElement>("editAnticontextExWESC");
		const _descEl = $i<HTMLInputElement>("editOptDescWESC");
		if(editing) {
			const { seek, replace, context, anticontext, description } = editing;
			_seekEl && (_seekEl.value = seek);
			_replaceEl && (_replaceEl.value = replace);
			_contextEl && (_contextEl.value = context);
			_antiEl && (_antiEl.value = anticontext);
			_descEl && (_descEl.value = description);
		} else {
			_seekEl && (_seekEl.value = "");
			_replaceEl && (_replaceEl.value = "");
			_contextEl && (_contextEl.value = "");
			_antiEl && (_antiEl.value = "");
			_descEl && (_descEl.value = "");
		}
		setSeekEl(_seekEl);
		setReplaceEl(_replaceEl);
		setContextEl(_contextEl);
		setAntiEl(_antiEl);
		setDescEl(_descEl);
	}, [editing]);

	const cancelEditing = useCallback(() => {
		setEditing(null);
		setIsOpen(false);
	}, [setIsOpen, setEditing]);
	const maybeSaveNewSoundChangeInfo = useCallback(() => {
		const err: string[] = [];
		const contextTest = (context: string, element: string) => {
			let ind = context.indexOf("_");
			const what = t(element);
			if(ind === -1) {
				return t("noUnderscore", { what });
			} else if (context.indexOf("_", ind+1) !== -1) {
				return t("multiUnderscore", { what });
			}
			const max = context.length - 1;
			ind = context.indexOf("#");
			while(ind !== -1) {
				if(ind > 0 && ind !== max) {
					return t("wordBoundaryError", { what });
				}
				ind = context.indexOf("#", (ind + 1));
			}
			return false;
		};
		// Test info for validness, then save if needed and reset the editingSoundChange
		const seek = (seekEl && seekEl.value) || "";
		const context = (contextEl && contextEl.value) || "_";
		const anti = (antiEl && antiEl.value) || "";
		let temp: boolean | string;
		if(seek === "") {
			const el = $q(".seekLabel");
			el && el.classList.add("invalidValue");
			err.push(tNoSearch);
		}
		if((temp = contextTest(context, "Context"))) {
			err.push(temp);
			const el = $q(".contextLabel");
			el && el.classList.add("invalidValue");
		}
		if(anti && (temp = contextTest(anti, "Exception"))) {
			err.push(temp);
			const el = $q(".anticontextLabel");
			el && el.classList.add("invalidValue");
		}
		try {
			new RegExp(seek);
		} catch(e) {
			err.push(`${e}`);
		}
		if(err.length > 0) {
			// Errors found.
			doAlert({
				header: tError,
				cssClass: "danger",
				message: err.join("; "),
				buttons: [
					{
						text: tCancel,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
			return;
		}
		// Everything ok!
		const replace = (replaceEl && replaceEl.value) || "";
		const description = (descEl && descEl.value) || "";
		setIsOpen(false);
		dispatch(editSoundChangeWE({
			id: editing!.id,
			seek: repairRegexErrors(seek),
			replace,
			context: repairRegexErrors(context),
			anticontext: repairRegexErrors(anti),
			description
		}));
		toaster({
			message: tThingSaved,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [antiEl, contextEl, descEl, dispatch, doAlert, editing, replaceEl, seekEl, setIsOpen, toast, t, tCancel, tError, tNoSearch, tThingSaved]);
	const maybeDeleteSoundChange = useCallback(() => {
		const groups = $q<HTMLIonListElement>((".soundChanges"));
		groups && groups.closeSlidingItems();
		const handler = () => {
			setIsOpen(false);
			dispatch(deleteSoundChangeWE(editing!.id));
			toaster({
				message: tThingDel,
				duration: 2500,
				color: "danger",
				position: "top",
				toast
			});
		};
		if(disableConfirms) {
			handler();
		} else {
			let soundChange =
				editing!.seek
				+ (ltr() ? "⟶" : "⟵")
				+ editing!.replace
				+ "/"
				+ editing!.context;
			if(editing!.anticontext) {
				soundChange += "/" + editing!.anticontext;
			}
			yesNoAlert({
				header: soundChange,
				message: tYouSure,
				cssClass: "danger",
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [disableConfirms, dispatch, doAlert, editing, setIsOpen, toast, tc, tThingDel, tYouSure]);

	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={cancelEditing}
			onIonModalDidPresent={onLoad}
		>
			<ModalHeader title={tEditThing} openECM={openECM} closeModal={cancelEditing} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels">
					<IonItem className="labelled">
						<IonLabel className="seekLabel">{tpSrch}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tfSrch}
							id="editSeekExWESC"
							className="ion-margin-top serifChars"
							helperText={tSearch}
							onIonChange={resetSeek}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="replaceLabel">{tpRepl}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tfRepl}
							id="editReplaceExWESC"
							helperText={tReplace}
							className="ion-margin-top serifChars"
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="contextLabel">{tpCEx}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tfCEx}
							id="editContextExWESC"
							className="ion-margin-top serifChars"
							helperText={tContext}
							onIonChange={resetContext}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="anticontextLabel">{tpEEx}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tfEEx}
							id="editAnticontextExWESC"
							className="ion-margin-top serifChars"
							helperText={tException}
							onIonChange={resetException}
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel>{tpSCD}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tSCDesc}
							id="editOptDescWESC"
							className="ion-margin-top"
							placeholder={tOptional}
						></IonInput>
					</IonItem>
				</IonList>
			</IonContent>
			<IonFooter>
				<IonToolbar>
					<IonButton
						color="primary"
						slot="end"
						onClick={maybeSaveNewSoundChangeInfo}
					>
						<IonIcon icon={saveOutline} slot="start" />
						<IonLabel>{tSaveThing}</IonLabel>
					</IonButton>
					<IonButton
						color="danger"
						slot="start"
						onClick={maybeDeleteSoundChange}
					>
						<IonIcon icon={trashOutline} slot="start" />
						<IonLabel>{tDelThing}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default EditSoundChangeModal;
