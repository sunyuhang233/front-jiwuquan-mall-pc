// 切换动画
const mode = useColorMode();
const isDark = computed({
  get(): boolean {
    return mode.value === "dark";
  },
  set(): void {
    mode.preference = isDark ? "light" : "dark";
  },
});
// @ts-expect-error: Transition Api
const isAppearanceTransition = document.starViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function toggle(event: MouseEvent) {
  if (!event || !document.startViewTransition || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return null;

  const isDarkValue = !isDark.value;
  const clientX = event.clientX;
  const clientY = event.clientY;
  const maxRadius = Math.hypot(Math.max(clientX, innerWidth - clientX), Math.max(clientY, innerHeight - clientY));
  const transition = document.startViewTransition(() => {
    isDark.value = isDarkValue;
  });

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${clientX}px ${clientY}px)`,
      `circle(${maxRadius.toFixed(0)}px at ${clientX}px ${clientY}px)`,
    ];

    document.documentElement.animate(
      {
        clipPath: isDarkValue ? clipPath : [...clipPath].reverse(),
      },
      {
        duration: 550,
        easing: "ease-in-out",
        pseudoElement: isDarkValue ? "::view-transition-new(root)" : "::view-transition-old(root)",
      },
    );
  });
}
