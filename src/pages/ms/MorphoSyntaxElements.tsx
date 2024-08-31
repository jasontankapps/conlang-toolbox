import React, { FC, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import {
	IonToolbar,
	IonButtons,
	IonButton,
	IonIcon,
	IonList,
	IonItem,
	IonLabel,
	IonContent,
	IonCheckbox,
	IonTextarea,
	IonModal,
	IonFooter,
	IonGrid,
	IonRow,
	IonCol,
	CheckboxChangeEventDetail,
	TextareaChangeEventDetail,
	TextareaCustomEvent
} from '@ionic/react';
import { checkmarkCircleOutline, helpCircleOutline, informationCircleSharp } from 'ionicons/icons';
import { useDispatch, useSelector } from "react-redux";
//import doParse from 'html-react-parser';
import Markdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm'

import {
	setSyntaxBool,
	setSyntaxText
} from '../../store/msSlice';
import { MSBool, MSNum, MSState, MSText, ModalPropsMaker, StateObject } from '../../store/types';
import useTranslator from '../../store/translationHooks';

import Header from '../../components/Header';
import RangeStartToEndMinusOne from '../../components/NumericRange';
import ModalHeader from '../../components/ModalHeader';

interface ModalProperties {
	title?: string
	modalPropsMaker: ModalPropsMaker
}

const doParse = (input: string) => {
	// This needs to parse Markdown, maybe?
	// Turn it into a <div>?
	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			components={{
				p: "div"
			}}
		>{input}</Markdown>
	);
};

