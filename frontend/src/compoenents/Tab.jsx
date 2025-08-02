const Tab = ({ setFeedType, text, value, feedType }) => {
  return (
    <div className='w-full flex flex-col items-center'>
      <div
        className={`w-full flex justify-center flex-1 p-2 hover:bg-gray-900 transition duration-500 relative cursor-pointer ${
          feedType === value ? "text-white" : "text-gray-500"
        } `}
        onClick={() => setFeedType(value)}
      >
        {text}
      </div>
      {feedType === value && (
        <div className='absolute bottom-0 h-1 w-8 bg-primary rounded-full' />
      )}
    </div>
  );
};

export default Tab;
