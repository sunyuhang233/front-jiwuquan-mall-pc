<template>
	<footer
		class="w-1/1 min-h-180px animate__animated animate__fadeIn"
		border-t="1px solid gray-200"
		dark:border-t-dark-3
		shadow-md
		dark:bg-dark-9
	>
		<div class="content layout-default" dark:opacity-80 flex-row-c-c flex-col>
			<img src="@/assets/images/logo/logo_txt.png" w-180px alt="Design By: Kiwi2333" />
			<h4 pt-1em opacity-70>
				Design By:
				<NuxtLink
					class="mark2 animate__animated"
					target="_blank"
					to="https://github.com/KiWi233333"
				>
					<img
						src="@/assets/images/logo/kiwi_strong.svg"
						:alt="'Design By Kiwi23333'"
						class="mx-4 w-100px"
						dark:filter-invert-100
					/>
				</NuxtLink>
			</h4>
		</div>
	</footer>
</template>
<style scoped lang="scss"></style>
