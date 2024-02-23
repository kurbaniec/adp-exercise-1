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

// Originator class representing the text editor
export class TextEditor {
	private readonly content: EditorContent

	constructor(content: EditorContent) {
		this.content = content;
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
}
