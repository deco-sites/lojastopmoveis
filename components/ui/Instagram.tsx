import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  instagramLink?: string;
}


function Instagram({ instagramLink }: Props) {
  if (!instagramLink) {
    return null;
  }

  return (
    <a
      href={`${instagramLink}`}
      class="fixed w-[40px] h-[40px] bottom-[120px] right-[22px] rounded-full z-40 flex items-center justify-center bg-[url(/arquivos/instagram.png)] bg-contain"
      aria-label="Instagram link"
      target="blank"
    >
      <button
        class="text-white p-2 rounded-full w-[40px] h-[40px]"
        aria-label="Instagram link"
      >
      </button>
    </a>
  );
}

export default Instagram;