import { useSignal, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface Props {
    timeDate: string;
    timeHour: string;
    frameColor: string;
    textColor: string;
    numberColor: string;
}

interface CardNumberProps {
    decimal: string;
    unit: string;
    flag: string;
    frameColor: string;
    textColor: string;
    numberColor: string;
}

const CardNumber = ({ decimal, unit, flag, frameColor, textColor, numberColor }:CardNumberProps)=> {
    return(
        <div className="flex flex-col items-center justify-center gap-[9px]">
            <div className="flex flex-row items-center justify-center gap-[2px]">
                <div className="rounded-md px-[10px] lg:py-[18px] md:px-[15px]" style={{ backgroundColor: frameColor }}>
                    <span style={{ color: numberColor }} className="font-bold text-[20px] lg:text-[28px] uppercase not-italic">{decimal}</span>
                </div>
                <div className="rounded-md px-[10px] lg:py-[18px] md:px-[15px]" style={{ backgroundColor: frameColor }}>
                    <span style={{ color: numberColor }} className="font-bold text-[20px] lg:text-[28px] uppercase not-italic">{unit}</span>
                </div>
            </div>
            <span className="font-normal text-[12px] lg:text-sm text-center" style={{ color: textColor }}>{flag}</span>
        </div>
    );
}

const CountdownTimer = ({ timeDate, timeHour, frameColor, textColor, numberColor }: Props) => {
    const targetTime = new Date(`${timeDate}T${timeHour}`).getTime();
    const now = useSignal(Date.now());
    
    useEffect(() => {
        const interval = setInterval(() => {
            now.value = Date.now();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeRemaining = useComputed(() => {
        const distance = targetTime - now.value;

        if (distance < 0) return null;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return {
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0'),
        };
    });

    if (!timeRemaining.value) {
        return null;
    }

    const { days, hours, minutes, seconds } = timeRemaining.value;

    return (
        <div className="flex flex-row justify-center gap-[14px] mt-[10px] lg:mt-5 ">
            <CardNumber numberColor={numberColor} textColor={textColor} frameColor={frameColor} decimal={days[0]} unit={days[1]} flag="Dias" />
            <CardNumber numberColor={numberColor} textColor={textColor} frameColor={frameColor} decimal={hours[0]} unit={hours[1]} flag="Horas" />
            <CardNumber numberColor={numberColor} textColor={textColor} frameColor={frameColor} decimal={minutes[0]} unit={minutes[1]} flag="Minutos" />
            <CardNumber numberColor={numberColor} textColor={textColor} frameColor={frameColor} decimal={seconds[0]} unit={seconds[1]} flag="Segundos" />
        </div>
    );
}

export default CountdownTimer;