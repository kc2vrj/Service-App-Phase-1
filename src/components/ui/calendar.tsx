import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from 'react-day-picker';

export default function Calendar() {
  const [selected, setSelected] = useState<Date | undefined>();

  return (
    <div className="p-4">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        showOutsideDays={true}
        className="p-3"
        classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-gray-400 rounded-md w-9 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "h-9 w-9 text-center text-sm p-0 relative",
          day: "h-9 w-9 p-0 font-normal",
          day_selected: "bg-blue-500 text-white hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white",
          day_today: "bg-orange-500 text-white",
          day_outside: "text-gray-400 opacity-50",
          day_disabled: "text-gray-400 opacity-50",
          day_hidden: "invisible",
        }}
        components={{
          //leftIcon: () => <ChevronLeft className="h-4 w-4" />,
          //rightIcon: () => <ChevronRight className="h-4 w-4" />
        }}
      />
    </div>
  )
}