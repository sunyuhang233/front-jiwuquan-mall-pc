<template>
	<footer
		class="w-1/1 h-180px"
		border-t="1px solid gray-200"
		dark:border-t-dark-3
		shadow-md
		dark:bg-dark-9
		shadow="0em -2em 30px dark-4"
	>
		<ClientOnly>
			<h3>
				作者:<NuxtLink to="https://github.com/KiWi233333" i-carbon:logo-github
					>Kiwi2333</NuxtLink
				>
			</h3>
		</ClientOnly>
	</footer>
</template>
<style scoped lang="scss"></style>
