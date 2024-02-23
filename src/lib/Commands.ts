import type { Writable } from 'svelte/store';
import { type TextEditor } from '$lib/Editor';

export interface Command {
	execute(textEditor: TextEditor): void;

	// undo(): void;
}

export class TextChangedCommand implements Command {
	execute(textEditor: TextEditor): void {
		console.log('Text changed!');
	}
}

export class HeaderCommand implements Command {
	private readonly cursorPos;

	constructor(cursorPos: number) {
		this.cursorPos = cursorPos;
	}

	execute(textEditor: TextEditor): void {
		const multilineString = textEditor.getContent()
		const stringWithHeader = this.addHashAtCursor(multilineString, this.cursorPos);
		textEditor.setContent(stringWithHeader);
	}

	addHashAtCursor(multilineString: string, cursorPosition: number): string {
		// Split the string into lines
		const lines = multilineString.split("\n");

		let currentPos = 0; // To keep track of the cursor position in terms of lines

		for (let i = 0; i < lines.length; i++) {
			// Add 1 for the newline character that was removed by split (except for the last line)
			const lineLength = lines[i].length + (i < lines.length - 1 ? 1 : 0);

			if (currentPos + lineLength >= cursorPosition) {
				// The cursor is on the current line, so add '#' at the beginning
				lines[i] = "#" + lines[i];
				break; // Exit the loop after modifying the line
			}

			// Update the current position for the next iteration
			currentPos += lineLength;
		}

		// Rejoin the modified lines back into a single string
		return lines.join("\n");
	}
}

// export class AddTextCommand implements Command {
// 	private textStore: Writable<string>;
// 	private newText: string;
// 	private previousText: string;
//
// 	constructor(textStore: Writable<string>, newText: string) {
// 		this.textStore = textStore;
// 		this.newText = newText;
// 		this.previousText = '';
// 	}
//
// 	execute(): void {
// 		this.textStore.update(currentText => {
// 			this.previousText = currentText;
// 			return this.newText;
// 		});
// 	}
//
// 	undo(): void {
// 		this.textStore.set(this.previousText);
// 	}
// }
