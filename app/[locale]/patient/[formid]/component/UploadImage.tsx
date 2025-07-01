import { useId, useState, FC, ChangeEvent } from "react";
import Image from "next/image";
import CircularProgress from "@mui/material/CircularProgress";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import imageCompression from "browser-image-compression";
import TeethPlaceholder from "../../../../../public/Images/teethPlaceholder.jpeg";
import FacePlaceholder from "../../../../../public/Images/facePlaceholder.jpeg";
import ThroatPlaceholder from "../../../../../public/Images/throatPlaceholder.jpeg";
import AskLogo from "../../../../../public/Images/logo.jpeg";
import { Box, Typography } from "@mui/material";

// Assuming the placeholder is imported directly, adjust the path as necessary
// import placeholderImg from '../public/placeholder.jpg'; // Make sure the path matches your project structure

interface UploadPageProps {
  type: string;
  onChange: (value: string) => void;
  error?: string;
  placeholderImg?: string;
}

const UploadImage: FC<UploadPageProps> = ({
  type,
  onChange,
  error,
  placeholderImg,
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setLoading(true);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(selectedFile, options);
      const reader = new FileReader();

      reader.onload = () => {
        const base64Preview = reader.result as string;
        setImage(compressedFile);
        setImagePreview(base64Preview);
        onChange(base64Preview);
        setLoading(false);
      };

      reader.readAsDataURL(compressedFile);
    } catch (error) {
      setLoading(false);
      console.error("Image compression error:", error);
    }
  };

  const id = useId();

  const handleDivClick = () => {
    try {
      const fileInput = document.getElementById(
        `${id}-fileInput`
      ) as HTMLInputElement;
      fileInput?.click();
    } catch (error) {
      console.error("Handle Div Click Error:", error);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setImagePreview(null);
    onChange("");
  };

  let imagePlaceholder;
  if (placeholderImg === "teeth") {
    imagePlaceholder = TeethPlaceholder;
  } else if (placeholderImg === "throat") {
    imagePlaceholder = ThroatPlaceholder;
  } else if (placeholderImg === "face") {
    imagePlaceholder = FacePlaceholder;
  } else {
    imagePlaceholder = AskLogo;
  }

  return (
    <div>
      <div
        style={{
          position: "relative",
          width: type === "Signature" ? 100 : 200,
          height: type === "Signature" ? 100 : 200,
          border: "1px solid #ccc",
          borderRadius: 20,
          marginRight: 40,
        }}
        onClick={handleDivClick}
      >
        {loading ? (
          <CircularProgress
            style={{
              position: "absolute",
              top: "40%",
              left: "40%",
              transform: "translate(-50%, -50%)",
            }}
          />
        ) : imagePreview ? (
          <>
            <Image
              src={imagePreview}
              alt="Uploaded"
              layout="fill"
              objectFit="cover"
              style={{ borderRadius: 20 }}
            />
          </>
        ) : (
          <div style={{ marginBottom: 10 }}>
            <Image
              src={imagePlaceholder}
              alt="Placeholder"
              layout="fill"
              objectFit="inherit"
              style={{ borderRadius: 20 }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                backgroundColor: "rgba(200, 200, 200, 0.8)",
                padding: "5px 0",
                borderRadius: "0 0 20px 20px",
                textAlign: "center",
              }}
            >
              <Typography>{type}</Typography>
            </div>
          </div>
        )}
        {imagePreview && (
          <div
            style={{ position: "absolute", top: 5, right: 5 }}
            onClick={handleDeleteImage}
          >
            <HighlightOffIcon />
          </div>
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="file"
        id={`${id}-fileInput`}
        accept="image/png, image/jpeg"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default UploadImage;
