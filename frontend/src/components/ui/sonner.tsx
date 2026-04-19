import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      style={{
        top: "calc(var(--header-height, 64px) + 1rem)",
        right: "1rem",
      }}
      duration={3000}
      closeButton={true}
      icons={{
        success: <CircleCheck className="h-4 w-4 !text-green-500" />,
        info: <Info className="h-4 w-4 !text-blue-500" />,
        warning: <TriangleAlert className="h-4 w-4 !text-yellow-500" />,
        error: <OctagonX className="h-4 w-4 !text-red-500" />,
        loading: <LoaderCircle className="h-4 w-4 animate-spin !text-blue-500" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[mounted=true]:animate-in data-[mounted=true]:slide-in-from-right-full data-[mounted=true]:fade-in duration-300",
          description: "group-[.toast]:!text-muted-foreground/90 font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
