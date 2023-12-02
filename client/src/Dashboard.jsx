import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user] = useState({
    name: 'John Doe',
    avatar: 'https://placekitten.com/100/100'
  });

  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation after component mounts
    setFadeIn(true);
  }, []);

  return (
    <div className="w-screen">
      <div
        className={`mx-auto mt-10 p-8 bg-white rounded shadow-md transition-opacity ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ maxWidth: '400px' }}
      >
        <img
          src={user.avatar}
          alt="User Avatar"
          className="rounded-full mb-4 mx-auto"
          style={{ width: '100px', height: '100px' }}
        />
        <h2 className="text-xl font-semibold mb-2 text-center">{user.name}</h2>
        <p className="text-gray-600 text-center">Welcome to your dashboard</p>
      </div>
    </div>
  );
};

export default Dashboard;
