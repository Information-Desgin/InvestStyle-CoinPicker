import clsx from "clsx";

type ToggleBtnProps<T extends string> =
  | {
      options: readonly T[];
      value: T;
      onChange: (value: T) => void;
      multiple?: false;
      className?: string;
    }
  | {
      options: readonly T[];
      value: T[];
      onChange: (value: T[]) => void;
      multiple: true;
      className?: string;
    };

export default function ToggleBtn<T extends string>(props: ToggleBtnProps<T>) {
  const { options, className } = props;
  const isMultiple = props.multiple === true;

  const isActive = (option: T) =>
    isMultiple ? props.value.includes(option) : props.value === option;

  const handleClick = (option: T) => {
    if (!isMultiple) {
      props.onChange(option);
      return;
    }

    const current = props.value;
    props.onChange(
      current.includes(option)
        ? current.filter((v) => v !== option)
        : [...current, option]
    );
  };

  return (
    <div
      className={clsx(
        "flex h-[25px] rounded-[4px] border border-[#3a4652] bg-box-default absolute top-4 right-4 z-10",
        className
      )}
    >
      {options.map((option, idx) => {
        const active = isActive(option);

        return (
          <button
            key={option}
            onClick={() => handleClick(option)}
            className={clsx(
              "w-[70px] h-full font-toggle-bold transition-colors",
              "flex items-center justify-center cursor-pointer",
              idx !== options.length - 1 && "border-r border-box-clicked",
              active
                ? "bg-box-clicked text-white border-2 border-point"
                : "text-sub-text"
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
