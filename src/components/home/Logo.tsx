import Image from "next/image";

export default function Logo() {
  return (
    <div className="mb-6 flex justify-center">
      <Image
        src="/images/logo/atlas-master-logo.png"
        alt="Atlas Master"
        width={180}
        height={180}
        priority
        className="h-auto w-36 sm:w-40 md:w-44 lg:w-48"
      />
    </div>
  );
}