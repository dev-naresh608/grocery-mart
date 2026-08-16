import React from "react";

function FormInput({
  icon: InputIcon,
  label,
  ...rest
}) {
  return (
    <div>
      <p className="text-[#989da4] text-sm font-semibold ">{label}</p>
      <div className="flex items-center gap-3 rounded-xl border border-gray-300 bg-[#eef0f4] px-4 py-2">
        {InputIcon && <InputIcon className="text-gray-400" size={20} />}

        <input
          className="w-full bg-transparent outline-none text-gray-600 placeholder:text-gray-400 autofill:bg-transparent text-sm "
          {...rest}
        />
      </div>
    </div>
  );
}

export default FormInput;
