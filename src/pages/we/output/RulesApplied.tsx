import React, { FC } from 'react';

type Input = [number, string, string, string, [string, string][]];
type SaveFunc = (text: string) => void;

interface Props {
	words: Input[]
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}
interface SelectableProps {
	result: string
	arrow: string
	original: string
	rules: [string, string][]
	id: string
	maybeSaveThisWord: SaveFunc
	savedWordsObject: { [key: string]: boolean }
}

const InputToOutput: FC<Omit<SelectableProps, "rules">> = ({original, arrow, result, id, maybeSaveThisWord, savedWordsObject}) => {
	const className = savedWordsObject[result] ? "word saved" : "word";
	return (
		<div className="inputToOutput selectable">
			<span>{original}</span>{' '}
			<span>{arrow}</span>{' '}
			<span className={className} id={id} onClick={() => maybeSaveThisWord(result)}>{result}</span>
		</div>
	);
}
const RulesLine: FC<SelectableProps> = ({original, arrow, result, id, rules, maybeSaveThisWord, savedWordsObject}) => {
	return (
		<div className="rulesApplied selectable">
			<InputToOutput key={id} id={id} original={original} arrow={arrow} result={result} maybeSaveThisWord={maybeSaveThisWord} savedWordsObject={savedWordsObject} />
			<div className="rules selectable">
				{rules.map((pair: string[], i: number) => {
					const [rule, result] = pair;
					return (
						<div className="inputToOutput selectable" key={`${id}:output:${rule}:${result}:${i}`}>
							<span>{rule}</span>{' '}
							<span>{arrow}</span>{' '}
							<span>{result}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}

const RulesApplied: FC<Props> = ({words, maybeSaveThisWord, savedWordsObject}) => {
	return (
		<div>{words.map((input) => {
			const [i, original, arrow, result, rules] = input;
			const id = `evolved:rules:${original} ${arrow} ${result}:${i}`;
			return <RulesLine key={id} id={id} original={original} arrow={arrow} result={result} maybeSaveThisWord={maybeSaveThisWord} rules={rules} savedWordsObject={savedWordsObject} />;
		})}</div>
	);
};

export default RulesApplied;
