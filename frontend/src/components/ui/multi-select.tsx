import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import * as React from "react";
import { Button } from "./button";

interface MultiSelectOption {
    value: string;
    label: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
    className?: string;
}

const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
    ({ options, value, onChange, placeholder = "Select items...", className }, ref) => {
        const [isOpen, setIsOpen] = React.useState(false);
        const [searchTerm, setSearchTerm] = React.useState("");

        const filteredOptions = options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const selectedOptions = options.filter(option => value.includes(option.value));

        const handleToggle = (optionValue: string) => {
            if (value.includes(optionValue)) {
                onChange(value.filter(v => v !== optionValue));
            } else {
                onChange([...value, optionValue]);
            }
        };


        const handleClearAll = () => {
            onChange([]);
        };

        return (
            <div ref={ref} className={cn("relative", className)}>
                {/* Trigger Button */}
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="w-full justify-between"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className={selectedOptions.length === 0 ? "text-muted-foreground" : ""}>
                        {selectedOptions.length === 0
                            ? placeholder
                            : `${selectedOptions.length} selected`
                        }
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                </Button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border border-input rounded-md shadow-md">
                        {/* Search Input */}
                        <div className="p-2 border-b">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                            />
                        </div>

                        {/* Options */}
                        <div className="max-h-60 overflow-y-auto p-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-2 py-1 text-sm text-muted-foreground">
                                    No options found
                                </div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <div
                                        key={option.value}
                                        className="flex items-center space-x-2 px-2 py-1 hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-sm"
                                        onClick={() => handleToggle(option.value)}
                                    >
                                        <div className="flex items-center justify-center w-4 h-4 border border-input rounded-sm">
                                            {value.includes(option.value) && (
                                                <Check className="h-3 w-3" />
                                            )}
                                        </div>
                                        <span className="text-sm">{option.label}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {value.length > 0 && (
                            <div className="p-2 border-t">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleClearAll}
                                    className="w-full text-xs"
                                >
                                    Clear All ({value.length})
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Overlay to close dropdown */}
                {isOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </div>
        );
    }
);

MultiSelect.displayName = "MultiSelect";

export { MultiSelect, type MultiSelectOption };
