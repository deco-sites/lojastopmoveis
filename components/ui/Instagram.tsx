import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  instagramLink?: string;
}

function WhatsApp({ instagramLink }: Props) {
  if (!instagramLink) {
    return null;
  }

  return (
    <a
      href={`${instagramLink}`}
      class="fixed w-[55px] h-[55px] bottom-[70px] right-[22px] rounded-full z-40 bg-[limegreen] flex items-center justify-center"
      aria-label="Chat on WhatsApp"
      target="blank"
    >
      <button
        class="bg-[#45D268] text-white p-2 rounded-full shadow-lg"
        aria-label="Chat on WhatsApp"
      >
        <Icon id="WhatsApp" size={32} stroke="0.01" />
      </button>
    </a>
  );
}

export default WhatsApp;