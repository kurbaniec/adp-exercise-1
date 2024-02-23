// Interface to wrap reactive strings
export interface EditorContent {
	set(content: string): void
	get(): string
}

// Memento class to hold editor state
export class EditorState {
	constructor(private content: string) {}

	getContent(): string {
		return this.content;
	}
}

export interface EditorCursor {
	selectionStart(): number
	selectionEnd(): number
}

// Originator class representing the text editor
export class TextEditor {
	private readonly content: EditorContent
	private readonly cursor: EditorCursor

	constructor(content: EditorContent, cursor: EditorCursor) {
		this.content = content;
		this.cursor = cursor;
	}

	// Method to create a memento with the current state
	createStateMemento(): EditorState {
		return new EditorState(this.content.get());
	}

	// Method to restore state from a memento
	restoreState(memento: EditorState): void {
		this.content.set(memento.getContent());
	}

	// Editor-specific methods
	setContent(content: string): void {
		this.content.set(content);
	}

	getContent(): string {
		return this.content.get();
	}

	getSelectionStart(): number {
		return this.cursor.selectionStart()
	}

	getSelectionEnd(): number {
		return this.cursor.selectionEnd()
	}
}
