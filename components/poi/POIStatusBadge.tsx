// components/poi/POIStatusBadge.tsx

import { POIStatus } from "@/types";
import { POI_STATUS_CONFIG } from "@/constants/poiConstants";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

interface POIStatusBadgeProps {
  status: POIStatus;
  showIcon?: boolean;
  showDescription?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const STATUS_ICONS = {
  submitted: Clock,
  validated: CheckCircle2,
  rejected: XCircle,
};

const SIZE_CLASSES = {
  sm: {
    badge: "px-2 py-0.5 text-[10px]",
    icon: 10,
  },
  md: {
    badge: "px-3 py-1 text-xs",
    icon: 12,
  },
  lg: {
    badge: "px-4 py-1.5 text-sm",
    icon: 14,
  },
};

export const POIStatusBadge = ({
  status,
  showIcon = true,
  showDescription = false,
  size = "md",
  className,
}: POIStatusBadgeProps) => {
  const config = POI_STATUS_CONFIG[status];
  const Icon = STATUS_ICONS[status];
  const sizeConfig = SIZE_CLASSES[size];

  return (
    <div className={clsx("inline-flex flex-col gap-1", className)}>
      <div
        className={clsx(
          "inline-flex items-center gap-1.5 rounded-full font-bold w-fit",
          sizeConfig.badge
        )}
        style={{
          color: config.color,
          backgroundColor: config.bgColor,
        }}
      >
        {showIcon && <Icon size={sizeConfig.icon} />}
        <span>{config.label}</span>
      </div>

      {showDescription && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {config.description}
        </p>
      )}
    </div>
  );
};