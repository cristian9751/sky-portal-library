import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
} from "react";

type AutocompleteOption =
  | string
  | {
      label: string;
      value?: string;
    };

interface AutocompleteInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onSelect"
  > {
  label?: string;
  options?: AutocompleteOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: AutocompleteOption) => void;
  minChars?: number;
  maxResults?: number;
}

export default function AutocompleteInput({
  label,
  placeholder = "Escribe para buscar...",
  options = [],
  value = "",
  onChange,
  onSelect,
  minChars = 1,
  maxResults = 8,
  className,
  id,
  onFocus,
  onBlur,
  onKeyDown,
  ...inputProps
}: AutocompleteInputProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputId = id ?? React.useId();
  const listId = `${inputId}-options`;

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    const search = query.trim().toLocaleLowerCase();

    if (search.length < minChars) return [];

    return options
      .filter((option) => {
        const text =
          typeof option === "string"
            ? option
            : option.label;

        return text.toLocaleLowerCase().includes(search);
      })
      .slice(0, maxResults);
  }, [options, query, minChars, maxResults]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const nextValue = event.target.value;

    setQuery(nextValue);
    setIsOpen(true);
    setActiveIndex(-1);
    onChange?.(nextValue);
  }

  function selectOption(option: AutocompleteOption) {
    const selectedValue =
      typeof option === "string"
        ? option
        : option.label;

    setQuery(selectedValue);
    setIsOpen(false);
    setActiveIndex(-1);

    onChange?.(selectedValue);
    onSelect?.(option);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (event.key === "ArrowDown" && filteredOptions.length) {
      event.preventDefault();
      setIsOpen(true);

      setActiveIndex((index) =>
        index < filteredOptions.length - 1 ? index + 1 : 0
      );
    }

    if (event.key === "ArrowUp" && filteredOptions.length) {
      event.preventDefault();

      setActiveIndex((index) =>
        index > 0 ? index - 1 : filteredOptions.length - 1
      );
    }

    if (event.key === "Enter" && activeIndex >= 0) {
      const option = filteredOptions[activeIndex];

      if (option !== undefined && isOpen) {
        event.preventDefault();
        selectOption(option);
      }
    }

    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label htmlFor={inputId}>
          {label}
        </label>
      )}

      <input
        {...inputProps}
        id={inputId}
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={(event) => {
          onFocus?.(event);
          setIsOpen(true);
        }}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && filteredOptions.length > 0}
        aria-controls={listId}
        aria-activedescendant={
          isOpen && activeIndex >= 0
            ? `${inputId}-option-${activeIndex}`
            : undefined
        }
        className={className}
      />

      {isOpen && filteredOptions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1
            max-h-64 w-full overflow-y-auto
            rounded-md border border-gray-200
            bg-muted py-1 shadow-lg"
        >
          {filteredOptions.map((option, index) => {
            const text =
              typeof option === "string"
                ? option
                : option.label;

            const key =
              typeof option === "string"
                ? option
                : option.value ?? text;

            return (
              <li
                key={key}
                id={`${inputId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}
                className={`cursor-pointer px-3 py-2 ${
                  index === activeIndex
                    ? "bg-gray-250"
                    : "hover:bg-gray-500"
                }`}
              >
                {text}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}