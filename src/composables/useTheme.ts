import { ref, watch, onMounted } from "vue";
import { usePreferredDark } from "@vueuse/core";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const theme = ref<Theme>("system");
  const isDark = ref(false);
  const preferredDark = usePreferredDark();

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
    localStorage.setItem("theme", newTheme);
    applyTheme();
  };

  const applyTheme = () => {
    const root = document.documentElement;

    if (theme.value === "system") {
      isDark.value = preferredDark.value;
    } else {
      isDark.value = theme.value === "dark";
    }

    if (isDark.value) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark.value ? "light" : "dark";
    setTheme(newTheme);
  };

  onMounted(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      theme.value = savedTheme;
    }
    applyTheme();
  });

  watch([theme, preferredDark], () => {
    applyTheme();
  });

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
    applyTheme,
  };
}
