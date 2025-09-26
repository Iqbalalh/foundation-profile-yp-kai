import { SidebarProvider } from "@/components/ui/sidebar";

export default function MapLayout({ children }) {
  return (
    <>
      <SidebarProvider>{children};</SidebarProvider>
    </>
  );
}
