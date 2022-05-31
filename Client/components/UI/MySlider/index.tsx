import { Slider } from "@mui/material";

import { Dispatch, SetStateAction, useState } from "react";

function valueLabelFormat(value) {
    return `${`0${value}`.slice(-2)}:00`;
}

interface MySliderProps {
    value: number[];
    setValue: Dispatch<SetStateAction<number[]>>;
}

const MySlider = ({ value, setValue }: MySliderProps) => {
    const minDistance = 1;

    const handleChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setValue([Math.min(newValue[0], value[1] - minDistance), value[1]]);
        } else {
            setValue([value[0], Math.max(newValue[1], value[0] + minDistance)]);
        }
    };

    return (
        <Slider
            value={value}
            min={0}
            step={1}
            max={23}
            getAriaValueText={valueLabelFormat}
            valueLabelFormat={valueLabelFormat}
            onChange={handleChange}
            valueLabelDisplay="on"
            aria-labelledby="non-linear-slider"
            disableSwap
            sx={{
                width: "100%",
                height: "20px",
                borderRadius: "4px",
                color: "#3e497a",
                "& .MuiSlider-rail": {
                    color: "#EBEBEC",
                    opacity: 1,
                },
                "& .MuiSlider-thumb": {
                    border: "2px solid #3e497a",
                    borderRadius: "4px",
                    color: "#fff",
                    "&:before": { boxShadow: "none" },
                    "&:last-child": {
                        "& .MuiSlider-valueLabel": {
                            top: 55,
                        },
                    },
                },
                "& .MuiSlider-valueLabel": {
                    backgroundColor: "#131a46",
                    fontFamily: "Rubik",
                    "&:before": { display: "none" },
                },
            }}
        />
    );
};

export { MySlider };
