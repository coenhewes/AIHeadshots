
"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { UploadDropzone } from "react-uploader";
import { Uploader } from "uploader";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import LoadingDots from "../../components/LoadingDots";
import ResizablePanel from "../../components/ResizablePanel";
import appendNewToName from "../../utils/appendNewToName";
import downloadPhoto from "../../utils/downloadPhoto";
import DropDown from "../../components/DropDown";
import { themeType, themes } from "../../utils/dropdownTypes";

// Configuration for the uploader
const uploader = Uploader({
  apiKey: process.env.NEXT_PUBLIC_UPLOAD_API_KEY || "free",
});

const options = {
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#4F46E5", // A richer primary color for buttons & links
      error: "#EF4444", // Red for error messages
      shade100: "#111827", // Dark text for a more professional look
      shade200: "#6B7280", // Muted secondary text
      shade300: "#9CA3AF", // Hover text color
      shade400: "#D1D5DB", // Lighter elements
      shade500: "#E5E7EB", // Close button and progress indicators
      shade600: "#F3F4F6", // Background shades for drag area
      shade700: "#F9FAFB", // Light background for images
      shade800: "#FFFFFF", // Backgrounds for modal and inputs
      shade900: "#F9FAFB", // Background for file items
    },
  },
};

export default function DreamPage() {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [restoredLoaded, setRestoredLoaded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string | null>(null);
  const [theme, setTheme] = useState<themeType>("Man");

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setPhotoName(file[0].originalFile.originalFileName);
          setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
          generatePhoto(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  async function generatePhoto(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    setLoading(true);

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrl: fileUrl, theme }),
      });

      if (res.status === 429) {
        setError(
          "You've reached the daily limit for headshot generation. Please try again tomorrow!"
        );
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      const { outputUrl } = await res.json();

      setRestoredImage(outputUrl);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex max-w-6xl mx-auto flex-col items-center justify-center py-10 min-h-screen">
      <Header />
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-5">
          Create Your <span className="text-indigo-600">Professional</span> Headshot
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Upload your photo and let our AI turn it into a stunning business headshot.
        </p>
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              {!restoredImage && (
                <>
                  <div className="space-y-4 w-full max-w-sm">
                    <div className="flex mt-3 items-center space-x-3">
                      <Image
                        src="/number-1-black.svg"
                        width={30}
                        height={30}
                        alt="Step 1 icon"
                      />
                      <p className="text-left font-medium">Select Your Style</p>
                    </div>
                    <DropDown
                      theme={theme}
                      setTheme={(newTheme) => setTheme(newTheme as typeof theme)}
                      themes={themes}
                    />
                  </div>
                  <div className="mt-4 mb-2 w-full max-w-sm">
                    <div className="flex mt-6 w-96 items-center space-x-3">
                      <Image
                        src="/number-2-black.svg"
                        width={30}
                        height={30}
                        alt="Step 2 icon"
                      />
                      <p className="text-left font-medium">
                        Upload Your Photo
                      </p>
                    </div>
                  </div>
                </>
              )}
              {!originalPhoto && <UploadDropZone />}
              {originalPhoto && !restoredImage && (
                <Image
                  alt="Uploaded photo"
                  src={originalPhoto}
                  className="rounded-2xl h-96 shadow-lg"
                  width={400}
                  height={400}
                />
              )}
              {restoredImage && originalPhoto && (
                <div className="flex sm:space-x-4 sm:flex-row flex-col">
                  <div>
                    <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
                    <Image
                      alt="Original photo"
                      src={originalPhoto}
                      className="rounded-2xl w-full h-96 shadow-md"
                      width={400}
                      height={400}
                    />
                  </div>
                  <div className="sm:mt-0 mt-8">
                    <h2 className="mb-1 font-medium text-lg">Generated Headshot</h2>
                    <a href={restoredImage} target="_blank" rel="noreferrer">
                      <Image
                        alt="Generated headshot"
                        src={restoredImage}
                        className="rounded-2xl w-full h-96 shadow-md cursor-pointer"
                        width={400}
                        height={400}
                        onLoadingComplete={() => setRestoredLoaded(true)}
                      />
                    </a>
                  </div>
                </div>
              )}
              {loading && (
                <button
                  disabled
                  className="bg-indigo-600 rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 w-40"
                >
                  <LoadingDots color="white" style="large" />
                </button>
              )}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                  role="alert"
                >
                  <span>{error}</span>
                </div>
              )}
              <div className="flex space-x-8 justify-center">
                {originalPhoto && !loading && (
                  <button
                    onClick={() => {
                      setOriginalPhoto(null);
                      setRestoredImage(null);
                      setRestoredLoaded(false);
                      setError(null);
                    }}
                    className="bg-indigo-600 rounded-full text-white font-medium px-4 py-2 mt-8 hover:bg-indigo-500 transition"
                  >
                    Create Another Headshot
                  </button>
                )}
                {restoredLoaded && (
                  <button
                    onClick={() => {
                      downloadPhoto(restoredImage!, appendNewToName(photoName!));
                    }}
                    className="bg-white rounded-full text-black border font-medium px-4 py-2 mt-8 hover:bg-gray-100 transition"
                  >
                    Download Headshot
                  </button>
                )}
              </div>
              {restoredLoaded && (
                <div className="flex flex-col items-center mt-14 mb-6">
                  <p className="flex justify-center text-sm text-gray-500">
                    Generated headshots are deleted after 1 hour. Make sure to download yours!
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
}

