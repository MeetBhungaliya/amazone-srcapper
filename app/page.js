"use client";

import Dropzone from "@/app/component/dropzone";
import Products from "./component/products";
import { useState } from "react";
import readExcel from "./actions/readExcel";
import axios from "axios";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState(null);

  const handleDropFile = async (acceptedFiles, fileRejections) => {
    if (fileRejections.length) return "File is not supported";

    const excel = await readExcel(acceptedFiles[0]);
    const { data } = await axios.post("/api/scrap_product_info", {
      asin: excel.map((data) => data.ASIN),
    });
    setData(data);
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Product image",
      cell: (props) => (
        <Image
          width={200}
          height={200}
          className=" min-w-20 aspect-square object-cover"
          alt={props.getValue()}
          src={props.getValue()}
        />
      ),
    },
    {
      accessorKey: "url",
      header: "URL",
      cell: (props) => (
        <a
          target="_blank"
          href={props.getValue()}
          className="text-blue-600 font-semibold"
        >
          Go to amazone
        </a>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
  ];

  return (
    <div className="w-full h-dvh p-5 overflow-hidden">
      <div className="w-full h-full p-4 flex flex-col gap-y-10 rounded-2xl bg-zinc-100 overflow-hidden">
        <Dropzone handleDropFile={handleDropFile} />
        <Products data={data} columns={columns} />
      </div>
    </div>
  );
}
