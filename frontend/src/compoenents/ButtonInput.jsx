import { Loader2 } from "lucide-react";

const ButtonInput = ({ text, isLoading, type = "submit" }) => {
  return (
    <button
      className='btn rounded-full btn-primary text-white mr-4 mt-3'
      type={type}
    >
      {isLoading ? (
        <>
          <Loader2 className='size-5 animate-spin' />
          Loading...
        </>
      ) : (
        <>{text}</>
      )}
    </button>
  );
};

export default ButtonInput;
