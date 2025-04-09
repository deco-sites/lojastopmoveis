import Icon from "$store/components/ui/Icon.tsx";

export interface Props {
  phone?: number;
}

function WhatsApp({ phone }: Props) {
  if (!phone) {
    return null;
  }

  return (
    <a
      href={`https://api.whatsapp.com/send/?phone=${phone}&text&type=phone_number&app_absent=0`}
      class="fixed w-[40px] h-[40px] bottom-[175px] right-[30px] rounded-full z-40  flex items-center justify-center"
      aria-label="Chat on WhatsApp"
      target="blank"
    >
      <button
        class=" text-white p-2 rounded-full  w-[40px] h-[40px]"
        aria-label="Chat on WhatsApp"
      >
        <Icon id="newWhatsApp" size={40} stroke="0.01" />
      </button>
    </a>
  );
}

export default WhatsApp;
