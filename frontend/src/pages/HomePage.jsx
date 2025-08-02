import { useState } from "react";
import { HOMPAGE_FEED_TYPES } from "../constants";
import CreatePost from "../compoenents/CreatePost";
import Posts from "../compoenents/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("For you");
  return (
    <main className='container'>
      <div className='w-full flex border-b border-gray-700'>
        {HOMPAGE_FEED_TYPES.map((type) => (
          <div
            key={type}
            className='flex justify-center flex-1 p-3 hover:bg-gray-900 transition duration-500 cursor-pointer relative'
            onClick={() => setFeedType(type)}
          >
            {type}
            {feedType === type && (
              <div className='absolute bottom-0 w-10 h-1 bg-primary' />
            )}
          </div>
        ))}
      </div>

      <CreatePost />

      <Posts feedType={feedType} />
    </main>
  );
};

export default HomePage;
