import React, { useCallback, useMemo, FC } from 'react';
import {
	IonItem,
	IonLabel,
	IonList,
	IonInput,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { addSoundChangeWE } from '../../../store/weSlice';
import { ModalProperties } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import repairRegexErrors from '../../../components/RepairRegex';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import useElement from '../../../components/useElement';
import getSetValue from '../../../components/getSetValue';
import Modal from '../../../components/Modal';

const wgweExp = [ "replacementExpression", "searchExpression" ];
const weExp = [ "contextExpression", "exceptionExpression", "soundChangeDesc" ];
const formal = { context: "formal" };
const presentation = { context: "presentation" };

const translations = [
	"soundChangeDesc", "soundChangesTo",
	"soundToChange", "whereChangeDoesntHappen",
	"whereChangeHappens", "AddSoundChange", "SoundChangeAdded"
];

const commons = [ "Cancel", "error", "optional" ];

const AddSoundChangeModal: FC<ModalProperties> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tw ] = useTranslator('wgwe');
	const [ tCancel, tError, tOptional ] = useI18Memo(commons);
	const [
		tSCDesc, tReplace, tSearch, tException,
		tContext, tAddThing, tThingSaved
	] = useI18Memo(translations, "we");
	const [ tfRepl, tfSrch ] = useI18Memo(wgweExp, "wgwe", formal);
	const [ tpRepl, tpSrch ] = useI18Memo(wgweExp, "wgwe", presentation);
	const [ tfCEx, tfEEx ] = useI18Memo(weExp, "we", formal);
	const [ tpCEx, tpEEx, tpSCD ] = useI18Memo(weExp, "we", presentation);
	const tNoSearch = useMemo(() => tw("noSearchMsg"), [tw])
	const [seekLabel, seekLabelRef] = useElement<HTMLIonLabelElement>();
	const [contextLabel, contextLabelRef] = useElement<HTMLIonLabelElement>();
	const [anticontextLabel, anticontextLabelRef] = useElement<HTMLIonLabelElement>();
	const [searchExWESC, searchExWESCRef] = useElement<HTMLIonInputElement>();
	const [contextExWESC, contextExWESCRef] = useElement<HTMLIonInputElement>();
	const [antiExWESC, antiExWESCRef] = useElement<HTMLIonInputElement>();
	const [replaceExWESC, replaceExWESCRef] = useElement<HTMLIonInputElement>();
	const [optDescWESC, optDescWESCRef] = useElement<HTMLIonInputElement>();

	const { isOpen, setIsOpen } = props;
	const dispatch = useDispatch();
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const maybeSaveNewSoundChange = useCallback((close: boolean = true) => {
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
		// Test info for validness, then save if needed and reset the newSoundChange
		let temp: boolean | string;
		const seek = getSetValue(searchExWESC);
		const context = getSetValue(contextExWESC) || "_";
		const anticontext = getSetValue(antiExWESC);
		if(seek === "") {
			seekLabel && seekLabel.classList.add("invalidValue");
			err.push(tNoSearch);
		}
		if((temp = contextTest(context, "Context"))) {
			contextLabel && contextLabel.classList.add("invalidValue");
			err.push(temp);
		}
		if(anticontext && (temp = contextTest(anticontext, "Exception"))) {
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
				message: err.join("; "),
				cssClass: "danger",
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
		// Fix any possible regex problems<HTMLInputElement>
		const replace = repairRegexErrors(getSetValue(replaceExWESC));
		const description = getSetValue(optDescWESC).trim();
		if(close) { setIsOpen(false); }
		dispatch(addSoundChangeWE({
			id: uuidv4(),
			seek: repairRegexErrors(seek),
			replace,
			context: repairRegexErrors(context),
			anticontext: repairRegexErrors(anticontext),
			description
		}));
		getSetValue(searchExWESC, "");
		getSetValue(contextExWESC, "");
		getSetValue(antiExWESC, "");
		getSetValue(replaceExWESC, "");
		getSetValue(optDescWESC, "");
		toaster({
			message: tThingSaved,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [
		dispatch, doAlert, setIsOpen, t, tCancel,
		tError, tNoSearch, tThingSaved, toast,
		seekLabel, contextLabel, anticontextLabel,
		searchExWESC, contextExWESC, antiExWESC,
		replaceExWESC, optDescWESC
	]);

	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const saveClose = useCallback(() => maybeSaveNewSoundChange(), [maybeSaveNewSoundChange]);
	const saveAdd = useCallback(() => maybeSaveNewSoundChange(false), [maybeSaveNewSoundChange]);

	return (
		<Modal
			isOpen={isOpen}
			closeFunc={closer}
			title={tAddThing}
			extraChars
			bottomEnd={[
				{ button: "add", action: saveAdd, color: "secondary" },
				{ button: "add+close", action: saveClose }
			]}
		>
			<IonList lines="none" className="hasSpecialLabels addSoundChangeWE">
				<IonItem className="labelled">
					<IonLabel className="seekLabel" ref={seekLabelRef}>{tpSrch}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tfSrch}
						id="searchExWESC"
						ref={searchExWESCRef}
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
						id="replaceExWESC"
						ref={replaceExWESCRef}
						className="ion-margin-top serifChars"
						helperText={tReplace}
						placeholder="Changes into..."
					></IonInput>
				</IonItem>
				<IonItem className="labelled">
					<IonLabel className="contextLabel" ref={contextLabelRef}>{tpCEx}</IonLabel>
				</IonItem>
				<IonItem>
					<IonInput
						aria-label={tfCEx}
						id="contextExWESC"
						ref={contextExWESCRef}
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
						id="antiExWESC"
						ref={antiExWESCRef}
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
						id="optDescWESC"
						ref={optDescWESCRef}
						className="ion-margin-top"
						placeholder={tOptional}
					></IonInput>
				</IonItem>
			</IonList>
		</Modal>
	);
};

export default AddSoundChangeModal;
