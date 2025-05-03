import * as React from "react";
import { IconSvgProps } from "@/types";
import { FAIcon, FontAwesomeIconProps } from "./fa-icon";

// Importações do Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
// Importação de ícones sólidos
import {
  faHouse,
  faMagnifyingGlass,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faRightFromBracket,
  faBars,
  faCheck,
  faArrowsRotate,
  faSun,
  faMoon,
  faListCheck,
  faChevronDown,
  faChevronUp,
  faGear,
  faCircleUser,
  faStar,
  faBell,
  faTrash,
  faCheckDouble,
  faTrashArrowUp,
  faCircleExclamation,
  faCircleCheck,
  faCalendar,
  faPencil,
  faPlus,
  faFilter,
  faChartSimple,
  faLayerGroup,
  faChartPie,
  faTrophy,
  faList,
  faCircleXmark,
  faCirclePlus,
  faCircleInfo,
  faFile,
  faFileExport,
  faFileImport,
  faPen,
  faTriangleExclamation,
  faFire,
  faClipboard,
  faAlignLeft,
  faDownload,
  faChartBar,
  faFolder,
  faCalendarDay,
  faCalendarWeek,
  faFlag,
  faTag,
  faSort,
  faSortUp,
  faSortDown,
  faNoteSticky,
  faEllipsisVertical,
  faClock
} from '@fortawesome/free-solid-svg-icons';

// Importação de ícones de marcas
import {
  faDiscord,
  faGoogle,
  faFacebook,
  faFacebookF,
  faLinkedin,
  faLinkedinIn,
  faTwitter,
  faGithub
} from '@fortawesome/free-brands-svg-icons';

// Importação de ícones regulares (outline)
import {
  faCircle as faRegularCircle,
  faStar as faRegularStar
} from '@fortawesome/free-regular-svg-icons';

// Adiciona os ícones à biblioteca para uso global
library.add(
  // Ícones sólidos
  faHouse,
  faMagnifyingGlass,
  faXmark,
  faChevronLeft,
  faChevronRight,
  faRightFromBracket,
  faBars,
  faCheck,
  faArrowsRotate,
  faSun,
  faMoon,
  faListCheck,
  faChevronDown,
  faChevronUp,
  faGear,
  faCircleUser,
  faStar,
  faBell,
  faTrash,
  faCheckDouble,
  faTrashArrowUp,
  faCircleExclamation,
  faCircleCheck,
  faCalendar,
  faPencil,
  faPlus,
  faFilter,
  faChartSimple,
  faLayerGroup,
  faChartPie,
  faTrophy,
  faList,
  faCircleXmark,
  faCirclePlus,
  faCircleInfo,
  faFile,
  faFileExport,
  faFileImport,
  faPen,
  faTriangleExclamation,
  faFire,
  faClipboard,
  faAlignLeft,
  faDownload,
  faChartBar,
  faFolder,
  faCalendarDay,
  faCalendarWeek,
  faFlag,
  faTag,
  faSort,
  faSortUp,
  faSortDown,
  faNoteSticky,
  faEllipsisVertical,
  faClock,

  // Ícones de marcas
  faDiscord,
  faGoogle,
  faFacebook,
  faFacebookF,
  faLinkedin,
  faLinkedinIn,
  faTwitter,
  faGithub,

  // Ícones regulares
  faRegularCircle,
  faRegularStar
);

// Logo original mantida como estava
export const Logo: React.FC<IconSvgProps> = ({
  size = 36,
  width,
  height,
  color = "currentColor",
  ...props
}) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill={color} height={size || height} viewBox="0 0 32 32" width={size || width} {...props}>
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

