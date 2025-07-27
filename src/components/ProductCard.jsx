export default function ProductCard({ product, onAddToCart, onBuyNow }) {
  return (
    <div
      className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 w-full max-w-xs mx-auto"
      style={{ minWidth: "220px" }}
    >
      {/* Sticker Badge */}
      <img
        src={
          product.stickerUrl ||
          "https://res.cloudinary.com/dfolw8zvb/image/upload/v1753633003/vendor_lxhoft.png"
        }
        alt="sticker"
        className="absolute top-3 right-3 w-9 h-9 object-contain z-10"
        loading="lazy"
      />

      {/* Product Image */}
      <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-white shadow-inner mb-4 flex items-center justify-center">
        <img
          src={
            product.imageUrl ||
            "https://res.cloudinary.com/dfolw8zvb/image/upload/v1753633002/vegetable_xs1aso.png"
          }
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="text-center space-y-1 px-1">
        <h3
          className="text-base font-semibold text-green-500 line-clamp-2 leading-tight"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="text-sm text-gray-300">
          ₹{" "}
          <span className="text-emerald-400 font-semibold">
            {product.price}
          </span>{" "}
          / {product.unit}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => onAddToCart(product)}
          className="flex-1 bg-emerald-400 text-black font-semibold py-2 rounded-lg hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition duration-150"
          aria-label={`Add ${product.name} to cart`}
        >
          ➕ Add to Cart
        </button>

        <button
          onClick={() => onBuyNow?.(product)}
          className="flex-1 bg-teal-600 text-white font-semibold py-2 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-600 transition duration-150"
          aria-label={`Buy ${product.name} now`}
        >
          🛒 Buy Now
        </button>
      </div>
    </div>
  );
}
