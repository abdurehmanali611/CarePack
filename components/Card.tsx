import clsx from "clsx";
import Image from "next/image";

interface propTypes {
  type: "Scheduled" | "Pending" | "Cancelled" | "Treated";
  count: number;
  label: string;
  icon: string;
}
const Card = ({ type, count, label, icon }: propTypes) => {
  return (
    <div
      className={clsx(
        "flex flex-1 flex-col gap-6 rounded-2xl bg-cover p-3 shadow-lg mx-3",
        {
          "bg-[url('/assets/appointments-bg.png')]": type === "Scheduled" || type == "Treated",
          "bg-[url('/assets/pending-bg.png')]": type == "Pending",
          "bg-[url('/assets/cancelled-bg.png')]": type == "Cancelled",
        }
      )}>
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={label}
          width={32}
          height={32}
          loading="eager"
          className="size-8 w-fit"
        />
        <h2 className="text-lg font-bold text-white">{count}</h2>
      </div>
      <p className="text-lg">{label}</p>
    </div>
  );
};

export default Card;
