import { Toaster as Sonner } from "sonner";
import { icons } from "@/components/icons/iconMap";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <icons.approve size={16} />,
        error: <icons.reject size={16} />,
        warning: <icons.alert size={16} />,
        info: <icons.help size={16} />,
        loading: <icons.sync size={16} className="animate-spin" />,
        close: <icons.close size={12} />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
