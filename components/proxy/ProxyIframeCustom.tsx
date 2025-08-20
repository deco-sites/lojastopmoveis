import ProxyCustom from "$store/islands/ProxyCustom.tsx";

interface Props {
  src?: string;
}

const runOnMount = () => {
    globalThis.window.onload = () => {
        const iFrame = document.getElementById(
            "proxy-loader",
        ) as HTMLIFrameElement;
        if (!iFrame) {
            return console.error("Couldn't find iframe");
        }
        iFrame.height = `${iFrame.contentWindow?.document.body.scrollHeight}`;
    };
};

export default function ProxyIframeCustom({ src }: Props) {
  return ( 
    <ProxyCustom src={src} runOnMount={runOnMount} />
  );
}
