import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  facebookLink?: string;
}

function Facebook({ facebookLink }: Props) {
  if (!facebookLink) {
    return null;
  }

  return (
    <a
      href={`${facebookLink}`}
      class="fixed w-[40px] h-[40px] bottom-[80px] right-[30px] rounded-full z-40 flex items-center justify-center"
      aria-label="Facebook link"
      target="blank"
    >
      <button
        class="text-white p-2 rounded-full w-[40px] h-[40px]"
        aria-label="Facebook link"
      >
        <Icon id="newFacebook" size={40} stroke="0.01" />
      </button>
    </a>
  );
}

export default Facebook;