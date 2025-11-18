import {useState} from "react";
import Navbar from "./Navbar";


export function Board() {

    const [selected, setSelected] = useState<number[]>([]);

    function toggle(n: number) {
        setSelected(prev =>
            prev.includes(n)
                ? prev.filter(x => x !== n)
                : [...prev, n]
        );
    }

    return (
        <>
            <Navbar title="Board" />
            <div className="week-label flex justify-center text-3xl font-bold m-5">
                Week <span className="ml-2">43</span>
            </div>
            <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 16 }, (_, i) => {
                        const n = i + 1;
                        const isSelected = selected.includes(n);

                        return (
                            <div
                                key={n}
                                onClick={() => toggle(n)}
                                className={
                                    "flex items-center justify-center border border-gray-400 " +
                                    "w-24 h-24 text-xl leading-none box-border cursor-pointer " +
                                    (isSelected ? "bg-base-300" : "bg-base-100 hover:bg-base-200")
                                }
                            >
                                {n}
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-center mt-5 btn-xl">
                <button className="btn btn-soft m-5 rounded-xl">Submit</button>
            </div>
        </>
    );
}
