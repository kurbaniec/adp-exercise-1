import type { Command } from './Commands';
import { EditorState, TextEditor } from '$lib/Editor';

// let history: Command[] = [];
let stateHistory: EditorState[] = [
	new EditorState("")
];
let currentIndex: number = 0;

// Assume editor is the instance of TextEditor acting as the Originator
export function executeCommand(command: Command, editor: TextEditor): void {
	// Execute the command
	command.execute(editor);
	// history = history.slice(0, currentIndex + 1); // Trim "future" history
	// history.push(command);

	// Save the state
	const memento = editor.createStateMemento();
	stateHistory = stateHistory.slice(0, currentIndex + 1); // Trim "future" history
	stateHistory.push(memento);

	currentIndex++;
}

// export function executeCommand(command: Command, editor: TextEditor): void {
// 	// Save the current state before executing the command
// 	const memento = editor.createStateMemento();
// 	stateHistory = stateHistory.slice(0, currentIndex + 1); // Trim "future" history
// 	stateHistory.push(memento);
//
// 	// Execute the command and update history
// 	command.execute(editor);
// 	history = history.slice(0, currentIndex + 1); // Trim "future" history
// 	history.push(command);
// 	currentIndex++;
// }

export function undo(editor: TextEditor): void {
	console.log(stateHistory, currentIndex)
	if (currentIndex < 1) return;
	const memento = stateHistory[currentIndex-1];
	console.log("memento", memento)
	editor.restoreState(memento); // Restore the state from the memento
	currentIndex--;
}

export function redo(editor: TextEditor): void {
	if (currentIndex + 1 < stateHistory.length) {
		const memento = stateHistory[currentIndex + 1];
		editor.restoreState(memento); // Use memento to restore state
		currentIndex++;
	}
}
