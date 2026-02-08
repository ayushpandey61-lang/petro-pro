import React, { useState, useEffect, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parse, isValid } from 'date-fns';

const DatePicker = ({ value, onChange, className, buttonClassName, placeholder = "DD-MM-YYYY", ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (value && isValid(new Date(value))) {
      setInputValue(format(new Date(value), 'dd-MM-yyyy'));
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleSelect = (date) => {
    if (onChange) {
      onChange(date);
    }
    // Auto-close with a slight delay for better UX
    setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    const parsedDate = parse(inputValue, 'dd-MM-yyyy', new Date());
    if (isValid(parsedDate)) {
      if (onChange) {
        onChange(parsedDate);
      }
    } else {
      if (value && isValid(new Date(value))) {
        setInputValue(format(new Date(value), 'dd-MM-yyyy'));
      } else {
        setInputValue('');
      }
    }
  };

  const handleContainerClick = () => {
    setIsOpen(true);
    setIsFocused(true);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            "relative w-full group cursor-pointer",
            isFocused && "ring-2 ring-blue-500 ring-offset-2",
            className
          )}
          onClick={handleContainerClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="button"
          aria-label="Open calendar"
        >
            <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                className={cn(
                  "pr-12 cursor-pointer transition-all duration-200",
                  "hover:bg-gray-50 focus:bg-white",
                  "border-2 hover:border-blue-300 focus:border-blue-500",
                  isFocused && "border-blue-500 bg-white",
                  buttonClassName
                )}
                readOnly={false}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8",
                  "hover:bg-blue-100 hover:text-blue-600",
                  "transition-all duration-200",
                  "opacity-70 group-hover:opacity-100",
                  isFocused && "opacity-100 bg-blue-50 text-blue-600"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen((prev) => !prev);
                }}
            >
                <CalendarIcon className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "scale-110"
                )} />
            </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "w-auto p-0 shadow-lg border-2",
          "animate-in fade-in-0 zoom-in-95",
          "transition-all duration-200"
        )}
        align="start"
        sideOffset={4}
      >
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
          className="rounded-md"
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };