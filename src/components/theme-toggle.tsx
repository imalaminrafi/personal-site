import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        if (theme === "dark") {
            setTheme("light");
        } else {
            setTheme("dark");
        }
    };

    const getIcon = () => {
        if (theme === "dark") {
            return <Sun className="h-5 w-5" />;
        }
        return <Moon className="h-5 w-5" />;
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="rounded-lg"
        >
            {getIcon()}
        </Button>
    );
}
