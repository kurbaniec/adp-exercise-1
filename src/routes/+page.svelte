<script lang="ts">
	import { writable } from 'svelte/store';
	import { executeCommand, undo, redo } from '$lib/Invoker';
	import { HeaderCommand, TextChangedCommand } from '$lib/Commands';
	import { type EditorContent, TextEditor } from '$lib/Editor';
	import type { Writable } from 'svelte/store';
	import MyTextArea from '../components/MyTextArea.svelte';

	const text: Writable<string> = writable(''); // Current text
	const textContent = new class implements EditorContent {
		get(): string { return $text; }

		set(content: string): void { $text = content; }
	};
	const editor = new TextEditor(textContent);

	// Corrected type for the event parameter
	function onInput(event: InputEvent) {
		const target = event.target as HTMLTextAreaElement;
		// executeCommand(new AddTextCommand(text, target.value));
		executeCommand(new TextChangedCommand(), editor)
	}

	let textArea: HTMLTextAreaElement
	function header() {
		const cursorPos = textArea.selectionStart
		executeCommand(new HeaderCommand(cursorPos), editor)
	}

</script>

<textarea bind:this={textArea} bind:value={$text} on:input="{onInput}"></textarea>
<button on:click="{() => undo(editor)}">Undo</button>
<button on:click="{() => redo(editor)}">Redo</button>
<button on:click={() => header()}>Header</button>

<MyTextArea></MyTextArea>

// Heading 1-3
// link
// list
// enumeration
// code
