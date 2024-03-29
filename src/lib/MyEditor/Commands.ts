import { type TextEditor } from '$lib/MyEditor/Editor';

export interface Command {
	execute(textEditor: TextEditor): void;
}

export class TextChangedCommand implements Command {
	execute(textEditor: TextEditor): void {
		console.log('[TextChangedCommand]: Text changed!');
	}
}

export class HeaderCommand implements Command {
	private readonly depth: number;

	constructor(depth: number) {
		this.depth = depth;
	}

	execute(textEditor: TextEditor): void {
		const multilineString = textEditor.getContent();
		const cursorPos = textEditor.getSelectionStart();
		const stringWithHeader = this.addHashAtCursor(multilineString, cursorPos);
		textEditor.setContent(stringWithHeader);
		console.log(`[HeaderCommand]: Adding header at ${cursorPos}!`);
	}

	addHashAtCursor(multilineString: string, cursorPos: number): string {
		// Split the string into lines
		const lines = multilineString.split('\n');
		let currentPos = 0; // To keep track of the cursor position in terms of lines
		for (let i = 0; i < lines.length; i++) {
			// Add 1 for the newline character that was removed by split (except for the last line)
			const lineLength = lines[i].length + (i < lines.length - 1 ? 1 : 0);
			if (currentPos + lineLength >= cursorPos) {
				// The cursor is on the current line, so add '#' at the beginning
				lines[i] = ('#'.repeat(this.depth)) + ' ' + lines[i];
				break; // Exit the loop after modifying the line
			}
			// Update the current position for the next iteration
			currentPos += lineLength;
		}
		// Rejoin the modified lines back into a single string
		return lines.join('\n');
	}
}

export class FormattingMarkerCommand implements Command {
	private readonly marker: string;

	constructor(marker: string) {
		this.marker = marker;
	}

	execute(textEditor: TextEditor) {
		const content = textEditor.getContent();
		const positions = [textEditor.getSelectionStart(), textEditor.getSelectionEnd()];
		const markers = [this.marker, this.marker];
		const stringWithMarkers = insertStringsAtPositions(content, positions, markers);
		textEditor.setContent(stringWithMarkers);
		console.log(`[FormattingCommand]: Adding marker [${markers}] at ${positions}!`);
	}
}

export class FormattingSpecialCommand {
	private readonly special: string;

	constructor(special: string) {
		this.special = special;
	}

	execute(textEditor: TextEditor) {
		const content = textEditor.getContent();
		const position = textEditor.getSelectionStart();
		const stringWithSpecial = insertStringAtPosition(content, position, this.special);
		textEditor.setContent(stringWithSpecial);
		console.log(`[FormattingSpecialCommand]: Adding special [${this.special}] at ${position}!`);
	}
}

export class ListCommand implements Command {
	private readonly ordered: boolean;

	constructor(ordered: boolean) {
		this.ordered = ordered;
	}

	execute(textEditor: TextEditor) {
		const content = textEditor.getContent();
		const position = textEditor.getSelectionStart();
		const list = this.ordered ? '\n  1. Item' : '\n  * Item';
		const stringWithMarkers = insertStringAtPosition(content, position, list);
		textEditor.setContent(stringWithMarkers);
		console.log(`[ListCommand]: Adding list [${list}] at ${position}!`);
	}
}

export class LinkCommand implements Command {
	private readonly url: string;
	private readonly value: string

	constructor(url: string, value: string) {
		this.url = url;
		this.value = value;
	}

	execute(textEditor: TextEditor) {
		const content = textEditor.getContent();
		const position = textEditor.getSelectionStart();
		const link = `[${this.value}](${this.url})`
		const stringWithLink = insertStringAtPosition(content, position, link);
		textEditor.setContent(stringWithLink);
		console.log(`[LinkCommand]: Adding link [${link}] at ${position}!`);
	}
}

function insertStringAtPosition(text: string, position: number, insertString: string): string {
	return insertStringsAtPositions(text, [position], [insertString]);
}

function insertStringsAtPositions(text: string, positions: number[], insertStrings: string[]): string {
	// Ensure positions and insertStrings arrays have the same length
	if (positions.length !== insertStrings.length) {
		throw new Error('positions and insertStrings arrays must have the same length');
	}

	// Sort the positions and strings based on the positions array
	const sortedIndices = positions
		.map((value, index) => ({ value, index }))
		.sort((a, b) => a.value - b.value)
		.map(data => data.index);

	const sortedPositions = sortedIndices.map(index => positions[index]);
	const sortedStrings = sortedIndices.map(index => insertStrings[index]);

	// Insert strings at the sorted positions
	let result = text;
	let shift = 0; // Tracks the shift in positions due to insertions

	for (let i = 0; i < sortedPositions.length; i++) {
		const position = sortedPositions[i] + shift; // Adjust position based on shifts from previous insertions
		result = result.slice(0, position) + sortedStrings[i] + result.slice(position);
		shift += sortedStrings[i].length; // Update shift for next insertion
	}

	return result;
}
