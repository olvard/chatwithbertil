<script>
	export let role = ''
	export let message = ''

	const imgSrc = role === 'assistant' ? '/beaver.png' : '/user.png'
	const name = role === 'assistant' ? 'Bertil' : 'User'
</script>

<li>
	<div>
		<div class="header">
			<img class="profile" src={imgSrc} alt="" />
			<p>{name}</p>
		</div>
		<p>{message}</p>
	</div>
</li>

<style>
	.profile {
		width: 70px;
	}

	.header {
		display: flex;
	}

	li {
		list-style: none;
	}
</style>
