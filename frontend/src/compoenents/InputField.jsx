
const InputField = ({
  icon: Icon,
  name,
  id,
  type = "text",
  placeholder,
  onChange,
  value,
  label,
  readonly = false,
}) => {
  return (
    <div className='flex flex-col gap-1 flex-1'>
      {label && (
        <label className='text-sm text-white font-semibold'>{label}</label>
      )}
      <div
        className={`w-full input input-bordered rounded flex items-center gap-2 ${
          readonly && "bg-gray-900 text-white"
        }`}
      >
        {Icon && <Icon className='size-5' />}
        <input
          type={type}
          className='grow'
          placeholder={placeholder}
          name={name}
          id={id}
          onChange={onChange}
          value={value}
          readOnly={readonly}
        />
      </div>
    </div>
  );
};

export default InputField;
