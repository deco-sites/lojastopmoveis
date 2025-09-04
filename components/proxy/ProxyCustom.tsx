import { useEffect } from "preact/hooks";

interface Props {
    src?: string;
}

export default function ProxyCustom({ src }: Props) {
    const searchParams =
        typeof window !== "undefined"
            ? new URLSearchParams(window.location.search)
            : null;
    const returnUrl = searchParams?.get("returnUrl");

    let finalSrc = src;
    
    if (returnUrl) {
        const joiner = src.includes("?") ? "&" : "?";
        
        finalSrc = `${src}${joiner}returnUrl=${returnUrl}`;
    }

    return (
        <iframe
            id="proxy-loader"
            style="width:100%;border:none;overflow:hidden;min-height:800px;"
            src={finalSrc}
        // onload='javascript:(function(o){o.style.height=o.contentglobalThis.window.document.body.scrollHeight+"px";}(this));'
        >
        </iframe>
    );
}
