import React, { useState } from 'react';
// import ModalDefault from '../../../components/Modal/ModalDefault';
// import { PhotoIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebaseConfig.js";

export default function CreateProduct({ isOpen, handleOpenModal, onCreate }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      subTitle: '',
      price: '',
      description: '',
      image: null,
    },
  });

  const [image, setImage] = useState(null);
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangeImage = (event) => {
    // console.log(event.target.files[0])
    const pic = event.target.files[0];
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
    const storageRef = ref(storage, `images/${pic.name}`);
    const uploadTask = uploadBytesResumable(storageRef, pic);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress function
        setLoading(true);
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // setProgress(progress);
      },
      (error) => {
        console.error("Upload error: ", error);
      },
      async () => {
        // Complete function
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUrl(downloadURL);
        } catch (error) {
          
        } finally {
          setLoading(false);
        }
      }
    );
  };

  const onSubmit = async (data) => {
    const dataToSend = { ...data, image: url, status: 'active' };
    console.log(dataToSend);
    onCreate(dataToSend, reset);
  };

  return (
    <>
      {/* <ModalDefault isOpen={isOpen} onClose={() => handleOpenModal()}>
        <form>
          <div className="w-full overflow-y-auto max-h-[65vh]">
            <div className="col-span-full">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Title
              </label>
              <div className="mt-2">
                <input
                  id="title"
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset focus:ring-1 focus:ring-inset focus:ring-indigo-300 sm:text-sm sm:leading-6 ${
                    errors.title ? 'ring-red-500' : 'ring-gray-300'
                  }`}
                  {...register('title', { required: 'Title is required!' })}
                />
                {errors.title && (
                  <span className="text-red-500">{errors.title.message}</span>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="subTitle"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Sub-Title
              </label>
              <div className="mt-2">
                <input
                  id="subTitle"
                  {...register('subTitle', {
                    required: 'Sub-Title is required!',
                  })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.subTitle && (
                  <span className="text-red-500">
                    {errors.subTitle.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <div className="mt-2">
                <input
                  id="price"
                  {...register('price', { required: 'Price is required!' })}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors.price && (
                  <span className="text-red-500">{errors.price.message}</span>
                )}
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  {...register('description', {
                    required: 'Description is required!',
                  })}
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Image
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  {url != null ? (
                    <>
                      <img
                        src={url}
                        alt="Hình ảnh"
                      />
                      <button
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        type="button"
                        onClick={() => setUrl(null)}
                      >
                        Xóa ảnh
                      </button>
                    </>
                  ) : (
                    <>
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto h-12 w-12 text-gray-300"
                      />
                      <div className="mt-4 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="image"
                            {...register('image', {
                              // required: 'Image is required!',
                            })}
                            type="file"
                            className="sr-only"
                            onChange={handleChangeImage}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => handleOpenModal()}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </ModalDefault> */}
    </>
  );
}
