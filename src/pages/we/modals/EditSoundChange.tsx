import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonLabel,
	IonList,
	IonInput,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import { WESoundChangeObject, StateObject, SetState, ModalProperties } from '../../../store/types';
import { deleteSoundChangeWE, editSoundChangeWE } from '../../../store/weSlice';
import useTranslator from '../../../store/translationHooks';

import repairRegexErrors from '../../../components/RepairRegex';
import ltr from '../../../components/LTR';
import yesNoAlert from '../../../components/yesNoAlert';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

interface ModalProps extends ModalProperties {
	editing: null | WESoundChangeObject
	setEditing: SetState<null | WESoundChangeObject>
}

const translations = [
	"soundChangeDesc", "soundChangesTo",
	"whereChangeDoesntHappen", "whereChangeHappens",
	"soundToChange",
	"EditSoundChange",
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
		tEditThing, tThingDel, tThingSaved
	] = useI18Memo(translations, "we");
	const [ tfRepl, tfSrch ] = useI18Memo(wgweExp, "wgwe", formal);
	const [ tpRepl, tpSrch ] = useI18Memo(wgweExp, "wgwe", presentation);
	const [ tfCEx, tfEEx ] = useI18Memo(weExp, "we", formal);
	const [ tpCEx, tpEEx, tpSCD ] = useI18Memo(weExp, "we", presentation);
	const tNoSearch = useMemo(() => tw("noSearchMsg"), [tw])

	const { isOpen, setIsOpen, editing, setEditing } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const { disableConfirms } = useSelector((state: StateObject) => state.appSettings);

	const [editSeekExWESC, editSeekExWESCRef] = useElement<HTMLIonInputElement>();
	const [editReplaceExWESC, editReplaceExWESCRef] = useElement<HTMLIonInputElement>();
	const [editContextExWESC, editContextExWESCRef] = useElement<HTMLIonInputElement>();
	const [editAnticontextExWESC, editAnticontextExWESCRef] = useElement<HTMLIonInputElement>();
	const [editOptDescWESC, editOptDescWESCRef] = useElement<HTMLIonInputElement>();
	const [seekLabel, seekLabelRef] = useElement<HTMLIonLabelElement>();
	const [contextLabel, contextLabelRef] = useElement<HTMLIonLabelElement>();
	const [anticontextLabel, anticontextLabelRef] = useElement<HTMLIonLabelElement>();
	const onLoad = useCallback(() => {
		if(editing) {
			const { seek, replace, context, anticontext, description } = editing;
			getSetValue(editSeekExWESC, seek);
			getSetValue(editReplaceExWESC, replace);
			getSetValue(editContextExWESC, context);
			getSetValue(editAnticontextExWESC, anticontext);
			getSetValue(editOptDescWESC, description);
		} else {
			getSetValue(editSeekExWESC, "");
			getSetValue(editReplaceExWESC, "");
			getSetValue(editContextExWESC, "");
			getSetValue(editAnticontextExWESC, "");
			getSetValue(editOptDescWESC, "");
		}
	}, [
		editing, editSeekExWESC, editReplaceExWESC,
		editContextExWESC, editAnticontextExWESC,
		editOptDescWESC
	]);

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
		const seek = getSetValue(editSeekExWESC);
		const context = getSetValue(editContextExWESC) || "_";
		const anti = getSetValue(editAnticontextExWESC);
		let temp: boolean | string;
		if(seek === "") {
			seekLabel && seekLabel.classList.add("invalidValue");
			err.push(tNoSearch);
		}
		if((temp = contextTest(context, "Context"))) {
			contextLabel && contextLabel.classList.add("invalidValue");
			err.push(temp);
		}
		if(anti && (temp = contextTest(anti, "Exception"))) {
			anticontextLabel && anticontextLabel.classList.add("invalidValue");
			err.push(temp);
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
		const replace = getSetValue(editReplaceExWESC);
		const description = getSetValue(editOptDescWESC);
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
	}, [
		editAnticontextExWESC, editOptDescWESC, dispatch,
		doAlert, editing, editReplaceExWESC, editContextExWESC,
		setIsOpen, toast, t, tCancel, tError, tNoSearch,
		tThingSaved, anticontextLabel, contextLabel,
		editSeekExWESC, seekLabel
	]);
	const maybeDeleteSoundChange = useCallback(() => {
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
		<Modal
			isOpen={isOpen}
			title={tEditThing}
			closeFunc={cancelEditing}
			onIonModalDidPresent={onLoad}
			bottomStart={[{button: "delete", action: maybeDeleteSoundChange}]}
			bottomEnd={[{button: "save", action: maybeSaveNewSoundChangeInfo}]}
			extraChars
		>
			<IonList lines="none" className="hasSpecialLabels">
				<IonItem className="labelled">
					<IonLabel className="seekLabel" ref={seekLabelRef}>{tpSrch}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tfSrch}
						id="editSeekExWESC"
						ref={editSeekExWESCRef}
						className="ion-margin-top serifChars"
						helperText={tSearch}
						onIonChange={() => seekLabel && seekLabel.classList.remove("invalidValue")}
					></IonInput>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="replaceLabel">{tpRepl}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tfRepl}
						id="editReplaceExWESC"
						ref={editReplaceExWESCRef}
						helperText={tReplace}
						className="ion-margin-top serifChars"
					></IonInput>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="contextLabel" ref={contextLabelRef}>{tpCEx}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tfCEx}
						id="editContextExWESC"
						ref={editContextExWESCRef}
						className="ion-margin-top serifChars"
						helperText={tContext}
						onIonChange={() => contextLabel && contextLabel.classList.remove("invalidValue")}
					></IonInput>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="anticontextLabel" ref={anticontextLabelRef}>{tpEEx}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tfEEx}
						id="editAnticontextExWESC"
						ref={editAnticontextExWESCRef}
						className="ion-margin-top serifChars"
						helperText={tException}
						onIonChange={() => anticontextLabel && anticontextLabel.classList.remove("invalidValue")}
					></IonInput>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel>{tpSCD}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tSCDesc}
						id="editOptDescWESC"
						ref={editOptDescWESCRef}
						className="ion-margin-top"
						placeholder={tOptional}
					></IonInput>
				</IonItem>
			</IonList>
		</Modal>
	);
};

export default EditSoundChangeModal;
