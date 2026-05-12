import { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
};

export function PageContainer({ children }: PageContainerProps) {
  return <div className="flex h-full min-h-0 flex-col">{children}</div>;
}
