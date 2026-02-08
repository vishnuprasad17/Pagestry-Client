interface TextareaProps {
  label: string;
  name: string;
  placeholder: string;
  register: any;
}

const Textarea = ({ label, name, placeholder, register }: TextareaProps) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <textarea
      {...register(name, { required: true })}
      placeholder={placeholder}
      rows="4"
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all duration-200 resize-none"
    />
  </div>
);

export default Textarea;