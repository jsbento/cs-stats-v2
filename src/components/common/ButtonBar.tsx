import React from "react";
import { 
    HiChevronDoubleLeft,
    HiChevronDoubleRight,
    HiChevronLeft,
    HiChevronRight,
} from "react-icons/hi";
import Button from "./Button";

type ButtonBarProps = {
    page: number;
    pages: number;
    onPageChange: ( direction: "first" | "prev" | "next" | "last" ) => void;
}

const ButtonBar:React.FC<ButtonBarProps> = ({ page, pages, onPageChange }) => {
    return (
        <div className="mb-10 flex items-center justify-center gap-2">
            <Button
                variant="github"
                className={`${page === 1 ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
                handleClick={() => onPageChange("first")}
            >
                <HiChevronDoubleLeft />
            </Button>
            <Button
                variant="github"
                className={`${page === 1 ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
                handleClick={() => onPageChange("prev")}
            >
                <HiChevronLeft />
            </Button>
            <div>
                Page {page} of {pages}
            </div>
            <Button
                variant="github"
                className={`${page === pages ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
                handleClick={() => onPageChange("next")}
            >
                <HiChevronRight />
            </Button>
            <Button
                variant="github"
                className={`${page === pages ? "opacity-50 cursor-not-allowed" : "opacity-100"}`}
                handleClick={() => onPageChange("last")}
            >
                <HiChevronDoubleRight />
            </Button>
        </div>
    );
}

export default ButtonBar;