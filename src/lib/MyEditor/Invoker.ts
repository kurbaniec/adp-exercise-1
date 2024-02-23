import type { Command } from './Commands';
import { EditorState, TextEditor } from '$lib/MyEditor/Editor';

let stateHistory: EditorState[] = [
	new EditorState("") // Initial state
];
let currentIndex: number = 0;

// Assume editor is the instance of TextEditor acting as the Originator
export function executeCommand(command: Command, editor: TextEditor): void {
	// Execute the command
	command.execute(editor);

	// Save the state
	const memento = editor.createStateMemento();
	stateHistory = stateHistory.slice(0, currentIndex + 1); // Trim "future" history
	stateHistory.push(memento);

	currentIndex++;
}

export function undo(editor: TextEditor): void {
	console.log("[Invoker]: Undo")
	if (currentIndex < 1) return;
	const memento = stateHistory[currentIndex-1];
	editor.restoreState(memento); // Restore the state from the memento
	currentIndex--;
	console.log(`[Invoker]: Reverted state to`, memento)
}

export function redo(editor: TextEditor): void {
	console.log("[Invoker]: Redo")
	if (currentIndex + 1 < stateHistory.length) {
		const memento = stateHistory[currentIndex + 1];
		editor.restoreState(memento); // Use memento to restore state
		currentIndex++;
		console.log(`[Invoker]: Changed state to`, memento)
	}
}
