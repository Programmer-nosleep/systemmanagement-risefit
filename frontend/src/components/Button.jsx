const Button = ({ text, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-medium"
    >
      {text}
    </button>
  );
};

export default Button;
