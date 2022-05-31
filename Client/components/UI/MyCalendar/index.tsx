import "@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "@hassanmojab/react-modern-calendar-datepicker";
import { Dispatch, SetStateAction } from "react";

interface MyCalendarProps {
    value: {
        year: number;
        month: number;
        day: number;
    };
    setValue: Dispatch<
        SetStateAction<{
            year: number;
            month: number;
            day: number;
        }>
    >;
}

const MyCalendar = ({ value, setValue }: MyCalendarProps) => {
    const today = new Date();

    const setCheckedDate = (newDate: { year: number; month: number; day: number }) => {
        if (
            (((newDate.day >= today.getDate() && newDate.month === today.getMonth() + 1) || newDate.month > today.getMonth() + 1) &&
                newDate.year >= today.getFullYear()) ||
            newDate.year > today.getFullYear()
        )
            setValue(newDate);
    };

    return (
        <>
            <Calendar
                value={value}
                onChange={setCheckedDate}
                colorPrimary="#3e497a"
                shouldHighlightWeekends
                slideAnimationDuration="0.2s"
            />
            <style global jsx>
                {`
                    .Calendar {
                        width: 100%;
                        box-shadow: none;
                        border: 1px solid #a9a9a9;
                    }
                    .Calendar * {
                        transition: unset !important;
                    }
                `}
            </style>
        </>
    );
};

export { MyCalendar };
