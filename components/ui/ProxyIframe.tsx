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

export default function ProxyIframe({ src }: Props) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(${runOnMount})();` }}>
      </script>
      <iframe
        id="proxy-loader"
        style="width:100%;border:none;overflow:hidden;min-height:800px;"
        src={src}
        // onload='javascript:(function(o){o.style.height=o.contentglobalThis.window.document.body.scrollHeight+"px";}(this));'
      >
      </iframe>
    </>
  );
}
