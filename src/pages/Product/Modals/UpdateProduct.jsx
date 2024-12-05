import React, { useEffect, useState } from 'react';
// import ModalDefault from '../../../components/Modal/ModalDefault';
// import { PhotoIcon } from '@heroicons/react/24/outline';
import { useForm } from 'react-hook-form';

export default function UpdateProduct({ isOpen, handleOpenModal, onCreate, dataDetail }) {
  const [base64String, setBase64String] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (dataDetail) {
      setValue('title', dataDetail?.title);
      setValue('subTitle', dataDetail?.subTitle);
      setValue('price', dataDetail?.price);
      setValue('description', dataDetail?.description);
      setValue('image', dataDetail?.image);
      setBase64String(dataDetail?.image)
    }
  }, [dataDetail, setValue])

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64String(reader.result);
    };
    reader.readAsDataURL(file); // Chuyển đổi tệp thành Base64
  };

  const handleChangeImage = (event) => {
    const file = event.target.files[0];
    convertToBase64(file);
  };

  const onSubmit = async (data) => {
    const dataToSend = { ...data, image: base64String };
    onCreate(dataToSend, reset);
  };

  return (
    <>
      {/* <ModalDefault isOpen={isOpen} onClose={() => handleOpenModal()}>
        {dataDetail?.title}
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
                  {base64String != '' ? (
                    <>
                      <img
                        src={base64String}
                        alt="Hình ảnh đã chuyển đổi"
                        style={{ maxWidth: '200px' }}
                      />
                      <button
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        type="button"
                        onClick={() => setBase64String('')}
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
