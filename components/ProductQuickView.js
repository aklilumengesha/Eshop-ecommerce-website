import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { formatPrice } from "@/utils/currency";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ProductQuickView({ product, isOpen, closeModal, currency, onAddToCart }) {
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Use product images array, fallback to main image if no gallery
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-start mb-4">
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    Quick View
                  </Dialog.Title>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Image Gallery */}
                  <div>
                    <div className="relative h-96 mb-4 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={productImages[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {productImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {productImages.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImage === index
                                ? "border-blue-600"
                                : "border-gray-200 hover:border-gray-400"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`${product.name} view ${index + 1}`}
                              fill
                              className="object-contain"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex flex-col">
                    <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-3">{product.brand}</p>
                    
                    <div className="flex items-center mb-4">
                      <ReactStars
                        count={5}
                        size={24}
                        activeColor="#ffd700"
                        value={product.rating}
                        edit={false}
                      />
                      <span className="ml-2 text-gray-600">
                        ({product.numReviews} reviews)
                      </span>
                    </div>

                    <p className="text-3xl font-bold text-blue-600 mb-4">
                      {formatPrice(product.price, currency)}
                    </p>

                    <div className="mb-4">
                      <span className="font-semibold">Category: </span>
                      <span className="text-gray-600">{product.category}</span>
                    </div>

                    <div className="mb-4">
                      <span className="font-semibold">Status: </span>
                      {product.countInStock > 0 ? (
                        <span className="text-green-600 font-semibold">
                          In Stock ({product.countInStock} available)
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">Out of Stock</span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <div className="mt-auto space-y-3">
                      <button
                        onClick={() => {
                          onAddToCart(product);
                          closeModal();
                        }}
                        disabled={product.countInStock === 0}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                      
                      <button
                        onClick={closeModal}
                        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
