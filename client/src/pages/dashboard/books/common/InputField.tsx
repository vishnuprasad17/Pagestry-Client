import { FieldValues, Path, UseFormRegister } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  label: string;
  name: Path<T>;
  type?: "text" | "number" | "textarea";
  register: UseFormRegister<T>;
  placeholder: string;
}

const InputField = <T extends FieldValues>({
  label,
  name,
  type = "text",
  register,
  placeholder,
}: InputFieldProps<T>) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          {...register(name, { required: true })}
          placeholder={placeholder}
          className="p-2 border w-full rounded-md"
        />
      ) : (
        <input
          type={type}
          {...register(name, {
            required: true,
            valueAsNumber: type === "number",
          })}
          placeholder={placeholder}
          className="p-2 border w-full rounded-md"
        />
      )}
    </div>
  );
};

export default InputField;