export const SyntaxHeader: FC<ModalProperties> = (props) => {
	const [ tc ] = useTranslator('common');
	const {
		title,
		modalPropsMaker
	} = props;
	return (
		<Header
			extraChars={modalPropsMaker}
			title={title || tc("MorphoSyntax")}
			endButtons={[
				<IonButton key="msHelpButton" aria-label={tc("Help")} routerLink="/ms/overview" routerDirection="forward">
					<IonIcon icon={helpCircleOutline} />
				</IonButton>
			]}
		/>
	);
};
const RadioBox = (props: {
	prop: MSBool,
	label: string,
	checked: boolean | undefined
}) => {
	const dispatch = useDispatch();
	const {prop, label, checked} = props;
	const onChange = useCallback(
		(e: CustomEvent<CheckboxChangeEventDetail<any>>) =>
			dispatch(setSyntaxBool([prop, e.detail.checked])),
		[dispatch, prop]
	);
	return (
		<IonCheckbox
			aria-label={label}
			onIonChange={onChange}
			checked={checked}
		/>
	);
};
export const TextItem = (props: PropsWithChildren<{
	placeholder?: string,
	prop: MSText,
	rows?: number,
	className?: string,
	label?: string,
	value?: string
}>) => {
	const {
		placeholder = "",
		prop,
		rows = 3,
		className,
		label = "",
		value = "",
		children
	} = props;
	const dispatch = useDispatch();
	const classes = className ? className + " " : "";
	const onChange = useCallback((e: TextareaCustomEvent<TextareaChangeEventDetail>) => {
		dispatch(setSyntaxText([prop, e.target.value || ""]));
	}, [dispatch, prop]);
	const expandedRows = Math.min(Math.max(rows, value.split(/\n/).length), 12);
	return (
		<>
			<IonItem className={`${classes}morphoSyntaxTextItem content labelled`}>
				<IonLabel>{children}</IonLabel>
			</IonItem>
			<IonItem className={`${classes}morphoSyntaxTextItem content`}>
				<IonTextarea
					aria-label={label}
					onIonChange={onChange}
					value={value}
					placeholder={placeholder}
					rows={expandedRows}
					enterkeyhint="done"
					inputmode="text"
				/>
			</IonItem>
		</>
	);
};
export const HeaderItem = (props: PropsWithChildren<{ level?: RangeStartToEndMinusOne<1, 6> }>) => (
	<IonItem className={"h" + (props.level ? " h" + String(props.level) : "")}>
		<IonLabel>{props.children}</IonLabel>
	</IonItem>
);
/*
interface TransProps {
	rows?: string
	className?: string
	convertedRows?: string[]
}
export const TransTable = (props: PropsWithChildren<TransProps>) => {
	const {
		rows,
		className,
		convertedRows,
		children
	} = props;
	const tableRows = convertedRows || (rows || "").trim().split(/\s+\/\s+/);
	let length = 1;
	const cName = "translation" + (className ? " " + className : "");
	const finalRow = children ? tableRows.length : -1;
	children && tableRows.push(children as string);
	const mainRows = tableRows.filter((row: string) => row).map((row: string, i: number) => {
		if(i === finalRow) {
			return <tr key={"ROW-" + String(i)}><td colSpan={length}>{row}</td></tr>;
		}
		const tds = row.split(/\s+/);
		length = Math.max(length, tds.length);
		return (
			<tr key={"ROW-" + String(i)}>{
				tds.filter((el: string) => el).map(
					(el: string, i: number) => <td key={"TD-" + String(i)}>{el.replace(/__/g, " ")}</td>
				)
			}</tr>
		);
	});
	return <div className="scrollable"><table className={cName}><tbody>{mainRows}</tbody></table></div>;
};
*/
interface InfoModalProps extends ModalProperties {
	label: string // this will always be called with a label prop
	className?: string
}
export const InfoModal = (props: PropsWithChildren<InfoModalProps>) => {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const {
		title,
		label,
		className,
		children,
		modalPropsMaker
	} = props;

	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const modalTitle = useMemo(() => title || t("MISSINGTITLE"), [title, t]);
	const tDone = useMemo(() => tc("Done"), [tc]);

	const {isOpen, setIsOpen} = modalPropsMaker(modalOpen, setModalOpen);
	const setOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
	const setClosed = useCallback(() => setIsOpen(false), [setIsOpen]);
	return (
		<IonItem className={className ? className + " infoModal" : "infoModal"}>
			<IonModal isOpen={isOpen} onDidDismiss={setClosed}>
				<ModalHeader title={modalTitle} closeModal={setIsOpen} />
				<IonContent className="morphoSyntaxModal">
					<IonList lines="none">
						<IonItem>
							{children}
						</IonItem>
					</IonList>
				</IonContent>
				<IonFooter>
					<IonToolbar className="ion-text-wrap">
						<IonButtons slot="end">
							<IonButton
								onClick={setClosed}
								slot="end"
								fill="solid"
								color="success"
							>
								<IonIcon
									icon={checkmarkCircleOutline}
									slot="start"
								/>
								<IonLabel>{tDone}</IonLabel>
							</IonButton>
						</IonButtons>
					</IonToolbar>
				</IonFooter>
			</IonModal>
			<IonButton color="primary" onClick={setOpen}>
				<IonIcon
					icon={informationCircleSharp}
					className="msModalHelpIcon"
					slot="start"
				/>
				{label}
			</IonButton>
		</IonItem>
	);
};
export interface CheckboxExportProp {
	labelOverrideDocx?: boolean
	i18: string
	header?: string
	labels?: string[]
	textOutputBooleans?: MSBool[][]
}
export interface CheckboxDisplayProp {
	boxesPerRow: number
	class?: string
	labelClass?: string
	singleHeader?: string
	export?: CheckboxExportProp
	i18: string
}
export interface CheckboxTransProps {
	header?: string
	columnHeaders?: string[]
	labels: string[] | [string, string][]
}
export interface CheckboxTransExportProps {
	header: string
	labels?: string[]
	textFormat?: {
		chosenHeaders: string[]
		chosenLabelsInOrder: string[]
	}
}
interface CheckboxProps {
	boxes: MSBool[],
	display: CheckboxDisplayProp
}
interface CheckboxRowProps {
	row: MSBool[],
	state: MSState,
	label: string | [string, string],
	id: string,
	headers: undefined | string[]
	labelClass: string
}
const CheckboxRow: FC<CheckboxRowProps> = (props) => {
	const {
		row,
		state,
		label,
		id,
		headers,
		labelClass
	} = props;
	const labels = useMemo(() => Array.isArray(label) ? label : [ label ], [label]);
	const mappedLabels = useMemo(() => {
		const max = labels.length - 1;
		return labels.map((label: string, i: number) => (
			<IonCol className={i === max ? undefined : labelClass} key={`LABEL-${id}-${i}`}><div>{doParse(label)}</div></IonCol>
		));
	}, [id, labels, labelClass]);
	const mappedRow = useMemo(() => {
		const ariaLabel = labels.join(", ");
		return row.map((prop: MSBool, i: number) => (
			<IonCol className="cbox" key={`COL-${id}-${i}`}>
				<RadioBox
					label={headers ? `${headers[i]}, ${ariaLabel}` : ariaLabel}
					prop={prop}
					checked={state[prop]}
				/>
			</IonCol>
		))
	}, [headers, id, labels, state, row]);
	return (
		<IonRow key={`ROW-${id}`}>
			{mappedRow}
			{mappedLabels}
		</IonRow>
	);
};
interface HeaderRowProps {
	row: string[]
	id: string
	hasLabel: boolean
	labelClass: string
}
const HeaderRow: FC<HeaderRowProps> = (props) => {
	const {
		row,
		id,
		hasLabel,
		labelClass
	} = props;
	const final = row.pop() || "";
	const columnHeader = hasLabel ? row.pop() : undefined;
	const mappedCols = useMemo(() => {
		return row.map(
			(c: string, i: number) =>
				<IonCol className="cbox" key={`B-${id}-${i}`}>{c}</IonCol>
		);
	}, [id, row]);
	return (
		<IonRow className="header">
			{mappedCols}
			{
				columnHeader ?
					<IonCol
						className={labelClass}
						key={`L-${id}`}
					>{doParse(columnHeader)}</IonCol>
				:
					<></>
			}
			<IonCol key={`F-${id}`}>{doParse(final)}</IonCol>
		</IonRow>
	);
};
export const CheckboxItem: FC<CheckboxProps> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const {
		display,
		boxes = []
	} = props;
	const {
		i18,
		boxesPerRow,
		labelClass = "label"
	} = display;
	const {
		labels,
		header,
		columnHeaders
	} = t(i18, { returnObjects: true }) as CheckboxTransProps;
	const stateInfo = useSelector((state: StateObject) => state.ms);
	const error = tc("error");
	const rows: MSBool[][] = useMemo(() => {
		const final: MSBool[][] = [];
		let temp: MSBool[] = [];
		let count = 0;
		boxes.forEach((box, i) => {
			count++;
			temp.push(box || error);
			if(count >= boxesPerRow) {
				count = 0;
				final.push(temp);
				temp = [];
			}
		});
		return final;
	}, [boxes, boxesPerRow, error]);
	const key = boxes.join(",");
	const mappedRows = useMemo(() => {
		return rows.map((row: MSBool[], i: number) => (
			<CheckboxRow
				row={row.slice()}
				key={`${key}-${i}`}
				state={stateInfo}
				label={labels[i] || error}
				id={key}
				headers={columnHeaders && columnHeaders.slice()}
				labelClass={labelClass}
			/>
		));
	}, [rows, error, key, columnHeaders, labels, stateInfo, labelClass]);
	return (
		<IonItem className="content">
			<IonGrid className={display.class}>
				{ header ?
					<IonRow key={`HEADER-ROW-SOLO-${key}`} className="header">
						<IonCol>{doParse(header)}</IonCol>
					</IonRow>
				:
					<></>
				}
				{ columnHeaders ?
					<HeaderRow
						key={`HEADER-ROW-${key}`}
						row={columnHeaders.slice()}
						id={key}
						hasLabel={!!labels}
						labelClass={labelClass}
					/>
				:
					<></>
				}
				{mappedRows}
			</IonGrid>
		</IonItem>
	);
};

