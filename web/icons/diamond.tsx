export function DiamondIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_191_720)">
        <path
          d="M10.1334 2.5H9.86672L7.67505 6.875H12.325L10.1334 2.5Z"
          fill={props.fill || "white"}
        />
        <path
          d="M13.7168 6.875H18.0168L15.8334 2.5H11.5334L13.7168 6.875Z"
          fill={props.fill || "white"}
        />
        <path
          d="M17.8167 8.125H10.625V16.75L17.8167 8.125Z"
          fill={props.fill || "white"}
        />
        <path
          d="M9.37502 16.75V8.125H2.18335L9.37502 16.75Z"
          fill={props.fill || "white"}
        />
        <path
          d="M6.2834 6.875L8.46673 2.5H4.16673L1.9834 6.875H6.2834Z"
          fill={props.fill || "white"}
        />
      </g>
    </svg>
  );
}
