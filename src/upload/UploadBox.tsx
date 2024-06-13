'use client'

import {AiOutlineCheckCircle, AiOutlineCloudUpload} from "react-icons/ai";
import {MdClear} from "react-icons/md";
import {DragEventHandler, ReactNode, useEffect, useState} from "react";
import axios, {AxiosHeaders, AxiosProgressEvent} from "axios";

interface Props {
    styles: {
        container?: string,

    }
    general: {
        uploadIcon?: ReactNode,
        content?: ReactNode,
    }
    files: {
        multiple?: boolean,
        accepted?: string[],
        maxSize?: number,
        maxFiles?: number,
    }
    upload: {
        link?: string,
        headers?: AxiosHeaders,
        cors?: RequestMode,
        method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS",
    }
    functions: {
        onFinish?: any,
        onError?: any,
    }
}

export default function UploadBox(props: Props) {
    const {
        functions, upload,files, general, styles
    } = props

    const [inMemoryFiles, setInMemoryFiles] = useState<File[]>([]);

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles: File[] = selectedFiles
            setInMemoryFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };
    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            const newFiles: File[] = droppedFiles
            setInMemoryFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setInMemoryFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const uploadFiles = () => {
        try {
            axios.request({
                url: upload.link ?? "NOTHING",
                headers: upload.headers,
                method: upload.method ?? "POST",
                onUploadProgress(progress: AxiosProgressEvent) {

                },
                data: files,
            }).then(response => {
                if (functions.onFinish) functions.onFinish(response);
            })
        } catch (e) {
            if (functions.onError) functions.onError(e)
        }
    }

    return (
            <section className={`border-1 rounded-lg w-fit ml-auto mr-auto ${props.styles?.container ?? ''}`}>
                <div
                    className={`p-2 flex flex-col items-center justify-center rounded-lg ${
                        inMemoryFiles.length > 0 ? "upload-box border-red-200" : "upload-box"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                >
                    <>
                        <AiOutlineCloudUpload className="text-xl"/>
                        <div className="flex items-center mb-1 text-center">

                            <div>
                                <p className={'m-0 text-md'}>Drag and drop your files here</p>
                                <p className={'m-0 text-md'}>
                                    Limit 15MB per file. Supported files: .HTML, .HTM
                                </p>
                            </div>
                        </div>
                        <input
                            type="file"
                            hidden
                            id="browse"
                            onChange={handleFileChange}
                            accept=".htm,.html"
                            multiple
                            className="hidden"
                        />
                        <label htmlFor="browse"
                               className="flex items-center justify-center p-2 border-2 rounded-md cursor-pointer hover:bg-neutral-600">
                            Browse files
                        </label>
                    </>

                    {inMemoryFiles.length > 0 && (
                        <div className="flex flex-col gap-1 w-full">
                            <div className="w-full h-full overflow-auto">
                                {inMemoryFiles.map((file, index) => (
                                    <div className="flex justify-between items-center p-1 border-1 rounded-lg"
                                         key={index}>
                                        <div className="flex flex-col gap-1 flex-1">
                                            <p>{file.name}</p>
                                        </div>
                                        <div className="cursor-pointer">
                                            <MdClear onClick={() => handleRemoveFile(index)}/>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {inMemoryFiles.length > 0 && (
                        <div className="flex items-center">
                            <AiOutlineCheckCircle
                                style={{color: "#6DC24B", marginRight: 1}}
                            />
                            <p>{inMemoryFiles.length} file(s) selected</p>
                        </div>
                    )}
                </div>
            </section>
    );
};