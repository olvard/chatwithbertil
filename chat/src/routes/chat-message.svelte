<script>
	export let role = ''
	export let message = ''

	const imgSrc = role === 'assistant' ? '/beaver.png' : '/user.png'
	const name = role === 'assistant' ? 'Bertil' : 'User'
	let roleClass = ''
	if (name == 'Bertil') {
		roleClass = 'beaver-background'
	}
</script>

<li class={roleClass}>
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

	p {
		padding-left: 5px;
	}

	li {
		list-style: none;
		background-color: bisque;
		padding: 5px;
		margin-top: 5px;
	}

	.beaver-background {
		background-color: #ff9966;
	}
</style>