const TDMarkdown: FC<{children: string, length?: number}> = (props) => {
	const { children, length } = props;
	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			components={{
				p: (pprops) => <td {...(length ? { colSpan: length } : {})}>{pprops.children}</td>
			}}
		>{children}</Markdown>
	);
};

const msMarkdownComponents: Partial<Components> = {
	code: (codeprops) => {
		const lengths: number[] = [];
		const { children } = codeprops;
		if(typeof(children) === "string") {
			if(children.indexOf("[translationTable]") !== 0) {
				// return the plain string
				return children as string;
			}
			// Look for a plain text section
			const [info, text] =
				children.slice(18).trim()
//								.replace(/\[-\]/g, String.fromCodePoint(0x00ad)) // turn [-] into &shy;
					.split(" ||| ");
			// Split into rows
			const rows = info.split(" || ").map((row: string, i: number) => {
				const cells = row.split(" | ").map((cell, j) => {
					return <TDMarkdown key={`TD-${i}-${j}-${cell}`}>{cell}</TDMarkdown>;
				});
				lengths.push(cells.length);
				return <tr key={`ROW-${i}-${row}`}>{cells}</tr>;
			});
			if(text) {
				rows.push(<tr key={`ROW-FINAL-${text}`}><TDMarkdown length={Math.max(...lengths)}>{text}</TDMarkdown></tr>);
			}
			return <div className="scrollable"><table className="translation"><tbody>{rows}</tbody></table></div>;
		}
		return `${children}`;
	},
	table: (tableprops) => {
		const { node, ...rest } = tableprops;
		return <table {...rest} className="informational" />;
	},
	li: (liprops) => {
		const { node, children, ...rest } = liprops;
		if(typeof children === "string") {
			if(children.indexOf("[newSection]") === 0) {
				return <li {...rest} className="newSection">{children.slice(12)}</li>;
			}
		} else if (Array.isArray(children)) {
			const [tester, ...kids] = children;
			if(typeof tester === "string" && tester.indexOf("[newSection]") === 0) {
				if(tester.length > 12) {
					kids.unshift(tester.slice(12));
				}
				return <li {...rest} className="newSection">{kids}</li>;
			}
		} else {
			console.log("NON-STRING, NON-ARRAY CHILDREN");
			console.log(children);
			console.log({...liprops});
		}
		return <li {...rest}>{children}</li>;
	}
};
export const MSMarkdown: FC<{children: string}> = (props) => {
	return (
		<Markdown
			remarkPlugins={[remarkGfm]}
			components={msMarkdownComponents}
		>{props.children}</Markdown>
	);
};

