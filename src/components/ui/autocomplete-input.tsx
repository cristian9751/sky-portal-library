import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useId,
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
  disabled,
  ...inputProps
}: AutocompleteInputProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-options`;

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filteredOptions = useMemo(() => {
    // Modo desplegable: todas las opciones
    if (showAll) return options;

    const search = query.trim().toLocaleLowerCase();

    if (search.length < minChars) return [];

    return options
      .filter((option) => {
        const text =
          typeof option === "string" ? option : option.label;

        return text.toLocaleLowerCase().includes(search);
      })
      .slice(0, maxResults);
  }, [options, query, minChars, maxResults, showAll]);

  const isListVisible = isOpen && filteredOptions.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setShowAll(false);
        setActiveIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Mantiene visible la opción activa al navegar con el teclado
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;

    const activeItem = listRef.current.children[activeIndex] as
      | HTMLElement
      | undefined;

    activeItem?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function closeList() {
    setIsOpen(false);
    setShowAll(false);
    setActiveIndex(-1);
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const nextValue = event.target.value;

    setQuery(nextValue);
    setShowAll(false); // al escribir vuelve al filtrado normal
    setIsOpen(true);
    setActiveIndex(-1);
    onChange?.(nextValue);
  }

  function selectOption(option: AutocompleteOption) {
    const selectedValue =
      typeof option === "string" ? option : option.label;

    setQuery(selectedValue);
    closeList();

    onChange?.(selectedValue);
    onSelect?.(option);
  }

  function toggleDropdown() {
    if (disabled) return;

    if (isListVisible) {
      closeList();
      return;
    }

    setShowAll(true);
    setIsOpen(true);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);

    if (event.defaultPrevented) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();

      // Si está cerrada, la abre mostrando todas las opciones
      if (!isListVisible) {
        setShowAll(true);
        setIsOpen(true);
        setActiveIndex(-1);
        return;
      }

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
      closeList();
    }
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {label && <label htmlFor={inputId}>{label}</label>}

      <div className="relative">
        <input
          {...inputProps}
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          disabled={disabled}
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
          aria-expanded={isListVisible}
          aria-controls={listId}
          aria-activedescendant={
            isListVisible && activeIndex >= 0
              ? `${inputId}-option-${activeIndex}`
              : undefined
          }
          className={`w-full rounded-md border border-gray-300 py-2 pl-3 pr-10
            outline-none focus:border-gray-500 ${className ?? ""}`}
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          aria-label={
            isListVisible ? "Ocultar opciones" : "Mostrar opciones"
          }
          onMouseDown={(event) => event.preventDefault()}
          onClick={toggleDropdown}
          className="absolute right-0 top-0 flex h-full w-10
            items-center justify-center text-gray-500
            hover:text-gray-700 disabled:cursor-not-allowed
            disabled:opacity-50"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 transition-transform ${
              isListVisible ? "rotate-180" : ""
            }`}
          >
            <path d="M5 8l5 5 5-5" />
          </svg>
        </button>
      </div>

      {isListVisible && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          onMouseDown={(event) => event.preventDefault()}
          className="absolute left-0 top-full z-50 mt-1
            max-h-60 w-full overflow-y-auto overscroll-contain
            rounded-md border border-gray-200
            bg-muted py-1 shadow-lg"
        >
          {filteredOptions.map((option, index) => {
            const text =
              typeof option === "string" ? option : option.label;

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