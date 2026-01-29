export const Input = ({ label, type = 'text', value, onChange, placeholder, required }) => {
  return (
    <div className="form-group">
      {label && <label className="label">{label}</label>}
      <input
        type={type}
        className="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};