export interface SpecificMSPageData {
	tag: string
	level?: RangeStartToEndMinusOne<1, 6>
	heads?: (MSBool | MSText | true)[]
	content?: string
	title?: string
	label?: string
	prop?: MSNum | MSText
	rows?: number
	start?: string
	end?: string
	spectrum?: boolean
	max?: number
	boxes?: MSBool[]
	display?: CheckboxDisplayProp
}

export type BasicHeader = Required<Pick<SpecificMSPageData, "level" | "heads" | "content">>;
export interface MSHeader extends BasicHeader {
	tag: "Header"
}

export type BasicRange = Required<Pick<SpecificMSPageData, "prop" | "start" | "end">> & Pick<SpecificMSPageData, "max" | "spectrum">;
export interface MSRange extends BasicRange {
	tag: "Range"
	prop: MSNum
}

export type BasicModal = Required<Pick<SpecificMSPageData, "title" | "content">> & Pick<SpecificMSPageData, "label">;
export interface MSModal extends BasicModal {
	tag: "Modal"
}

export type BasicCheckbox = Required<Pick<SpecificMSPageData, "boxes" | "display">>;
export interface MSCheckboxes extends BasicCheckbox {
	tag: "Checkboxes"
}

export type BasicText = Required<Pick<SpecificMSPageData, "content" | "prop">> & Pick<SpecificMSPageData, "rows">;
export interface MSTextbox extends BasicText {
	tag: "Text"
	prop: MSText
}

export const MSSections = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

export type AnyMSItem = (MSHeader | MSRange | MSModal | MSTextbox | MSCheckboxes);
