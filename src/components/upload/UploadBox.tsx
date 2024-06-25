'use client'

import {AiOutlineCheckCircle, AiOutlineCloudUpload} from "react-icons/ai";
import {MdClear} from "react-icons/md";
import {ChangeEvent, DragEvent, ReactNode, useState} from "react";
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
        progress?: any,
    }
}

export default function UploadBox(props: Props) {
    const {
        functions, upload,files, general, styles
    } = props

    const [inMemoryFiles, setInMemoryFiles] = useState<File[]>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const newFiles: File[] = fileListArray(selectedFiles)
            setInMemoryFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const droppedFiles = event.dataTransfer.files;
        if (droppedFiles.length > 0) {
            const newFiles: File[] = fileListArray(droppedFiles)
            setInMemoryFiles((prevFiles) => [...prevFiles, ...newFiles]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setInMemoryFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    };

    const fileListArray = (files: FileList) => {
        const a: File[] = []

        for (let i = 0; i < files.length; i++) {
            a.push(files[i]);
        }

        return a
    }

    const uploadFiles = () => {
        try {
            axios.request({
                url: upload.link ?? "NOTHING",
                headers: upload.headers,
                method: upload.method ?? "POST",
                onUploadProgress(progress: AxiosProgressEvent) {
                    functions.progress(progress)
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
            <section className={`border-1 rounded-lg w-fit ml-auto mr-auto ${styles?.container ?? ''}`}>
                <div
                    className={`p-2 flex flex-col items-center justify-center rounded-lg ${
                        inMemoryFiles.length > 0 ? "upload-box border-red-200" : "upload-box"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={(event) => event.preventDefault()}
                >
                    <>
                        {general.uploadIcon ?? <AiOutlineCloudUpload className="text-xl"/>}
                        <div className="flex items-center mb-1 text-center">

                            <div>
                                <p className={'m-0 text-md'}>Drag and drop your files here</p>
                                <p className={'m-0 text-md'}>
                                    Limit {props.files.maxSize} per file. Supported files: {props.files.accepted?.join(', ')}
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
                    <button onClick={uploadFiles}>
                        Upload
                    </button>
                </div>
            </section>
    );
};