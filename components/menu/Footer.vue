<template>
  <footer
    class="v-card min-h-180px w-full"
    border-t="1px solid gray-200"
    shadow-md dark:border-t-dark-3 dark:bg-dark-9
  >
    <div class="content layout-default" flex-row-c-c flex-col dark:opacity-80>
      <img
        loading="lazy"
        src="@/assets/images/logo/logo_txt.png" w-180px alt="Design By: Kiwi2333"
      >
      <h4 pt-1em opacity-70>
        Design By:
        <NuxtLink
          class="mark2"
          target="_blank"
          to="https://github.com/KiWi233333"
        >
          <img
            loading="lazy"
            src="@/assets/images/logo/kiwi_strong.svg"
            alt="Design By Kiwi23333"
            class="mx-4 w-100px"
            dark:filter-invert-100
          >
        </NuxtLink>
      </h4>
    </div>
  </footer>
</template>

<style scoped lang="scss"></style>
