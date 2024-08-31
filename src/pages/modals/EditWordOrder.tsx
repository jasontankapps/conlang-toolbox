import React, { FC, useCallback, useMemo, useState } from 'react';
import {
	IonItem,
	IonIcon,
	IonLabel,
	IonList,
	IonContent,
	IonHeader,
	IonToolbar,
	IonButtons,
	IonButton,
	IonTitle,
	IonModal,
	IonInput,
	IonFooter,
	IonRow,
	IonCol,
	IonGrid,
	IonReorderGroup,
	IonReorder,
	IonCheckbox,
	IonItemDivider,
	IonToggle,
	IonSelect,
	IonSelectOption,
	useIonAlert,
	useIonToast,
	SelectCustomEvent
} from '@ionic/react';
import {
	closeCircleOutline,
	saveOutline,
	reorderTwo,
	trashOutline,
	addCircleOutline,
	globeOutline
} from 'ionicons/icons';
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

import {
	ExtraCharactersModalOpener,
	Lexicon,
	LexiconBlankSorts,
	LexiconColumn,
	SortLanguage,
	SortObject,
	SortSensitivity,
	StateObject
} from '../../store/types';
import { updateLexiconColumarInfo } from '../../store/lexiconSlice';
import useTranslator from '../../store/translationHooks';

import yesNoAlert from '../../components/yesNoAlert';
import toaster from '../../components/toaster';
import { $i } from '../../components/DollarSignExports';
import PermanentInfo from '../../components/PermanentInfo';
import makeSorter from '../../components/stringSorter';
import useI18Memo from '../../components/useI18Memo';

interface ShadowColumn extends LexiconColumn {
	originalPosition: number
}

interface OrderModalProps extends ExtraCharactersModalOpener {
	sortLang: SortLanguage
	sensitivity: SortSensitivity
}

const translations = [
	"deleteColumnMsg",
	"optionAlphaFirst", "optionAlphaLast", "FieldName", "Large",
	"LexOptions", "Med", "New", "RearrangeColumns", "Small",
	"ShowTitles", "optionToBeginning", "optionToEnd",
	"EditCols", "SortBlanks", "cannotDeleteFinalColumnMsg",
	"SaveChanges", "ColumnAdded", "AddColumn"
];

const commons = [
	"Close", "defaultSort", "Delete", "ExtraChars",
	"NothingToSave", "emphasizedError", "SortMethod"
];

