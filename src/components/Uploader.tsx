import { useState, ChangeEvent, FormEvent, useRef } from "react";
import axios from "axios";
import { MdOutlineCloudUpload } from "react-icons/md";
export default function Uploader() {
  const [file, setFile] = useState<File | undefined>();
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ): Promise<void> {
    event.preventDefault();
    if (!file) return; // If no file selected, do nothing

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const res = await axios.post("/user/upload", formData, config);
    console.log(res.data);
    if (res.data.success) {
      setSubmitted(true);
    }
    // setFile(undefined);
  }

  return (
    <form onSubmit={handleSubmit}>
      {!submitted && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleChange}
          />
          {/* Icon styled label */}
          <label htmlFor="fileInput" onClick={handleClick}>
            <MdOutlineCloudUpload className="text-[70px] w-full" />
            {!fileInputRef.current?.files?.length && (
              <p className="text-center w-full">Click to upload</p>
            )}
          </label>
          {fileInputRef.current?.files?.length && (
            <>
              {" "}
              <p className="text-center w-full">
                {fileInputRef.current?.files[0].name}
              </p>
              <button className="text-center w-full" type="submit">
                Upload
              </button>
            </>
          )}
        </>
      )}
      {submitted && (
        <>
          <p>File uploaded successfully</p>
          <button onClick={() => setSubmitted(false)}>
            Upload another file
          </button>
        </>
      )}
    </form>
  );
}
