<script lang="ts">
	import { writable } from 'svelte/store';
	import { executeCommand, undo, redo } from '$lib/Invoker';
	import { HeaderCommand, TextChangedCommand } from '$lib/Commands';
	import { type EditorContent, TextEditor } from '$lib/Editor';
	import type { Writable } from 'svelte/store';
	import MyTextArea from '../components/MyTextArea.svelte';
	import { marked } from 'marked';

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
		executeCommand(new HeaderCommand(1, cursorPos), editor)
	}

	let htmlContent = '';
	$: htmlContent = marked($text);

</script>

<style>
    header {
        display: flex;
        justify-content: flex-start;
        background-color: #f5f5f5;
        padding: 10px;
        border-bottom: 2px solid #e1e1e1;
    }

    button {
        background-color: #fff;
        border: 1px solid #ddd;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 5px;
        font-size: 14px; /* Smaller text size */
    }

    button:hover {
        background-color: #e1e1e1;
    }

    .spacer {
        display: inline-block;
        width: 20px; /* Adjust the width as needed for spacing */
    }

    .editor-container {
        display: flex;
        height: 90vh; /* Adjust based on header height */
    }

    .markdown-input, .preview {
        flex: 1;
        padding: 10px;
        border: none;
        outline: none;
    }

    .markdown-input {
        border-right: 1px solid #e1e1e1;
    }

    @media (max-width: 600px) {
        .editor-container {
            flex-direction: column;
        }

        .markdown-input {
            border-right: none;
            border-bottom: 1px solid #e1e1e1;
        }
    }
</style>

<header>
	<button on:click="{() => undo(editor)}">Undo</button>
	<button on:click="{() => redo(editor)}">Redo</button>
	<div class="spacer"></div>
	<button>H1</button>
	<button>H2</button>
	<button>H3</button>
	<button>H4</button>
	<button><strong>B</strong></button>
	<button><em>I</em></button>
	<button>Code</button>
	<button>Itemize</button>
	<button>Enumerate</button>
	<button>Rule</button>
	<button>Quote</button>
</header>

<div class="editor-container">
	<textarea
		class="markdown-input"
		bind:this={textArea}
		bind:value={$text}
		on:input="{onInput}"
		placeholder="Write your markdown here..."
	/>
	<div class="preview">{@html htmlContent}</div>
</div>

<!--
<textarea bind:this={textArea} bind:value={$text} on:input="{onInput}"></textarea>
<button on:click="{() => undo(editor)}">Undo</button>
<button on:click="{() => redo(editor)}">Redo</button>
<button on:click={() => header()}>Header</button>

-->


