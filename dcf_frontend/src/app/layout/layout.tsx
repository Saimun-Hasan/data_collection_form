import { useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

// --------------------------Layout---------------------------- //

export default function Layout({ children }: { children: React.ReactNode }) {
    const location = useLocation();
    const paths = location.pathname.split("/").filter(Boolean);

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {/* Header with Breadcrumbs */}
                <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {paths.map((path, index) => (
                                <BreadcrumbItem key={index} className="hidden md:block">
                                    <BreadcrumbLink href={`/${paths.slice(0, index + 1).join("/")}`}>
                                        {path}
                                    </BreadcrumbLink>
                                    {index < paths.length - 1 && <BreadcrumbSeparator className="hidden md:block" />}
                                </BreadcrumbItem>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
