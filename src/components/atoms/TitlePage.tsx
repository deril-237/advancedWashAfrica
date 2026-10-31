import { ReactNode } from "react";

type TitleProps = {
  title: string;
  description: string;
  icon: ReactNode;
};

export function TitlePage({ title, description, icon }: TitleProps) {
  return (
    <div className="font-sans flex items-start gap-4 mb-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-sans font-semibold text-base-content capitalize">
          {title}
        </h1>
        <p className="text-sm text-base-content/60 mt-1">{description}</p>
      </div>
    </div>
  );
}
