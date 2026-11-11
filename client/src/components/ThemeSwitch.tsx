import { RadioGroup } from "./ui/RadioGroup.js";
import { setTheme, useTheme } from "../lib/theme.js";

const THEMES = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
] as const;

/** Light, Dark or System, kept on this device. A RadioGroup: nothing goes to the server (rule 16). */
export function ThemeSwitch() {
  return <RadioGroup label="Theme" options={THEMES} value={useTheme()} onValueChange={setTheme} />;
}
