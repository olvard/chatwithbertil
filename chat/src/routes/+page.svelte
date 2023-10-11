<!-- <script>
	import { onMount } from 'svelte'
	import ChatMessage from './chat-message.svelte'

	let messages = []
	let inputMessage = ''
	let isWaitingForResponse = false

	// onMount(async () => {
	//   await handleChatCompletion()
	// })

	const handleChatCompletion = async () => {
		const userMessage = {
			role: 'user',
			content: inputMessage,
		}

		const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				isInitializing: messages.length === 0,
				priorMessages: messages,
				message: inputMessage,
			}),
		}).then((res) => res.json())

		if (inputMessage) {
			messages = messages.concat([userMessage])
		}

		messages = messages.concat(response)
		inputMessage = ''

		return response
	}
</script> -->

<script>
	import { onMount } from 'svelte'
	import ChatMessage from './chat-message.svelte'

	let messages = []
	let inputMessage = ''
	let isWaitingForResponse = false

	const handleUserMessage = () => {
		const userMessage = {
			role: 'user',
			content: inputMessage,
		}

		if (inputMessage) {
			messages = messages.concat([userMessage])
			inputMessage = '' // Clear the input field

			// Now, you can optionally send the message to the server if needed
			// You can send it in the background or display a sending indicator
			// and update the message after getting a response from the server.
			handleChatCompletion()
		}
	}

	const handleChatCompletion = async () => {
		const response = await fetch('/api/', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				isInitializing: messages.length === 0,
				priorMessages: messages,
				message: inputMessage,
			}),
		}).then((res) => res.json())

		// Add the server response to the messages array
		messages = messages.concat(response)
	}

	// You can call handleChatCompletion when the component mounts if needed
	// onMount(async () => {
	//   await handleChatCompletion()
	// })
</script>

<div class="container">
	<div class="messages">
		{#if messages.length > 0}
			{#each messages as message}
				<ChatMessage role={message.role} message={message.content} />
			{/each}
		{/if}
	</div>

	<form class="inputbox" on:submit={handleUserMessage}>
		<div>
			<input bind:value={inputMessage} type="text" name="search" id="search" />
			<button type="submit">
				<kbd>Enter</kbd>
			</button>
		</div>
	</form>
</div>

<style>
	.container {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.messages {
		padding-bottom: 100px;
		font-family: monospace;
		font-size: 20px;
		width: 50vw;
		height: 70vh;
		overflow: scroll;
	}

	.inputbox {
		padding-bottom: 50px;
	}

	input[type='text'] {
		width: 600px;
		height: 40px;
		border: 1px solid #ccc;
		border-radius: 5px;
		padding: 10px;
	}
</style>
