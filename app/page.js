import Dropzone from "@/app/component/dropzone";

export default function Home() {
  return (
    <div className="w-full h-dvh p-5 overflow-hidden">
      <div className="w-full h-full p-4 rounded-2xl bg-zinc-100">
        <Dropzone />
      </div>
    </div>
  );
}
