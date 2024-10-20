import dynamic from "next/dynamic";
import { UploadCloud } from "lucide-react";

const Dropzone = dynamic(() => import("react-dropzone"), { ssr: false });

const index = ({ handleDropFile }) => {
  return (
    <Dropzone onDrop={handleDropFile}>
      {({ getRootProps, getInputProps }) => (
        <div
          {...getRootProps()}
          className="w-full py-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-y-2 cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="w-max p-2 rounded-lg border aspect-auto shadow-md bg-white">
            <UploadCloud />
          </div>
          <h3 className="w-full max-w-48 text-center text-black font-semibold">
            Drag & Drop or <span className="text-blue-600">Choose file</span> to
            upload
          </h3>
        </div>
      )}
    </Dropzone>
  );
};

export default index;