const EditLexiconOrderModal: FC<OrderModalProps> = (props) => {
	const [ tc ] = useTranslator('common');
	const [
		tClose, tDefSort, tDelete, tExChar,
		tNothing, tEmphError, tpMethod
	] = useI18Memo(commons);
	const [
		tYouSure, tAlphaFirst, tAlphaLast, tFieldName, tLarge, tLexOpts,
		tMed, tNew, tRearr, tSmall, tShowTitle, tToBeg, tToEnd, tEditGeneral,
		tpBlank, tCannotDelete, tSaveThings, tThingAdded, tAddThing
	] = useI18Memo(translations, "lexicon");

	const { isOpen, setIsOpen, openECM, sortLang, sensitivity } = props;
	const dispatch = useDispatch();
	const disableConfirms = useSelector((state: StateObject) => state.appSettings.disableConfirms);
	const {
		lexicon,
		columns,
		sortPattern,
		truncateColumns,
		blankSort,
		customSort,
		/*fontType*/
	} = useSelector((state: StateObject) => state.lexicon);
	const { customSorts } = useSelector((state: StateObject) => state.sortSettings);
	const [shadowTruncate, setShadowTruncate] = useState<boolean>(truncateColumns);
	const [shadowBlankSort, setShadowBlankSort] = useState<LexiconBlankSorts>(blankSort);
	const [shadowColumns, setShadowColumns] = useState<ShadowColumn[]>([]);
	const [shadowCustomSort, setShadowCustomSort] = useState<string | null>(customSort || null);
	const [doAlert] = useIonAlert();
	const toast = useIonToast();

	const closeModal = useCallback(() => {
		setShadowColumns(columns.slice().map(
			(col: LexiconColumn, i: number) => ({...col, originalPosition: i})
		));
		setIsOpen(false);
	}, [columns, setIsOpen]);
	const onLoad = useCallback(() => {
		setShadowColumns(columns.slice().map(
			(col: LexiconColumn, i: number) => ({...col, originalPosition: i})
		));
		setShadowCustomSort(customSort || null);
	}, [columns, customSort]);
	const handleCheckboxes = useCallback((i: number, value: "s" | "m" | "l") => {
		const newCols = shadowColumns.slice();
		newCols[i].size = value;
		// save any changes to labels that may have been entered
		newCols.forEach((col, i: number) => {
			const el = $i<HTMLInputElement>(`input_colOrder_${col.id}`);
			if(el) {
				newCols[i].label = el.value || "";
			}
		});
		// save result
		setShadowColumns(newCols);
	}, [shadowColumns]);
	const doneEditingOrder = useCallback(() => {
		const original = columns.map((col: LexiconColumn, i: number) => {
			const {label, size} = col;
			return `${label}/${size}/${i}`;
		}).join(" : ") + ` : ${truncateColumns} : ${blankSort} : ${customSort}`;
		const testing = shadowColumns.map((col: ShadowColumn) => {
			const {id, size, originalPosition} = col;
			const el = $i<HTMLInputElement>(`input_colOrder_${id}`);
			return `${el ? el.value : tEmphError}/${size}/${originalPosition}`;
		}).join(" : ") + ` : ${shadowTruncate} : ${shadowBlankSort} : ${shadowCustomSort}`;
		if(testing === original) {
			toaster({
				message: tNothing,
				color: "warning",
				duration: 2500,
				position: "top",
				toast
			});
			closeModal();
			return;
		}
		// convert columns and create a guide
		const guide: number[] = [];
		const newColumns: LexiconColumn[] = shadowColumns.map((col: ShadowColumn) => {
			const {id, size, originalPosition} = col;
			guide.push(originalPosition);
			const el = $i<HTMLInputElement>(`input_colOrder_${id}`);
			return {
				id,
				label: el ? el.value : tEmphError,
				size
			};
		});
		// convert lexicon
		const lex: Lexicon[] = lexicon.map((item: Lexicon) => {
			const { id, columns } = item;
			// use the guide to rearrange columns
			const newCols: string[] = guide.map((i: number) => {
				if(i < 0) {
					// if the given column doesn't exist, make a blank column
					return "";
				}
				// otherwise, grab the appropriate colum
				return columns[i];
			});
			// return a new Lexicon object
			return {
				id,
				columns: newCols
			};
		});
		// convert sortPattern
		// make an array of IDs
		const sortPatternByIds = sortPattern.map((n: number) => columns[n].id);
		// make an array of all positions
		let missingColumns: number[] = [];
		for(let x = 0; x < shadowColumns.length; x++) {
			missingColumns.push(x);
		}
		// begin the sort pattern with the columns that still exist
		const newSortPattern: number[] = [];
		sortPatternByIds.forEach((id: string) => {
			shadowColumns.every((col: ShadowColumn, i: number) => {
				if(id === col.id) {
					newSortPattern.push(i);
					// remove this pattern from the array of all positions
					missingColumns = missingColumns.filter(n => n !== i);
					return false;
				}
				return true;
			});
		});
		// finish by tacking on the positions that were not found
		newSortPattern.push(...missingColumns);
		// Make new sorter
		let newSortObj: SortObject | undefined = undefined;
		if(shadowCustomSort) {
			customSorts.every(obj => {
				if(obj.id === shadowCustomSort) {
					newSortObj = obj;
					return false;
				}
				return true;
			});
		}
		const sorter = makeSorter(sortLang, sensitivity, newSortObj);
		// dispatch
		dispatch(updateLexiconColumarInfo([
			lex,
			newColumns,
			newSortPattern,
			shadowTruncate,
			shadowBlankSort,
			shadowCustomSort || undefined,
			sorter
		]));
		toaster({
			message: "Saved!",
			duration: 2500,
			color: "success",
			position: "middle",
			toast
		});
		closeModal();
	}, [
		blankSort, closeModal, columns, customSort, customSorts, dispatch,
		lexicon, sensitivity, shadowBlankSort, shadowColumns, shadowCustomSort,
		shadowTruncate, sortLang, sortPattern, tEmphError, tNothing, toast,
		truncateColumns
	]);
	const addNewColumn = useCallback(() => {
		const final: ShadowColumn[] = [
			...shadowColumns,
			{ id: uuidv4(), size: "m", label: tNew, originalPosition: -1 }
		];
		// save any changes to labels that may have been entered
		final.forEach((col, i: number) => {
			const el = $i<HTMLInputElement>(`input_colOrder_${col.id}`);
			if(el) {
				final[i].label = el.value || "";
			}
		});
		// save result
		setShadowColumns(final);
		toaster({
			message: tThingAdded,
			duration: 2500,
			color: "success",
			position: "top",
			toast
		});
	}, [shadowColumns, tNew, toast, tThingAdded]);
	const deleteField = useCallback((i: number) => {
		if(shadowColumns.length === 1) {
			return toaster({
				message: tCannotDelete,
				duration: 5000,
				color: "danger",
				position: "middle",
				toast
			});	
		}
		const handler = () => {
			// delete the field
			const newColumns = shadowColumns.slice(0, i).concat(shadowColumns.slice(i+1));
			// save any changes to labels that may have been entered
			newColumns.forEach((col, i: number) => {
				const el = $i<HTMLInputElement>(`input_colOrder_${col.id}`);
				if(el) {
					newColumns[i].label = el.value || "";
				}
			});
			// save result
			setShadowColumns(newColumns);
		};
		if(disableConfirms) {
			handler();
		} else {
			yesNoAlert({
				header: shadowColumns[i].label,
				cssClass: "danger",
				message: tYouSure,
				submit: tc("confirmDel", { count: 1 }),
				handler,
				doAlert
			});
		}
	}, [disableConfirms, doAlert, shadowColumns, tc, tYouSure, tCannotDelete, toast]);
	const doReorder = useCallback((event: CustomEvent) => {
		const ed = event.detail;
		// move things around
		const { from, to } = ed;
		const moved = shadowColumns[from];
		const remains = shadowColumns.slice(0, from).concat(shadowColumns.slice(from + 1));
		const final = remains.slice(0, to).concat(moved, remains.slice(to));
		// save any changes to labels that may have been entered
		final.forEach((col, i: number) => {
			const el = $i<HTMLInputElement>(`input_colOrder_${col.id}`);
			if(el) {
				final[i].label = el.value || "";
			}
		});
		// save result
		setShadowColumns(final);
		ed.complete();
	}, [shadowColumns]);

	const reorderColumns = useMemo(() => shadowColumns.map((column: LexiconColumn, i: number) => {
		const { id, size, label } = column;
		return (
			<IonItem lines="full" key={`${id}:modal:editing`}>
				<IonReorder
					className="ion-padding-end"
				><IonIcon icon={reorderTwo} /></IonReorder>
				<IonGrid>
					<IonRow className="ion-align-items-center">
						<IonCol>
							<IonInput
								id={`input_colOrder_${id}`}
								aria-label={tFieldName}
								placeholder={tFieldName}
								value={label}
							/>
						</IonCol>
						<IonCol size="auto">
							<IonButton
								color="danger"
								onClick={() => deleteField(i)}
								aria-label={tDelete}
							>
								<IonIcon icon={trashOutline} />
							</IonButton>
						</IonCol>
					</IonRow>
					<IonRow className="ion-align-items-center">
						<IonCol>
							<IonCheckbox
								labelPlacement="start"
								id={`${id}:${i}:s`}
								justify="start"
								checked={size === "s"}
								onIonChange={() => handleCheckboxes(i, "s")}
							>{tSmall}</IonCheckbox>
						</IonCol>
						<IonCol>
							<IonCheckbox
								labelPlacement="start"
								id={`${id}:${i}:m`}
								justify="start"
								checked={size === "m"}
								onIonChange={() => handleCheckboxes(i, "m")}
							>{tMed}</IonCheckbox>
						</IonCol>
						<IonCol>
							<IonCheckbox
								labelPlacement="start"
								id={`${id}:${i}:l`}
								justify="start"
								checked={size === "l"}
								onIonChange={() => handleCheckboxes(i, "l")}
							>{tLarge}</IonCheckbox>
						</IonCol>
					</IonRow>
				</IonGrid>
			</IonItem>
		);
	}), [deleteField, handleCheckboxes, shadowColumns, tDelete, tFieldName, tLarge, tMed, tSmall]);

	const opener = useCallback(() => openECM(true), [openECM]);
	const toggleTruncate = useCallback(() => setShadowTruncate(!shadowTruncate), [shadowTruncate]);
	const doSetCustomSort = useCallback((e: SelectCustomEvent) => setShadowCustomSort(e.detail.value), []);
	const doSetBlankSort = useCallback((e: SelectCustomEvent) => setShadowBlankSort(e.detail.value), []);

	const customSorters = useMemo(() => customSorts.concat(PermanentInfo.sort.permanentCustomSortObjs).map(
		sorter => (
			<IonSelectOption
				key={`lex:modal:${sorter.id}`}
				className="ion-text-wrap ion-text-align-end"
				value={sorter.id}
			>{sorter.title}</IonSelectOption>
		)
	), [customSorts]);
	return (
		<IonModal
			isOpen={isOpen}
			onDidDismiss={closeModal}
			backdropDismiss={false}
			onIonModalDidPresent={onLoad}
		>
			<IonHeader>
				<IonToolbar color="primary">
					<IonTitle>{tEditGeneral}</IonTitle>
					<IonButtons slot="end">
						<IonButton onClick={opener} aria-label={tExChar}>
							<IonIcon icon={globeOutline} />
						</IonButton>
						<IonButton onClick={closeModal} aria-label={tClose}>
							<IonIcon icon={closeCircleOutline} />
						</IonButton>
					</IonButtons>
				</IonToolbar>
			</IonHeader>
			<IonContent id="editLexiconItemOrder">
				<IonList lines="full">
					<IonItemDivider>{tLexOpts}</IonItemDivider>
					<IonItem>
						<IonToggle
							labelPlacement="start"
							enableOnOffLabels
							checked={!shadowTruncate}
							onIonChange={toggleTruncate}
						>{tShowTitle}</IonToggle>
					</IonItem>
					<IonItem className="ion-text-wrap">
						<IonSelect
							className="ion-text-wrap"
							label={tpMethod}
							value={shadowCustomSort}
							onIonChange={doSetCustomSort}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value={null}
							>{tDefSort}</IonSelectOption>
							{customSorters}
						</IonSelect>
					</IonItem>
					<IonItem className="ion-text-wrap">
						<IonSelect
							className="ion-text-wrap"
							label={tpBlank}
							value={shadowBlankSort}
							onIonChange={doSetBlankSort}
						>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="first"
							>{tToBeg}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="last"
							>{tToEnd}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="alphaFirst"
							>{tAlphaFirst}</IonSelectOption>
							<IonSelectOption
								className="ion-text-wrap ion-text-align-end"
								value="alphaLast"
							>{tAlphaLast}</IonSelectOption>
						</IonSelect>
					</IonItem>
					<IonItemDivider>{tRearr}</IonItemDivider>
					<IonReorderGroup disabled={false} onIonItemReorder={doReorder}>
						{reorderColumns}
					</IonReorderGroup>
				</IonList>
			</IonContent>
			<IonFooter id="footerElement">
				<IonToolbar color="darker">
					<IonButton
						color="success"
						slot="end"
						onClick={addNewColumn}
					>
						<IonIcon icon={addCircleOutline} slot="start" />
						<IonLabel>{tAddThing}</IonLabel>
					</IonButton>
					<IonButton
						color="tertiary"
						slot="end"
						onClick={doneEditingOrder}
					>
						<IonIcon icon={saveOutline} slot="start" />
						<IonLabel>{tSaveThings}</IonLabel>
					</IonButton>
				</IonToolbar>
			</IonFooter>
		</IonModal>
	);
};

export default EditLexiconOrderModal;
