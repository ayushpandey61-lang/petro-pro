import React, { useState, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parse, isValid } from 'date-fns';

const DatePicker = ({ value, onChange, className, buttonClassName, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

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
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  const handleInputBlur = () => {
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
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={cn("relative w-full", className)}>
            <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                placeholder="DD-MM-YYYY"
                className={cn("pr-10", buttonClassName)}
                onFocus={() => setIsOpen(true)}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                <CalendarIcon className="h-4 w-4" />
            </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };