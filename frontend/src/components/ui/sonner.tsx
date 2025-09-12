import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:backdrop-blur-sm group-[.toaster]:rounded-lg group-[.toaster]:border-l-4",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-colors",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1 group-[.toast]:text-sm group-[.toast]:font-medium group-[.toast]:transition-colors",
          success: "group-[.toaster]:border-l-blue-zone-success",
          error: "group-[.toaster]:border-l-blue-zone-error",
          warning: "group-[.toaster]:border-l-blue-zone-warning",
          info: "group-[.toaster]:border-l-blue-zone-info",
          title: "group-[.toast]:font-semibold group-[.toast]:text-card-foreground group-[.toast]:text-base",
          closeButton: "group-[.toast]:text-muted-foreground group-[.toast]:hover:text-card-foreground group-[.toast]:transition-colors",
        },
      }}
      position="top-right"
      expand={true}
      richColors={true}
      {...props}
    />
  )
}

export { Toaster }
