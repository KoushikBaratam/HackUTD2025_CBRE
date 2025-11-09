const Loading = ({ message = "Processing files..." }) => {
  return (
    <div className="min-h-screen bg-cbre-gray-light flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mx-auto h-16 w-16 bg-cbre-green rounded-lg flex items-center justify-center mb-6">
          <span className="text-white text-2xl font-bold">CC</span>
        </div>

        {/* Loading Spinner */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 border-4 border-cbre-gray-light border-t-cbre-green rounded-full animate-spin"></div>
        </div>

        {/* Loading Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {message}
        </h3>
        <p className="text-sm text-gray-600">
          Please wait while we process your documents
        </p>

        {/* Loading Dots Animation */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-cbre-green rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-cbre-green rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-cbre-green rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;

