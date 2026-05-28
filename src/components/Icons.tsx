/**
 * Inline SVG icons used across the UI.
 *
 * All paths are sourced from FontAwesome Free 6 (CC BY 4.0). Inlining them
 * replaces the render-blocking external FontAwesome CSS bundle (~70 KB +
 * webfont) with ~5 KB of tree-shakable JSX, which significantly improves
 * mobile LCP.
 */

import type { CSSProperties, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}

const baseProps = (size: number | string, viewBox: string): SVGProps<SVGSVGElement> => ({
  xmlns: "http://www.w3.org/2000/svg",
  viewBox,
  width: size,
  height: size,
  fill: "currentColor",
  "aria-hidden": true,
});

export const CheckCircleIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 512 512")} {...rest}>
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
  </svg>
);

export const CircleIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 512 512")} {...rest}>
    <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256z" />
  </svg>
);

export const ExclamationCircleIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 512 512")} {...rest}>
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24l0 112c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-112c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
  </svg>
);

export const CloudUploadIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 640 512")} {...rest}>
    <path d="M0 336c0 79.5 64.5 144 144 144l368 0c70.7 0 128-57.3 128-128c0-61.9-44-113.6-102.4-125.4c4.1-10.7 6.4-22.4 6.4-34.6c0-53-43-96-96-96c-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32C167.6 32 96 103.6 96 192c0 2.7 .1 5.4 .2 8.1C40.2 219.8 0 273.2 0 336zm240-80l0-119c0-9 7-16 16-16s16 7 16 16l0 119 47 0c9 0 16 7 16 16c0 4.2-1.6 8.3-4.7 11.3l-63 64c-3 3-7 4.7-11.3 4.7s-8.3-1.7-11.3-4.7l-63-64c-3-3-4.7-7.1-4.7-11.3c0-9 7-16 16-16l47 0z" />
  </svg>
);

export const DownloadIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 512 512")} {...rest}>
    <path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" />
  </svg>
);

export const VideoIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 576 512")} {...rest}>
    <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z" />
  </svg>
);

export const EnvelopeIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 512 512")} {...rest}>
    <path d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1 464 128c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z" />
  </svg>
);

export const FileArchiveIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 384 512")} {...rest}>
    <path d="M64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zM96 48l96 0 0 16-96 0 0-16zm0 32l96 0 0 16-96 0 0-16zm0 32l96 0 0 16-96 0 0-16zm56 80l-16 0c-13.3 0-24-10.7-24-24c0-13.3 10.7-24 24-24l16 0c13.3 0 24 10.7 24 24c0 13.3-10.7 24-24 24z" />
  </svg>
);

export const StreamIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 512 512")} {...rest}>
    <path d="M64 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L64 224zm384 160L64 384c-17.7 0-32 14.3-32 32s14.3 32 32 32l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32z" />
  </svg>
);

export const RedoIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 512 512")} {...rest}>
    <path d="M386.3 160L336 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l128 0c17.7 0 32-14.3 32-32L496 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" />
  </svg>
);

export const PaypalIcon = ({ size = "1em", ...rest }: IconProps) => (
  <svg {...baseProps(size, "0 0 384 512")} {...rest}>
    <path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.2-2.5-1.8-3 1.2-2 11.1-5 22.1-8.8 32.9-39.1 113.4-150.5 84.4-178.3 84.4-15.1 0-27.4 12.3-27.4 27.4 0 .8 0 1.5 .2 2.3 12.2 75.4 47.6 91.6 113.4 91.6 80.3 0 137.6-37.6 142.4-119.4 .8-13.7 1.5-26.4-1.5-39.8z" />
  </svg>
);