// Componentes de ícone substituídos por Font Awesome
// Ícones de redes sociais (marcas)
export const DiscordIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon={["fab", "discord"]} {...props} />;
export const GoogleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon={["fab", "google"]} {...props} />;
export const FacebookIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon={["fab", "facebook-f"]} {...props} />;
export const LinkedInIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon={["fab", "linkedin-in"]} {...props} />;
export const TwitterIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon={["fab", "twitter"]} {...props} />;
export const GithubIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon={["fab", "github"]} {...props} />;

// Ícones regulares (sólidos)
export const SearchIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="magnifying-glass" {...props} />;
export const CloseIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="xmark" {...props} />;
export const ArrowLeftIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chevron-left" {...props} />;
export const HomeIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="house" {...props} />;
export const BackIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chevron-left" {...props} />;
export const LogoutIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="right-from-bracket" {...props} />;
export const MenuIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="bars" {...props} />;
export const ChevronLeftIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chevron-left" {...props} />;
export const ChevronRightIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chevron-right" {...props} />;
export const CheckIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="check" {...props} />;
export const RefreshIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="arrows-rotate" {...props} />;
export const SunFilledIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="sun" {...props} />;
export const MoonFilledIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="moon" {...props} />;
export const ListCheckIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="list-check" {...props} />;
export const ChevronDownIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chevron-down" {...props} />;
export const ChevronUpIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chevron-up" {...props} />;
export const SettingsIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="gear" {...props} />;
export const CircleUserIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="circle-user" {...props} />;
export const StarIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="star" {...props} />;
export const BellIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="bell" {...props} />;
export const TrashIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="trash" {...props} />;
export const CheckDoubleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="check-double" {...props} />;
export const TrashArrowUpIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="trash-arrow-up" {...props} />;
export const CircleExclamationIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="circle-exclamation" {...props} />;
export const CheckCircleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="circle-check" {...props} />;
export const CalendarIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="calendar" {...props} />;
export const PencilIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="pencil" {...props} />;
export const PlusIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="plus" {...props} />;
export const FilterIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="filter" {...props} />;
export const AnalyticsIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chart-simple" {...props} />;
export const ProjectsIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="layer-group" {...props} />;
export const NotificationIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="bell" {...props} />;
export const AlarmIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="bell" {...props} />;
export const TaskIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="list-check" {...props} />;
export const SystemUpdateIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="arrows-rotate" {...props} />;
export const MoreVerticalIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="ellipsis-vertical" {...props} />;
export const ClockIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="clock" {...props} />;
export const CalendarDayIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="calendar-day" {...props} />;
export const CalendarWeekIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="calendar-week" {...props} />;
export const FlagIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="flag" {...props} />;
export const TagIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="tag" {...props} />;
export const SortIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="sort" {...props} />;
export const SortUpIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="sort-up" {...props} />;
export const SortDownIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="sort-down" {...props} />;
export const NoteStickyIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="note-sticky" {...props} />;
export const DownloadIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="download" {...props} />;
export const ChartBarIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chart-bar" {...props} />;
export const FolderIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="folder" {...props} />;
export const ChartPieIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="chart-pie" {...props} />;
export const TrophyIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="trophy" {...props} />;
export const ListIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="list" {...props} />;
export const XIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="xmark" {...props} />;
export const PlusCircleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="circle-plus" {...props} />;
export const InfoCircleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="circle-info" {...props} />;
export const FileIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="file" {...props} />;
export const FileExportIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="file-export" {...props} />;
export const FileImportIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="file-import" {...props} />;
export const PenIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="pen" {...props} />;
export const AlertTriangleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="triangle-exclamation" {...props} />;
export const AlertCircleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="circle-exclamation" {...props} />;
export const FireIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="fire" {...props} />;
export const ClipboardIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="clipboard" {...props} />;
export const XCircleIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="circle-xmark" {...props} />;
export const AlignLeftIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="align-left" {...props} />;
export const StarFilledIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon="star" {...props} />;

// Ícones regulares (outline)
export const StarOutlineIcon: React.FC<IconSvgProps> = (props) => <FAIcon icon={["far", "star"]} {...props} />;