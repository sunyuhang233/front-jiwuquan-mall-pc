// 切换动画
const mode = useColorMode()
const isDark = computed({
  get(): boolean {
    return mode.value === 'dark'
  },
  set(): void {
    mode.preference = isDark ? 'light' : 'dark'
  },
})
// @ts-expect-error: Transition Api
const isAppearanceTransition = document.starViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches


export default (event: MouseEvent) => {
  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value
    return null
  }
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )
  // @ts-expect-error: Transition API
  const transition = document.starViewTransition(() => {
    isDark.value = !isDark.value
  })
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark ? clipPath : [...clipPath].reverse(),
      },
      {
        duration: 300,
        easing: 'ease-in',
        pseudoElement: isDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
      },
    )
  })
}
