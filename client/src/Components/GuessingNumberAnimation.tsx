type Props = {
    guessingNumbers: number[];
};

export function GuessingNumberAnimation({ guessingNumbers }: Props) {
    if (!guessingNumbers || guessingNumbers.length === 0) {
        return <span className="opacity-50">—</span>;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {guessingNumbers.map((num, index) => (
                <span
                    key={`${num}-${index}`}
                    className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-base-200
            text-base-content
            font-bold
            shadow-md
            transition
            duration-300
            ease-out
            hover:scale-110
            hover:bg-primary
            hover:text-primary-content
            animate-number-pop
          "
                    style={{
                        animationDelay: `${index * 500}ms`,
                        cursor: 'pointer',

                    }}
                >
          {num}
        </span>
            ))}
        </div>
    );
}
