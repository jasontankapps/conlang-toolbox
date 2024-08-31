import React, { useCallback, useMemo, FC } from 'react';
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
import { addOutline } from 'ionicons/icons';
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import { addSoundChangeWE } from '../../../store/weSlice';
import { ExtraCharactersModalOpener } from '../../../store/types';
import useTranslator from '../../../store/translationHooks';

import { $q, $a, $i } from '../../../components/DollarSignExports';
import repairRegexErrors from '../../../components/RepairRegex';
import toaster from '../../../components/toaster';
import useI18Memo from '../../../components/useI18Memo';
import ModalHeader from '../../../components/ModalHeader';

function resetError(prop: string) {
	// Remove danger color if present
	// Debounce means this sometimes doesn't exist by the time this is called.
	const where = $q("." + prop + "Label");
	where && where.classList.remove("invalidValue");
}
const resetSeek = () => resetError("seek");
const resetContext = () => resetError("context");
const resetException = () => resetError("anticontext");

const wgweExp = [ "replacementExpression", "searchExpression" ];
const weExp = [ "contextExpression", "exceptionExpression", "soundChangeDesc" ];
const formal = { context: "formal" };
const presentation = { context: "presentation" };

const translations = [
	"soundChangeDesc", "soundChangesTo",
	"soundToChange", "whereChangeDoesntHappen",
	"whereChangeHappens", "AddSoundChange", "SoundChangeAdded"
];

const commons = [ "AddAndClose", "Cancel", "error", "optional" ];

const AddSoundChangeModal: FC<ExtraCharactersModalOpener> = (props) => {
	const [ t ] = useTranslator('we');
	const [ tw ] = useTranslator('wgwe');
	const [ tAddClose, tCancel, tError, tOptional ] = useI18Memo(commons);
	const [ tSCDesc, tReplace, tSearch, tException, tContext, tAddThing, tThingSaved ] = useI18Memo(translations, "we");
	const [ tfRepl, tfSrch ] = useI18Memo(wgweExp, "wgwe", formal);
	const [ tpRepl, tpSrch ] = useI18Memo(wgweExp, "wgwe", presentation);
	const [ tfCEx, tfEEx ] = useI18Memo(weExp, "we", formal);
	const [ tpCEx, tpEEx, tpSCD ] = useI18Memo(weExp, "we", presentation);
	const tNoSearch = useMemo(() => tw("noSearchMsg"), [tw])

	const { isOpen, setIsOpen, openECM } = props;
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
		const seekEl = $i<HTMLInputElement>("searchExWESC");
		const seek = seekEl ? seekEl.value : "";
		const contextEl = $i<HTMLInputElement>("contextExWESC");
		const context = contextEl ? contextEl.value : "_";
		const anticontextEl = $i<HTMLInputElement>("antiExWESC");
		const anticontext = anticontextEl ? anticontextEl.value : "";
		if(seek === "") {
			const el = $q(".seekLabel");
			el && el.classList.add("invalidValue");
			err.push(tNoSearch);
		}
		if((temp = contextTest(context, "Context"))) {
			const el = $q(".contextLabel");
			el && el.classList.add("invalidValue");
			err.push(temp);
		}
		if(anticontext && (temp = contextTest(anticontext, "Exception"))) {
			const el = $q(".anticontextLabel");
			el && el.classList.add("invalidValue");
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
		const replaceEl = $i<HTMLInputElement>("replaceExWESC");
		const descEl = $i<HTMLInputElement>("optDescWESC");
		const replace = repairRegexErrors(replaceEl ? replaceEl.value : "");
		const description = descEl ? descEl.value.trim() : "";
		close && setIsOpen(false);
		dispatch(addSoundChangeWE({
			id: uuidv4(),
			seek: repairRegexErrors(seek),
			replace,
			context: repairRegexErrors(context),
			anticontext: repairRegexErrors(anticontext),
			description
		}));
		$a<HTMLInputElement>("ion-list.addSoundChangeWE ion-input").forEach(
			(input) => input.value = ""
		);
		toaster({
			message: tThingSaved,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [dispatch, doAlert, setIsOpen, t, tCancel, tError, tNoSearch, tThingSaved, toast]);

	const closer = useCallback(() => setIsOpen(false), [setIsOpen]);
	const saveClose = useCallback(() => maybeSaveNewSoundChange(), [maybeSaveNewSoundChange]);
	const saveAdd = useCallback(() => maybeSaveNewSoundChange(false), [maybeSaveNewSoundChange]);

	return (
		<IonModal isOpen={isOpen} onDidDismiss={closer}>
			<ModalHeader title={tAddThing} openECM={openECM} closeModal={setIsOpen} />
			<IonContent>
				<IonList lines="none" className="hasSpecialLabels addSoundChangeWE">
					<IonItem className="labelled">
						<IonLabel className="seekLabel">{tpSrch}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tfSrch}
							id="searchExWESC"
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
							id="replaceExWESC"
							className="ion-margin-top serifChars"
							helperText={tReplace}
							placeholder="Changes into..."
						></IonInput>
					</IonItem>
					<IonItem className="labelled">
						<IonLabel className="contextLabel">{tpCEx}</IonLabel>
					</IonItem>
					<IonItem>
						<IonInput
							aria-label={tfCEx}
							id="contextExWESC"
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
							id="antiExWESC"
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
							id="optDescWESC"
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
						onClick={saveAdd}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAddThing}</IonLabel>
					</IonButton>
					<IonButton
						color="success"
						slot="end"
						onClick={saveClose}
					>
						<IonIcon icon={addOutline} slot="start" />
						<IonLabel>{tAddClose}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default AddSoundChangeModal;
