import { useState } from 'react';

const OtpPage = () => {
  const [otp, setOtp] = useState('');

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Allow only digits
    setOtp(value);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-screen text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md max-w-md w-full">
        <h2 className="text-2xl mb-4">Enter 4-Digit OTP</h2>
        <input
          type="text"
          maxLength="4"
          value={otp}
          onChange={handleOtpChange}
          placeholder="1234"
          className="w-full py-2 px-3 mb-4 bg-gray-700 border rounded text-white focus:outline-none focus:border-green-400"
        />
        <button
          disabled={otp.length !== 4}
          className={`w-full py-2 px-4 bg-green-500 rounded ${
            otp.length !== 4 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default OtpPage;
