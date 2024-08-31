import React, { FC, useMemo } from 'react';
import {
	IonPage,
	IonContent,
	IonList,
	IonRange,
	RangeCustomEvent,
	useIonViewDidEnter,
	IonItem
} from '@ionic/react';
import { useDispatch, useSelector } from "react-redux";

import { MSNum, MSText, PageData, StateObject } from '../../store/types';
import { setLastViewMS } from '../../store/internalsSlice';
import { setSyntaxNum } from '../../store/msSlice';
import useTranslator from '../../store/translationHooks';

import {
	CheckboxItem,
	HeaderItem,
	InfoModal,
	SyntaxHeader,
	TextItem,
	MSMarkdown,
	SpecificMSPageData,
	BasicRange,
	BasicModal,
	BasicText,
	BasicCheckbox,
	BasicHeader
} from './MorphoSyntaxElements';
import msInfo from './getMSInfo';
import { Dispatch } from 'redux';

interface MSData extends PageData {
	page: "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10"
}

const rangeChangeFunc = (dispatch: Dispatch, nProp: MSNum) => {
	return (e: RangeCustomEvent) => dispatch(setSyntaxNum([nProp, e.target.value as number]));
};

const MSPage: FC<MSData> = (props) => {
	const [ t ] = useTranslator('ms');
	const [ tc ] = useTranslator('common');
	const dispatch = useDispatch();
	const ms = useSelector((state: StateObject) => state.ms);
	const { modalPropsMaker, page } = props;
	const info = msInfo[page] as SpecificMSPageData[];
	const header = info[0].content;
	const pageContents = useMemo(() => info.map((block: SpecificMSPageData, i: number) => {
		const { tag, prop, ...etc } = block;
		const key = `${page}-${tag}-${i}`;
		switch(tag) {
			case "Header":
				const { level, content } = etc as BasicHeader
				return <HeaderItem key={key} level={level}>{t(content)}</HeaderItem>
			case "Range":
				const { start: s, end: e, max = 4, spectrum } = etc as BasicRange;
				const start = t(s);
				const end = t(e);
				const nProp = prop as MSNum;
				const onChange = rangeChangeFunc(dispatch, nProp);
				return (
					<IonItem key={key} className="content">
						<IonRange
							aria-label={t("rangeFromTo", { start, end })}
							onIonChange={onChange}
							value={ms[nProp]}
							className={spectrum ? "spectrum" : undefined}
							color="secondary"
							snaps={true}
							step={1}
							ticks={true}
							min={0}
							max={max}
						>
							<div slot="start">{start}</div>
							<div slot="end">{end}</div>
						</IonRange>
					</IonItem>
				);
			case "Modal":
				const { title, content: mContent, label } = etc as BasicModal;
				const modalProps = {
					modalPropsMaker,
					title: t(title),
					label: label ? t([label, "genericInfoButtonText"]) : t("genericInfoButtonText")
				};
				const info = t(mContent, { joinArrays: "\n" });
				return (
					<InfoModal key={key} {...modalProps}><MSMarkdown>{info}</MSMarkdown></InfoModal>
				);
			case "Checkboxes":
				const { boxes, display } = etc as BasicCheckbox;
				return (
					<CheckboxItem key={key} display={display} boxes={boxes} />
				);
			case "Text":
				const tProp = prop as MSText;
				const { rows = 6, content: tContent } = etc as BasicText;
				const desc = t(tContent);
				return (
					<TextItem key={key} prop={tProp} value={ms[tProp]} rows={rows}>{desc}</TextItem>
				);
		}
		// THIS SHOULDN'T HAPPEN
		return <React.Fragment key={key}>{tc("emphasizedError")}</React.Fragment>;
	}), [info, ms, dispatch, page, t, modalPropsMaker, tc]);
	const title = useMemo(() => t(header || "error"), [t, header]);
	useIonViewDidEnter(() => {
		dispatch(setLastViewMS("ms" + page));
	});
	return (
		<IonPage>
			<SyntaxHeader title={title} {...props} />
			<IonContent fullscreen
				className="evenBackground disappearingHeaderKludgeFix"
				id="morphoSyntaxPage"
			>
				<IonList lines="none" className="hasSpecialLabels">
					{pageContents}
				</IonList>
			</IonContent>
		</IonPage>
	);
};

export default MSPage;
