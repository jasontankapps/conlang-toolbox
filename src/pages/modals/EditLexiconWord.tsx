import React, { FC, useCallback, useState } from 'react';
import {
	IonItem,
	IonLabel,
	IonList,
	IonInput,
	useIonAlert,
	useIonToast
} from '@ionic/react';
import { useSelector, useDispatch } from "react-redux";

import { deleteLexiconItem, doEditLexiconItem } from '../../store/lexiconSlice';
import { Lexicon, LexiconColumn, ModalProperties, SorterFunc, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import useI18Memo from '../../components/useI18Memo';
import useElement, { useElementList } from '../../components/useElement';
import getSetValue from '../../components/getSetValue';
import Modal from '../../components/Modal';

interface LexItemProps extends ModalProperties {
	itemToEdit: Lexicon | null
	columnInfo: LexiconColumn[]
	sorter: SorterFunc
}

function garble () {
	const e = Math.floor(Math.random() * 10) + 15;
	let output = "";
	for (let x = 0; x < e; x++) {
		output += "qwrtpsdfghjklzxcvbnm!"[Math.floor(Math.random() * 20)];
	}
	return output;
};
const nonsense = garble();

const translations = [
	"ExitWOSave",
	"exitWithoutSavingMsg",
	"noInfoProvided", "EditLexiconItem",
	"DeleteItem", "SaveItem", "ItemDeleted",
	"ItemSaved"
];

const commons = [
	"deleteThisCannotUndo", "Close",
	"error", "Ok", "areYouSure"
];

interface ColumnInputProps {
	col: LexiconColumn
	index: number
	value: string
	getElement: (col: HTMLIonInputElement | null) => void
}

const ColumnInput: FC<ColumnInputProps> = ({col, value, index, getElement}) => {
	const {id, label} = col;
	const [, inputRef] = useElement<HTMLIonInputElement>(getElement);
	return (
		<React.Fragment>
			<IonItem className="labelled">
				<IonLabel>{label}</IonLabel>
			</IonItem>
			<IonItem>
				<IonInput
					aria-label={`${label} input`}
					id={`edit_lex_input_${id}_${index}`}
					className="ion-margin-top serifChars"
					value={value}
					ref={inputRef}
				></IonInput>
			</IonItem>
		</React.Fragment>
	);
};


const EditLexiconItemModal: FC<LexItemProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tExit, tUnsavedChanges, tNoInfo, tEditLexicon,
		tDelThing, tSaveThing, tThingDel, tThingSaved
	] = useI18Memo(translations, "lexicon");
	const [ tYouSure, tClose, tError, tOk, tRUSure ] = useI18Memo(commons);

	const { isOpen, setIsOpen, itemToEdit, columnInfo, sorter } = props;
	const dispatch = useDispatch();
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const [ id, setId ] = useState<string>("");
	const [ cols, setCols ] = useState<string[]>([]);
	const [ originalString, setOriginalString ] = useState<string>("");
	const [doAlert] = useIonAlert();
	const toast = useIonToast();
	const columnInfoNumbered: [LexiconColumn, number][] = columnInfo.map((col, i) => [col, i]);
	const getId = (duo: [LexiconColumn, number]) => `${duo[0].id}, ${duo[1]}`;
	const [inputElements, updater]
		= useElementList<[LexiconColumn, number], HTMLIonInputElement | null>(
			columnInfoNumbered,
			getId
		);
	const onLoad = () => {
		const id = (itemToEdit ? itemToEdit.id : "");
		const cols = (itemToEdit ? [...itemToEdit.columns] : []);
		cols.forEach((col: string, i: number) => {
			const id = getId(columnInfoNumbered[i]);
			getSetValue(inputElements.current[id], col);
		});
		setOriginalString(cols.join(nonsense));
		setId(id);
		setCols(cols);
	};
	const currentInfo = () => {
		return columnInfoNumbered.map((duo) => {
			return getSetValue(inputElements.current[getId(duo)]);
		});
	};
	const cancelEditing = () => {
		// If we're "open" and being closed by some other means, check and see if
		//   1) we have disabled confirms
		//   2) we haven't changed anything
		// and exit silently if both are true
		if(disableConfirms || currentInfo().join(nonsense) === originalString) {
			setIsOpen(false);
			return;
		}
		// Otherwise, doublecheck
		yesNoAlert({
			header: tExit,
			cssClass: "warning",
			message: tUnsavedChanges,
			submit: tClose,
			handler: () => setIsOpen(false),
			doAlert
		});
	};
	const maybeSaveNewInfo = () => {
		const cols = currentInfo();
		if(cols.join("") === "") {
			doAlert({
				header: tError,
				message: tNoInfo,
				cssClass: "danger",
				buttons: [
					{
						text: tOk,
						role: "cancel",
						cssClass: "cancel"
					}
				]
			});
			return;
		}
		// Everything ok!
		setIsOpen(false);
		dispatch(doEditLexiconItem([{id, columns: cols}, sorter]));
		toaster({
			message: tThingSaved,
			color: "success",
			duration: 2500,
			toast,
			position: "middle"
		})
	};
	const delFromLex = useCallback(() => {
		const handler = () => {
			setIsOpen(false);
			dispatch(deleteLexiconItem(id));
			toaster({
				message: tThingDel,
				duration: 2500,
				color: "danger",
				toast,
			position: "middle"
			})
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: tRUSure,
				cssClass: "danger",
				message: tYouSure,
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [disableConfirms, dispatch, doAlert, id, setIsOpen, tc, tRUSure, tThingDel, tYouSure, toast]);
	return (
		<Modal
			isOpen={isOpen}
			title={tEditLexicon}
			closeFunc={cancelEditing}
			enclosed
			onIonModalDidPresent={onLoad}
			bottomStart={[{key: tDelThing, isText: true, icon: "delete", action: delFromLex}]}
			bottomEnd={[{key: tSaveThing, isText: true, icon: "save", action: maybeSaveNewInfo}]}
			contentClass="hasSpecialLabels"
			extraChars
		>
			<IonList lines="none">
				{columnInfoNumbered.map(duo => {
					const [col, i] = duo;
					const getElement = (node: HTMLIonInputElement | null) => updater(duo, node);
					return <ColumnInput key={`edit_lex_input_${id}_${i}`} col={col} index={i} value={cols[i]} getElement={getElement} />
				})}
			</IonList>
		</Modal>
	);
};

export default EditLexiconItemModal;
